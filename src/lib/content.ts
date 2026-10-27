/**
 * What a programme or subject page actually contains, in each language.
 *
 * Two questions, answered from the same cached reads the pages render from:
 *
 *  - Is the tab's main content empty? An empty tab ("no outcomes have been
 *    published yet") is noindex and is left out of the sitemap.
 *  - Does the English page have English content of its own? The API answers
 *    an English request for a record without an English row with the
 *    Azerbaijani text. An English page whose main content is that fallback
 *    canonicalises to the Azerbaijani page, and neither page lists it as an
 *    hreflang alternate (the sitemap agrees, see app/sitemap.xml/route.ts).
 *
 * Fallback records on an English page are marked `lang: "az"`, so they are
 * rendered with lang="az" (screen readers switch voice, translators and
 * search engines see the real language).
 *
 * A record is a fallback when the API says so (`language_code` other than
 * "en", where the endpoint reports it) or, where it does not, when its text
 * equals the Azerbaijani record's.
 */
import { cache } from "react";

import {
  fetchCloPloMatches,
  fetchClos,
  fetchCompetencies,
  fetchCurriculum,
  fetchGcos,
  fetchPlos,
  fetchProgrammeClosBatch,
  fetchProgrammeCompetencyMatches,
  fetchSpecialtyCharacteristics,
  fetchSubject,
  fetchTopics,
  fetchTopicsWithTlos,
  orFallback,
  type SubjectSummary,
} from "./api";
import { programmeTranslated } from "./catalogue";
import type { ProgrammeSection, SubjectSection } from "./sections";
import { isTranslated } from "./seo";
import type { Locale } from "./site";
import type { Clo } from "@/services/clo/clo";
import type { Competency } from "@/services/competency/competencyService";
import type { Gco } from "@/services/gco/gcoService";
import type { PloInterface } from "@/services/plo/ploService";
import type { SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";
import type { Tlo } from "@/services/tlo/tloService";
import type { Topic } from "@/services/topic/topic";

/** A record shown on an English page in its Azerbaijani fallback. */
export type Marked<T> = T & { lang?: "az" };

type Texts = (string | null | undefined)[];

interface Spec<T> {
  /** Identity shared by the en and az answers. */
  id: (item: T, index: number) => string;
  /** The texts that make up the record's content. */
  texts: (item: T) => Texts;
}

const code = (value: string | number | null | undefined, index: number) =>
  value === null || value === undefined || value === "" ? `#${index}` : String(value);

export const PLO: Spec<PloInterface> = { id: (p, i) => code(p.plo_code ?? p.id, i), texts: (p) => [p.plo_content] };
export const COMPETENCY: Spec<Competency> = { id: (c, i) => code(c.competency_code ?? c.id, i), texts: (c) => [c.competency_content] };
export const GCO: Spec<Gco> = { id: (g, i) => code(g.career_code ?? g.id, i), texts: (g) => [g.career_title, g.career_content] };
export const CLO: Spec<Clo> = { id: (c, i) => code(c.clo_code, i), texts: (c) => [c.clo_content] };
export const SUBJECT: Spec<SubjectSummary> = { id: (s) => s.subject_key, texts: (s) => [s.subject_name] };
const TLO: Spec<Tlo> = { id: (t, i) => code(t.tlo_code, i), texts: (t) => [t.tlo_content] };
const TOPIC: Spec<Topic> = { id: (t) => t.topic_key, texts: (t) => [t.topic_name, t.topic_desc] };

function joinRequirements(value: SpecialtyChar["degree_requirements"] | string[] | null | undefined) {
  return Array.isArray(value) ? value.join("\n") : value;
}
const CHARS = (c: SpecialtyChar | null) => [c?.program_desc, joinRequirements(c?.degree_requirements)];

/** Whether an English record is the Azerbaijani fallback of `twin`'s texts. */
function isFallback(item: object, texts: Texts, twinTexts: Texts | undefined): boolean {
  const reported = (item as { language_code?: unknown }).language_code;
  if (typeof reported === "string" && reported) return reported !== "en";
  if (!twinTexts || !texts.some((t) => t?.trim())) return false;
  return texts.every((t, i) => !isTranslated(twinTexts[i], t));
}

/**
 * Mark the fallback records of an English list. `translated` is false when
 * the list has no record of its own in English (an empty list has none).
 */
export function markList<T extends object>(
  en: readonly T[],
  az: readonly T[] | null,
  spec: Spec<T>
): { items: Marked<T>[]; translated: boolean } {
  // Codes can repeat within a list (two outcomes "TLO-1"): the n-th record
  // with a code is the twin of the n-th one in the other language.
  const ids = (list: readonly T[]) => {
    const seen = new Map<string, number>();
    return list.map((t, i) => {
      const base = spec.id(t, i);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return `${base}~${n}`;
    });
  };
  const azIds = ids(az ?? []);
  const twins = new Map((az ?? []).map((t, i) => [azIds[i], t]));
  const enIds = ids(en);
  let own = 0;
  const items = en.map((item, i) => {
    const twin = twins.get(enIds[i]);
    if (isFallback(item, spec.texts(item), twin ? spec.texts(twin) : undefined)) return { ...item, lang: "az" as const };
    own++;
    return item;
  });
  return { items, translated: own > 0 };
}

/** The page's list in its locale, with fallbacks marked on an English page. */
export async function marked<T extends object>(
  locale: Locale,
  load: (locale: Locale) => Promise<T[]>,
  spec: Spec<T>
): Promise<Marked<T>[]> {
  const items = await load(locale);
  if (locale !== "en") return items;
  return markList(items, await orFallback(load("az"), null), spec).items;
}

/** Topics with their outcomes; on an English page, fallbacks are marked on both. */
export async function markedTopics(locale: Locale, subjectKey: string): Promise<(Marked<Topic> & { tlos: Marked<Tlo>[] })[]> {
  const topics = await fetchTopicsWithTlos(subjectKey, locale);
  if (locale !== "en") return topics;
  const az = await orFallback(fetchTopicsWithTlos(subjectKey, "az"), null);
  const azByKey = new Map((az ?? []).map((t) => [t.topic_key, t]));
  const names = markList(topics, az, TOPIC).items;
  return names.map((t) => ({ ...t, tlos: markList(t.tlos, azByKey.get(t.topic_key)?.tlos ?? null, TLO).items }));
}

/**
 * The record's own description, or null when there is none — or when, on an
 * English page, it is the Azerbaijani fallback (an English page must not
 * show Azerbaijani text as its search snippet).
 */
export function ownText(locale: Locale, en: string | null | undefined, az: string | null | undefined): string | null {
  const text = en?.trim();
  if (!text) return null;
  if (locale === "en" && az !== undefined && !isTranslated(az, text)) return null;
  return text;
}

export interface TabStatus {
  /** The tab's main content is empty: noindex, not in the sitemap. */
  empty: boolean;
  /** The English page has English main content (else it canonicalises to az). */
  translated: boolean;
}

/** Unknown (a read failed): index as usual, as before this check existed. */
const UNKNOWN: TabStatus = { empty: false, translated: true };

async function listStatus<T extends object>(
  az: Promise<readonly T[]>,
  en: Promise<readonly T[]>,
  spec: Spec<T>
): Promise<TabStatus> {
  const [a, e] = await Promise.all([orFallback(az, null), orFallback(en, null)]);
  if (!a) return UNKNOWN;
  if (a.length === 0) return { empty: true, translated: false };
  if (!e) return UNKNOWN;
  return { empty: false, translated: markList(e, a, spec).translated };
}

const flattenClos = (byKey: Map<string, Clo[]>) =>
  [...byKey.entries()].flatMap(([subject_key, clos]) => clos.map((c, i) => ({ ...c, subject_key, clo_code: code(c.clo_code, i) })));

const PROGRAMME_CLO: Spec<Clo> = { id: (c, i) => `${c.subject_key ?? ""}__${code(c.clo_code, i)}`, texts: (c) => [c.clo_content] };

/** Status of one programme tab (see TabStatus). */
export const programmeTabStatus = cache(async (key: string, slug: ProgrammeSection): Promise<TabStatus> => {
  switch (slug) {
    case "": {
      // The programme's hub page is never "empty"; its main text is the
      // description, or — without one — the name.
      const [az, en] = await Promise.all([
        orFallback(fetchSpecialtyCharacteristics(key, "az"), undefined),
        orFallback(fetchSpecialtyCharacteristics(key, "en"), undefined),
      ]);
      if (az === undefined || en === undefined) return UNKNOWN;
      const azTexts = CHARS(az);
      if (!azTexts.some((t) => t?.trim())) return { empty: false, translated: await programmeTranslated(key) };
      return { empty: false, translated: Boolean(en) && !isFallback(en as object, CHARS(en), azTexts) };
    }
    case "program-learning-outcomes":
      return listStatus(fetchPlos(key, "az"), fetchPlos(key, "en"), PLO);
    case "subjects":
      return listStatus(fetchCurriculum(key, "az"), fetchCurriculum(key, "en"), SUBJECT);
    case "clo": {
      // The batch route only: without it (an older backend) the answer would
      // cost one read per subject in each language, so the status is unknown.
      const [az, en] = await Promise.all([
        orFallback(fetchProgrammeClosBatch(key, "az"), null),
        orFallback(fetchProgrammeClosBatch(key, "en"), null),
      ]);
      if (!az || !en) return UNKNOWN;
      return listStatus(Promise.resolve(flattenClos(az)), Promise.resolve(flattenClos(en)), PROGRAMME_CLO);
    }
    case "competency":
      return listStatus(fetchCompetencies(key, "az"), fetchCompetencies(key, "en"), COMPETENCY);
    case "competency-match-table": {
      const [competencies, subjects] = await Promise.all([
        programmeTabStatus(key, "competency"),
        programmeTabStatus(key, "subjects"),
      ]);
      if (competencies.empty || subjects.empty) return { empty: true, translated: false };
      const comps = await orFallback(fetchCompetencies(key, "az"), null);
      const matches = comps ? await orFallback(fetchProgrammeCompetencyMatches(key, comps), null) : null;
      if (!matches) return UNKNOWN;
      if (matches.size === 0) return { empty: true, translated: false };
      return { empty: false, translated: competencies.translated || subjects.translated };
    }
    case "graduate-career-opportunities":
      return listStatus(fetchGcos(key, "az"), fetchGcos(key, "en"), GCO);
  }
});

/**
 * Whether the subject has an English name of its own — read from the
 * programme's curriculum in both languages, the same source the sitemap uses.
 * (The API machine-translates a subject's name and description together.)
 */
export const subjectTranslated = cache(async (specialtyKey: string, subjectKey: string): Promise<boolean> => {
  const [az, en] = await Promise.all([
    orFallback(fetchCurriculum(specialtyKey, "az"), null),
    orFallback(fetchCurriculum(specialtyKey, "en"), null),
  ]);
  if (!az || !en || !en.length) return true;
  return isTranslated(
    az.find((s) => s.subject_key === subjectKey)?.subject_name,
    en.find((s) => s.subject_key === subjectKey)?.subject_name
  );
});

/** Status of one subject tab (see TabStatus). */
export const subjectTabStatus = cache(
  async (specialtyKey: string, subjectKey: string, slug: SubjectSection): Promise<TabStatus> => {
    switch (slug) {
      case "":
      case "syllabus":
        // The subject record itself (credits, semester, description): never empty.
        return { empty: false, translated: await subjectTranslated(specialtyKey, subjectKey) };
      case "topics":
        // The topics themselves decide; their outcomes are not needed for that
        // (and would cost a read per topic on a backend without the batch route).
        return listStatus(fetchTopics(subjectKey, "az"), fetchTopics(subjectKey, "en"), TOPIC);
      case "clo-plo-match-table": {
        const [clos, plos, matches] = await Promise.all([
          listStatus(fetchClos(subjectKey, "az"), fetchClos(subjectKey, "en"), CLO),
          listStatus(fetchPlos(specialtyKey, "az"), fetchPlos(specialtyKey, "en"), PLO),
          orFallback(fetchCloPloMatches(subjectKey), null),
        ]);
        if (clos.empty || plos.empty || (matches && matches.length === 0)) return { empty: true, translated: false };
        return { empty: false, translated: clos.translated || plos.translated };
      }
    }
  }
);

/** The subject's Azerbaijani record (for comparing an English page's texts). */
export async function subjectInAz(specialtyKey: string, subjectKey: string) {
  return orFallback(fetchSubject(subjectKey, "az", specialtyKey), null);
}

/** The programme's Azerbaijani characteristics (for comparing an English page's texts). */
export async function charsInAz(key: string) {
  return orFallback(fetchSpecialtyCharacteristics(key, "az"), null);
}

export { CHARS as characteristicsTexts };
