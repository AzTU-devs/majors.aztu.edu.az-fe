/**
 * Server-side API access.
 *
 * Pages render their primary content on the server from this module, so the
 * crawled HTML carries the catalogue itself rather than loading skeletons.
 * The client components keep using axios (`src/util/apiClient.ts`) for the
 * interactive parts (catalogue filters, "try again").
 *
 * Every helper distinguishes three outcomes:
 *   - the data                      -> returned
 *   - "this record does not exist"  -> null / [] (pages render notFound())
 *   - "the API could not answer"    -> throws ApiUnavailableError
 * Previously an outage collapsed into "not found", so a backend hiccup served
 * a 404 for every programme (and told crawlers the pages were gone).
 */

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { API_BASE_URL } from "@/util/apiClient";
import type { Clo } from "@/services/clo/clo";
import type { CloPloMatch } from "@/services/cloPloMatch/cloPloMatchService";
import type { Competency } from "@/services/competency/competencyService";
import type { SubjectCompetencyMatch } from "@/services/competencyMatch/competencyMatchService";
import type { SubjectDetails } from "@/services/curricula/curricula";
import type { Gco } from "@/services/gco/gcoService";
import type { Literature } from "@/services/literature/literatureService";
import type { PloInterface } from "@/services/plo/ploService";
import type { SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";
import type { Tlo } from "@/services/tlo/tloService";
import type { Topic } from "@/services/topic/topic";
import { clean, type Locale } from "./site";

/**
 * How long server-side catalogue reads may be reused. Edits and deletions
 * made in the admin panel reach the public site within this window (plus one
 * request). Override with API_REVALIDATE_SECONDS; 0 disables the cache.
 */
const REVALIDATE_SECONDS = (() => {
  const raw = process.env.API_REVALIDATE_SECONDS;
  const n = raw === undefined || raw === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 60;
})();

/** A server render must not hang on a stalled API. */
const TIMEOUT_MS = 10_000;

/**
 * Total time one server render may spend waiting for the API. Each read has
 * its own 10 s timeout, but a page that reads in sequence (every page of a
 * paged list, then the records it lists) could still wait minutes on a slow
 * API. Once the budget is spent, further reads fail fast with
 * ApiUnavailableError — the section shows its error state (or the page its
 * error page) instead of the request hanging.
 */
const RENDER_BUDGET_MS = 20_000;

/** Per request (React's cache is scoped to one server render). */
const renderDeadline = cache(() => ({ at: Date.now() + RENDER_BUDGET_MS }));

export class ApiUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

/** The status the backend reports in the body; endpoints disagree on the field name. */
function bodyStatus(body: unknown): number | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  const raw = b.statusCode ?? b.status_code ?? b.status;
  return typeof raw === "number" ? raw : undefined;
}

/**
 * GET a JSON body, uncached. Resolves to null when the API reports "not found
 * / no content" (HTTP 404, or HTTP 200 with a body status of 204/404); throws
 * ApiUnavailableError for network errors, timeouts, 5xx and error bodies.
 */
async function fetchJson(path: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ApiUnavailableError(`GET ${path}: request failed`);
  }

  if (res.status === 404) return null;
  if (!res.ok) throw new ApiUnavailableError(`GET ${path}: HTTP ${res.status}`);

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ApiUnavailableError(`GET ${path}: invalid JSON`);
  }

  const status = bodyStatus(body);
  if (status === 204 || status === 404) return null;
  if (status !== undefined && status >= 400) {
    throw new ApiUnavailableError(`GET ${path}: body status ${status}`);
  }
  return body;
}

/**
 * The cached read.
 *
 * Deliberately not `fetch(..., { next: { revalidate } })`: Next's fetch cache
 * only stores HTTP 200 responses, and serves a stale entry while it refetches
 * in the background. When a record is deleted the API answers 404, which is
 * never written back, so the stale 200 was served *indefinitely* (and the
 * on-disk cache survives restarts) — deleted programmes, subjects and
 * faculties kept resolving. unstable_cache stores the function's result
 * itself, so a "not found" (null) replaces the old entry on the next refresh,
 * while a failed refresh (thrown error) keeps serving the last good answer.
 */
const cachedFetchJson =
  REVALIDATE_SECONDS > 0
    ? unstable_cache(fetchJson, ["majors-api-v1"], { revalidate: REVALIDATE_SECONDS })
    : fetchJson;

async function getJson<T>(path: string): Promise<T | null> {
  const left = renderDeadline().at - Date.now();
  if (left <= 0) throw new ApiUnavailableError(`GET ${path}: render time budget spent`);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const budget = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ApiUnavailableError(`GET ${path}: render time budget spent`)), left);
  });
  try {
    return ((await Promise.race([cachedFetchJson(path), budget])) as T | null) ?? null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * For reads that only decorate a page (headline counts, JSON-LD, sitemap):
 * an outage yields the fallback instead of failing the whole page.
 */
export async function orFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

/** Outcome of a read whose failure the page shows as an error state (with retry). */
export type Settled<T> = { ok: true; data: T } | { ok: false };

/**
 * For a page's primary section: the data, or `{ ok: false }` when the API
 * could not answer — the section then renders its error state instead of an
 * empty list, and the page around it (header, tabs) stays usable.
 */
export async function settle<T>(promise: Promise<T>): Promise<Settled<T>> {
  try {
    return { ok: true, data: await promise };
  } catch {
    return { ok: false };
  }
}

/**
 * Run `fn` over `items` with at most `limit` calls in flight, keeping order.
 * Per-item reads (a CLO list per subject, TLOs per topic) would otherwise fire
 * hundreds of requests at the API at once.
 */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export interface SpecialtySummary {
  /** Immutable identity: use for URLs, React keys and de-duplication. */
  specialty_key: string;
  /** Display code; not unique. */
  specialty_code: string;
  specialty_name: string;
  cafedra_name?: string | null;
  degree?: number;
  /** When the programme's translation was created (ISO), if the API reports it. */
  created_at?: string | null;
}

export interface FacultySummary {
  faculty_code: string;
  faculty_name: string;
}

export interface CafedraSummary {
  cafedra_code: string;
  cafedra_name: string;
}

export interface SubjectSummary {
  /** Immutable identity: use for URLs and React keys. */
  subject_key: string;
  /** Display code; not unique. */
  subject_code: string;
  subject_name: string;
  semester?: number;
  credit?: number;
  status?: number;
  year?: string;
  hours_per_week?: number;
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Read every page of a `start`/`end` list endpoint. A missing page (null)
 * ends the list; the reported total decides whether to continue.
 */
async function getAllPages<T>(
  path: (start: number, end: number) => string,
  pick: (body: Record<string, unknown>) => { items: T[]; total: number | undefined },
  pageSize = 200,
  maxPages = 50
): Promise<T[]> {
  const all: T[] = [];
  for (let page = 0; page < maxPages; page++) {
    const start = page * pageSize;
    const body = await getJson<Record<string, unknown>>(path(start, start + pageSize));
    if (!body) break;
    const { items, total } = pick(body);
    all.push(...items);
    // `total` counts stored rows; rows without a translation are skipped
    // server-side, so compare against the window, not the items returned.
    if (typeof total !== "number" || start + pageSize >= total) break;
  }
  return all;
}

const cleanSpecialty = (s: SpecialtySummary): SpecialtySummary => ({
  ...s,
  specialty_name: clean(s.specialty_name),
  cafedra_name: s.cafedra_name ? clean(s.cafedra_name) : s.cafedra_name,
});

/**
 * Programmes, optionally of one degree level and/or one faculty. Throws
 * ApiUnavailableError.
 *
 * There is deliberately no free-text parameter: the catalogue search filters
 * the cached full list in memory (src/lib/search.ts). Forwarding the visitor's
 * term to the API made every distinct term a new entry in the server's data
 * cache, on disk, without bound.
 */
const listSpecialties = cache(
  async (locale: Locale, degree?: 1 | 2, facultyCode?: string): Promise<SpecialtySummary[]> => {
    const params = new URLSearchParams({ lang: locale });
    if (degree) params.set("degree", String(degree));
    if (facultyCode) params.set("faculty_code", facultyCode);
    const data = await getJson<{ specialties?: SpecialtySummary[] }>(
      `/api/specialties?${params.toString()}`
    );
    const list = Array.isArray(data?.specialties) ? data.specialties : [];
    return uniqueBy(list, (s) => s.specialty_key).map(cleanSpecialty);
  }
);

/** Programmes of one degree level (or all). Throws ApiUnavailableError. */
export const fetchSpecialties = cache(
  async (locale: Locale, degree?: 1 | 2): Promise<SpecialtySummary[]> => listSpecialties(locale, degree)
);

/*
  Keys from the URL are checked against the cached lists before any per-key
  read. Every per-key read is cached (one entry per key), so reading first and
  checking afterwards let random keys (/programmes/<anything>, …/og/…) write a
  new cache entry each — an unbounded on-disk cache. The lists are refreshed
  like every read, so a deleted record still disappears within the window.
*/

/** The programme's catalogue entry, or null when the key is unknown. Throws ApiUnavailableError. */
export const knownSpecialty = cache(async (key: string, locale: Locale): Promise<SpecialtySummary | null> => {
  const list = await fetchSpecialties(locale);
  return list.find((s) => s.specialty_key === key) ?? null;
});

/** All faculties. Throws ApiUnavailableError. */
export const fetchFaculties = cache(async (locale: Locale): Promise<FacultySummary[]> => {
  const data = await getJson<{ faculties?: FacultySummary[] }>(`/api/faculties?lang=${locale}`);
  const list = Array.isArray(data?.faculties) ? data.faculties : [];
  return uniqueBy(list, (f) => f.faculty_code).map((f) => ({
    ...f,
    faculty_name: clean(f.faculty_name),
  }));
});

/**
 * Departments of a faculty, or null when the faculty does not exist.
 * Throws ApiUnavailableError.
 */
export const fetchCafedras = cache(
  async (facultyCode: string, locale: Locale): Promise<CafedraSummary[] | null> => {
    const faculties = await fetchFaculties(locale);
    if (!faculties.some((f) => f.faculty_code === facultyCode)) return null;
    const data = await getJson<{ cafedras?: CafedraSummary[] }>(
      `/api/cafedras/${encodeURIComponent(facultyCode)}?lang=${locale}`
    );
    if (!data) return null;
    const list = Array.isArray(data.cafedras) ? data.cafedras : [];
    return uniqueBy(list, (c) => c.cafedra_code).map((c) => ({
      ...c,
      cafedra_name: clean(c.cafedra_name),
    }));
  }
);

/**
 * Every programme run by a department, reading all pages (the endpoint
 * defaults to 10 rows and answers 404 for a department without programmes).
 * Throws ApiUnavailableError.
 */
export const fetchCafedraSpecialties = cache(
  async (cafedraCode: string, locale: Locale): Promise<SpecialtySummary[]> => {
    const items = await getAllPages<SpecialtySummary>(
      (start, end) =>
        `/api/specialties/${encodeURIComponent(cafedraCode)}?lang=${locale}&start=${start}&end=${end}`,
      (body) => ({
        items: Array.isArray(body.specialties) ? (body.specialties as SpecialtySummary[]) : [],
        total: typeof body.total === "number" ? body.total : undefined,
      })
    );
    return uniqueBy(items, (s) => s.specialty_key).map(cleanSpecialty);
  }
);

/** One programme, or null when the key is unknown. Throws ApiUnavailableError. */
export const fetchSpecialty = cache(
  async (
    key: string,
    locale: Locale
  ): Promise<{ specialty_code: string; specialty_name: string; degree: 1 | 2 } | null> => {
    if (!(await knownSpecialty(key, locale))) return null;
    const data = await getJson<{
      specialty_code?: string;
      specialty_name?: string;
      degree?: number;
    }>(`/api/specialty/${encodeURIComponent(key)}?lang=${locale}`);
    if (!data?.specialty_name) return null;
    return {
      specialty_code: data.specialty_code ?? "",
      specialty_name: clean(data.specialty_name),
      degree: data.degree === 2 ? 2 : 1,
    };
  }
);

/** A programme's description and degree requirements, or null. Throws ApiUnavailableError. */
export const fetchSpecialtyCharacteristics = cache(
  async (key: string, locale: Locale): Promise<SpecialtyChar | null> => {
    const data = await getJson<{ characteristics?: SpecialtyChar[] }>(
      `/api/specialty-characteristics/${encodeURIComponent(key)}?lang=${locale}`
    );
    return Array.isArray(data?.characteristics) ? (data.characteristics[0] ?? null) : null;
  }
);

/** Programme learning outcomes. Throws ApiUnavailableError. */
export const fetchPlos = cache(async (key: string, locale: Locale): Promise<PloInterface[]> => {
  const data = await getJson<{ plos?: PloInterface[] }>(
    `/api/plo/${encodeURIComponent(key)}?lang=${locale}`
  );
  return Array.isArray(data?.plos) ? data.plos.filter((p) => p.plo_content?.trim()) : [];
});

/** Graduate career opportunities. Throws ApiUnavailableError. */
export const fetchGcos = cache(async (key: string, locale: Locale): Promise<Gco[]> => {
  const data = await getJson<{ gcos?: Gco[] }>(`/api/gco/${encodeURIComponent(key)}?lang=${locale}`);
  return Array.isArray(data?.gcos) ? data.gcos : [];
});

/** Programme competencies. Throws ApiUnavailableError. */
export const fetchCompetencies = cache(
  async (key: string, locale: Locale): Promise<Competency[]> => {
    const data = await getJson<{ competencies?: Competency[] }>(
      `/api/competency/${encodeURIComponent(key)}?lang=${locale}`
    );
    return Array.isArray(data?.competencies) ? data.competencies : [];
  }
);

/** Subjects matched to one competency. Throws ApiUnavailableError. */
export const fetchCompetencyMatches = cache(
  async (competencyCode: string): Promise<SubjectCompetencyMatch[]> => {
    // Encoded: a code containing "/", "#", "?" or a space otherwise hits a
    // different (or no) route.
    const data = await getJson<{ data?: SubjectCompetencyMatch[] }>(
      `/api/competency-match/competency/${encodeURIComponent(competencyCode)}`
    );
    return Array.isArray(data?.data) ? data.data : [];
  }
);

/**
 * One subject's full record, or null when the key is unknown. Throws
 * ApiUnavailableError.
 *
 * A shared (general) subject has one curriculum row per programme, each with
 * its own semester, credits and year; `specialtyKey` selects that programme's
 * row (without it the API answers with the first one). A subject that is not
 * (or no longer) in that programme's curriculum is null.
 */
export const fetchSubject = cache(
  async (key: string, locale: Locale, specialtyKey: string): Promise<SubjectDetails | null> => {
    // Only a subject of this programme's curriculum (which checks the programme).
    const curriculum = await fetchCurriculum(specialtyKey, locale);
    if (!curriculum.some((s) => s.subject_key === key)) return null;
    const data = await getJson<{ subject_details?: SubjectDetails }>(
      `/api/curricula/${encodeURIComponent(key)}?lang=${locale}&specialty_key=${encodeURIComponent(specialtyKey)}`
    );
    const details = data?.subject_details;
    if (!details?.subject_name) return null;
    return {
      ...details,
      subject_code: details.subject_code ?? "",
      subject_name: clean(details.subject_name),
    };
  }
);

/**
 * Every subject of a programme, reading all pages (the endpoint defaults to
 * 10 rows); [] for an unknown programme. Throws ApiUnavailableError.
 */
export const fetchCurriculum = cache(
  async (specialtyKey: string, locale: Locale): Promise<SubjectSummary[]> => {
    if (!(await knownSpecialty(specialtyKey, locale))) return [];
    const all = await getAllPages<SubjectSummary>(
      (start, end) =>
        `/api/curricula/${encodeURIComponent(specialtyKey)}/subjects?start=${start}&end=${end}&lang=${locale}`,
      (body) => ({
        items: Array.isArray(body.subjects) ? (body.subjects as SubjectSummary[]) : [],
        total: typeof body.total_subjects === "number" ? body.total_subjects : undefined,
      })
    );
    return uniqueBy(all, (s) => s.subject_key).map((s) => ({
      ...s,
      subject_name: clean(s.subject_name),
    }));
  }
);

/** Course learning outcomes of a subject. Throws ApiUnavailableError. */
export const fetchClos = cache(async (subjectKey: string, locale: Locale): Promise<Clo[]> => {
  const data = await getJson<{ clos?: Clo[] }>(
    `/api/clo/${encodeURIComponent(subjectKey)}?lang=${locale}`
  );
  return Array.isArray(data?.clos) ? data.clos.filter((c) => c.clo_content?.trim()) : [];
});

/** CLO → PLO matches of a subject's outcomes. Throws ApiUnavailableError. */
export const fetchCloPloMatches = cache(async (subjectKey: string): Promise<CloPloMatch[]> => {
  const data = await getJson<{ data?: CloPloMatch[] }>(
    `/api/clo-plo-match/subject/${encodeURIComponent(subjectKey)}`
  );
  return Array.isArray(data?.data) ? data.data : [];
});

/** Every topic of a subject, reading all pages. Throws ApiUnavailableError. */
export const fetchTopics = cache(async (subjectKey: string, locale: Locale): Promise<Topic[]> => {
  const topics = await getAllPages<Topic>(
    (start, end) =>
      `/api/topic/${encodeURIComponent(subjectKey)}?start=${start}&end=${end}&lang=${locale}`,
    (body) => ({
      items: Array.isArray(body.topics) ? (body.topics as Topic[]) : [],
      total: typeof body.total === "number" ? body.total : undefined,
    })
  );
  return uniqueBy(topics, (t) => t.topic_key);
});

/** Topic learning outcomes (untranslated ones dropped). Throws ApiUnavailableError. */
export const fetchTlos = cache(async (topicKey: string, locale: Locale): Promise<Tlo[]> => {
  const data = await getJson<{ tlos?: Tlo[] }>(
    `/api/tlo/topic/${encodeURIComponent(topicKey)}?lang=${locale}`
  );
  // An outcome without a translation would render as an empty bullet.
  return Array.isArray(data?.tlos) ? data.tlos.filter((t) => t.tlo_content?.trim()) : [];
});

/** A subject's reading list, all pages, in the requested language. Throws ApiUnavailableError. */
export const fetchLiteratures = cache(
  async (subjectKey: string, locale: Locale): Promise<Literature[]> =>
    getAllPages<Literature>(
      (start, end) =>
        `/api/literature/subject/${encodeURIComponent(subjectKey)}?start=${start}&end=${end}&lang=${locale}`,
      (body) => ({
        items: Array.isArray(body.literatures) ? (body.literatures as Literature[]) : [],
        total: typeof body.total === "number" ? body.total : undefined,
      })
    )
);

/*
  Batch endpoints.

  The backend answers several per-item loops (TLOs per topic, CLOs per
  subject, matches per competency) with one programme- or subject-wide call.
  An older backend does not have those routes and answers 404, which getJson
  reports as null — the callers then fall back to the per-item calls, so the
  front end and the API can be deployed in either order.
*/

/** Every TLO of a subject's topics in one call, or null when the route is missing. */
const fetchSubjectTlosBatch = cache(
  async (subjectKey: string, locale: Locale): Promise<Tlo[] | null> => {
    const data = await getJson<{ tlos?: Tlo[] }>(
      `/api/tlo/subject/${encodeURIComponent(subjectKey)}?lang=${locale}`
    );
    if (!data) return null;
    return Array.isArray(data.tlos) ? data.tlos.filter((t) => t.tlo_content?.trim()) : [];
  }
);

/** Topics of a subject, each with its learning outcomes. Throws ApiUnavailableError. */
export const fetchTopicsWithTlos = cache(
  async (subjectKey: string, locale: Locale): Promise<(Topic & { tlos: Tlo[] })[]> => {
    const [topics, batch] = await Promise.all([
      fetchTopics(subjectKey, locale),
      fetchSubjectTlosBatch(subjectKey, locale),
    ]);
    if (batch) {
      const byTopic = new Map<string, Tlo[]>();
      for (const tlo of batch) {
        const list = byTopic.get(tlo.topic_key);
        if (list) list.push(tlo);
        else byTopic.set(tlo.topic_key, [tlo]);
      }
      return topics.map((t) => ({ ...t, tlos: byTopic.get(t.topic_key) ?? [] }));
    }
    const tlos = await mapLimit(topics, 8, (t) => fetchTlos(t.topic_key, locale));
    return topics.map((t, i) => ({ ...t, tlos: tlos[i] }));
  }
);

/**
 * The programme-wide CLO batch keyed by subject_key, or null when the backend
 * has no batch route. Throws ApiUnavailableError.
 */
export const fetchProgrammeClosBatch = cache(
  async (specialtyKey: string, locale: Locale): Promise<Map<string, Clo[]> | null> => {
    const batch = await getJson<{ clos?: Clo[] }>(
      `/api/clo/specialty/${encodeURIComponent(specialtyKey)}?lang=${locale}`
    );
    if (!batch) return null;
    const byKey = new Map<string, Clo[]>();
    for (const clo of Array.isArray(batch.clos) ? batch.clos : []) {
      if (!clo.subject_key || !clo.clo_content?.trim()) continue;
      const list = byKey.get(clo.subject_key);
      if (list) list.push(clo);
      else byKey.set(clo.subject_key, [clo]);
    }
    return byKey;
  }
);

/**
 * The course learning outcomes of every subject in a programme, keyed by
 * subject_key (subjects without outcomes are absent). Throws ApiUnavailableError.
 */
export const fetchProgrammeClos = cache(
  async (
    specialtyKey: string,
    locale: Locale,
    subjects: readonly SubjectSummary[]
  ): Promise<Map<string, Clo[]>> => {
    const batch = await fetchProgrammeClosBatch(specialtyKey, locale);
    if (batch) return batch;
    const byKey = new Map<string, Clo[]>();
    const lists = await mapLimit(subjects, 8, (s) => fetchClos(s.subject_key, locale));
    subjects.forEach((s, i) => {
      if (lists[i].length) byKey.set(s.subject_key, lists[i]);
    });
    return byKey;
  }
);

/**
 * Subject↔competency matches of one programme as "competency__subject" keys.
 * Throws ApiUnavailableError.
 */
export const fetchProgrammeCompetencyMatches = cache(
  async (specialtyKey: string, competencies: readonly Competency[]): Promise<Set<string>> => {
    const keys = new Set<string>();
    const batch = await getJson<{ data?: SubjectCompetencyMatch[] }>(
      `/api/competency-match/specialty/${encodeURIComponent(specialtyKey)}`
    );
    if (batch) {
      for (const m of Array.isArray(batch.data) ? batch.data : []) {
        keys.add(`${m.competency_code}__${m.subject_key}`);
      }
      return keys;
    }
    const lists = await mapLimit(competencies, 6, (c) => fetchCompetencyMatches(c.competency_code));
    competencies.forEach((c, i) => {
      for (const m of lists[i]) keys.add(`${c.competency_code}__${m.subject_key}`);
    });
    return keys;
  }
);

export interface FacultyIndex {
  faculties: FacultySummary[];
  /** specialty_key -> faculty_code */
  facultyOf: Record<string, string>;
  /** faculty_code -> programme counts (null when that faculty's read failed) */
  counts: Record<string, { total: number; bachelor: number; master: number } | null>;
}

/**
 * Which faculty each programme belongs to, and how many programmes each
 * faculty runs. The listing endpoint does not report the faculty, so this
 * reads the faculty-filtered list once per faculty (cached like every read).
 * Throws ApiUnavailableError when the faculty list itself is unavailable.
 */
export const fetchFacultyIndex = cache(async (locale: Locale): Promise<FacultyIndex> => {
  const faculties = await fetchFaculties(locale);
  const lists = await mapLimit(faculties, 6, (f) =>
    listSpecialties(locale, undefined, f.faculty_code).then(
      (list) => list,
      () => null
    )
  );
  const facultyOf: Record<string, string> = {};
  const counts: FacultyIndex["counts"] = {};
  faculties.forEach((f, i) => {
    const list = lists[i];
    if (!list) {
      counts[f.faculty_code] = null;
      return;
    }
    let bachelor = 0;
    let master = 0;
    for (const s of list) {
      if (!(s.specialty_key in facultyOf)) facultyOf[s.specialty_key] = f.faculty_code;
      if (s.degree === 2) master++;
      else bachelor++;
    }
    counts[f.faculty_code] = { total: list.length, bachelor, master };
  });
  return { faculties, facultyOf, counts };
});
