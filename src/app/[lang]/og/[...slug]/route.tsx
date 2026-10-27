import { programmeFacts } from "@/components/programme/programmeData";
import { fetchCafedras, fetchCurriculum, fetchFaculties, knownSpecialty } from "@/lib/api";
import { facultyStyle } from "@/lib/catalogue";
import type { Hue } from "@/lib/hues";
import { renderOgImage } from "@/lib/og";
import { safeDecode } from "@/lib/routes";
import { PROGRAMME_SECTIONS, SUBJECT_SECTIONS, degreeLabel, sectionLabel } from "@/lib/sections";
import { BRAND_WORDMARK, SITE_NAME, UNIVERSITY, isLocale, type Locale } from "@/lib/site";

export const runtime = "nodejs";

interface Card {
  kicker: string;
  title: string;
  subtitle?: string;
  hue?: Hue;
}

const PAGES: Record<string, (locale: Locale) => Card> = {
  bachelor: (l) => ({
    kicker: l === "az" ? "Birinci pillə ali təhsil" : "First-cycle degrees",
    title: l === "az" ? "Bakalavr ixtisasları" : "Bachelor's programmes",
    subtitle: l === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
    hue: "k-navy",
  }),
  master: (l) => ({
    kicker: l === "az" ? "İkinci pillə ali təhsil" : "Second-cycle degrees",
    title: l === "az" ? "Magistr ixtisasları" : "Master's programmes",
    subtitle: l === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
    hue: "k-gold",
  }),
  programmes: (l) => ({
    kicker: l === "az" ? "Bakalavr və magistr" : "Bachelor's and master's",
    title: l === "az" ? "Bütün ixtisaslar" : "All programmes",
    subtitle: l === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
    hue: "k-it",
  }),
  faculties: (l) => ({
    kicker: l === "az" ? "Universitetin strukturu" : "University structure",
    title: l === "az" ? "Fakültələr və kafedralar" : "Faculties and departments",
    subtitle: l === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
    hue: "k-build",
  }),
  contact: (l) => ({
    kicker: l === "az" ? "Bizimlə əlaqə" : "Get in touch",
    title: l === "az" ? "Əlaqə" : "Contact",
    subtitle: l === "az" ? `${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz}` : `${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn}`,
    hue: "k-data",
  }),
};

const isSection = (sections: readonly { slug: string }[], slug: string) =>
  slug !== "" && sections.some((s) => s.slug === slug);

/** Whether the path has the shape of a real page's image (no data needed). */
function hasPageShape(parts: string[]): boolean {
  const [kind, a, b, c] = parts;
  const n = parts.length;
  switch (kind) {
    case "home":
      return n === 1;
    case "page":
      return n === 2 && Object.hasOwn(PAGES, a);
    case "faculty":
      return n === 2 && Boolean(a);
    case "department":
      return n === 3 && Boolean(a && b);
    case "programme":
      return Boolean(a) && (n === 2 || (n === 3 && isSection(PROGRAMME_SECTIONS, b)));
    case "subject":
      return Boolean(a && b) && (n === 3 || (n === 4 && isSection(SUBJECT_SECTIONS, c)));
    default:
      return false;
  }
}

/**
 * What the image of a page says; null = the page does not exist (404).
 *
 * The path must have exactly the shape of a real page, and every key in it
 * must be in the cached catalogue lists (programme list, curriculum, faculty
 * and department lists) — checked before anything is rendered, and with no
 * per-key API read, so neither unknown keys nor extra segments cost a render
 * or a cache entry. Names come from those lists, never from the URL, so the
 * route cannot stamp arbitrary text on a university image.
 */
async function describe(locale: Locale, parts: string[]): Promise<Card | null> {
  const az = locale === "az";
  const [kind, a, b, c] = parts;
  const n = parts.length;
  switch (kind) {
    case "home":
      if (n !== 1) return null;
      return {
        kicker: az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn,
        title: az ? "Gələcəyini AzTU-da qur." : "Build your future at AzTU.",
        subtitle: az ? "Bakalavr və magistr ixtisasları, tədris planları, sillabuslar" : "Bachelor's and master's programmes, curricula, syllabi",
        hue: "k-navy",
      };
    case "page":
      return n === 2 && Object.hasOwn(PAGES, a) ? PAGES[a](locale) : null;
    case "faculty": {
      if (n !== 2) return null;
      const faculty = (await fetchFaculties(locale)).find((f) => f.faculty_code === a);
      if (!faculty) return null;
      return { kicker: az ? "Fakültə" : "Faculty", title: faculty.faculty_name, hue: (await facultyStyle(a)).hue };
    }
    case "department": {
      if (n !== 3) return null;
      const faculty = (await fetchFaculties(locale)).find((f) => f.faculty_code === a);
      if (!faculty) return null;
      // fetchCafedras reads only a faculty that is in the list.
      const cafedra = (await fetchCafedras(a, locale))?.find((x) => x.cafedra_code === b);
      if (!cafedra) return null;
      return {
        kicker: az ? "Kafedra" : "Department",
        title: cafedra.cafedra_name || b,
        subtitle: faculty.faculty_name,
        hue: (await facultyStyle(a)).hue,
      };
    }
    case "programme": {
      if (n !== 2 && !(n === 3 && isSection(PROGRAMME_SECTIONS, b))) return null;
      const specialty = await knownSpecialty(a, locale);
      if (!specialty) return null;
      const facts = await programmeFacts(a, locale);
      return {
        kicker: degreeLabel(specialty.degree === 2 ? 2 : 1, locale, "programme"),
        title: specialty.specialty_name,
        subtitle: b ? sectionLabel(PROGRAMME_SECTIONS, b, locale) : facts.facultyName ?? specialty.specialty_code,
        hue: facts.style.hue,
      };
    }
    case "subject": {
      if (n !== 3 && !(n === 4 && isSection(SUBJECT_SECTIONS, c))) return null;
      const specialty = await knownSpecialty(a, locale);
      if (!specialty) return null;
      const subject = (await fetchCurriculum(a, locale)).find((s) => s.subject_key === b);
      if (!subject) return null;
      const facts = await programmeFacts(a, locale);
      return {
        kicker: `${az ? "Fənn" : "Subject"} · ${specialty.specialty_name}`,
        title: subject.subject_name,
        subtitle: c ? sectionLabel(SUBJECT_SECTIONS, c, locale) : subject.subject_code,
        hue: facts.style.hue,
      };
    }
    default:
      return null;
  }
}

/*
  Rendering an image (Satori + resvg) takes a few hundred milliseconds of CPU
  on the server's single JavaScript thread, which blocks every other request
  meanwhile. Unbounded, a burst of image requests stalled every page on the
  server for many seconds. So:
    - rendered images are kept in memory, keyed by the validated path, and
      reused while the card's text is unchanged (bounded: least recently used
      entries go first);
    - at most MAX_RENDERS requests that may need a render are in progress
      (validating, waiting or rendering) at a time; beyond that the answer is
      503 with Retry-After, decided on arrival before anything is awaited.
      Images already in memory (or being rendered) are served regardless;
    - renders run one at a time, and after each one the thread stays free
      for at least as long as the render took: pages queued behind a burst
      wait for one render, not for all of them. (A cap on concurrency alone
      does not do this — renders never overlap on one thread, so every
      request waiting behind one would find a free slot afterwards.)
*/
const MAX_RENDERS = 2;
const MAX_ENTRIES = 400;
const MAX_BYTES = 48 * 1024 * 1024;

const images = new Map<string, { card: string; png: ArrayBuffer }>();
let cachedBytes = 0;
const inflight = new Map<string, Promise<ArrayBuffer>>();
/** Paths whose image is being rendered right now. */
const renderingPaths = new Set<string>();
let busy = 0;
/** No render starts before this time (see above). */
let renderGate = 0;
/** Renders run one after another. */
let queue: Promise<unknown> = Promise.resolve();

function renderSpaced(card: Card, locale: Locale): Promise<ArrayBuffer> {
  const run = queue.then(async () => {
    const wait = renderGate - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    const started = Date.now();
    try {
      const res = await renderOgImage({ ...card, wordmark: BRAND_WORDMARK[locale] });
      return await res.arrayBuffer();
    } finally {
      const now = Date.now();
      renderGate = now + (now - started);
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

function recall(key: string, card: string): ArrayBuffer | null {
  const hit = images.get(key);
  if (!hit || hit.card !== card) return null;
  // Most recently used last.
  images.delete(key);
  images.set(key, hit);
  return hit.png;
}

function remember(key: string, card: string, png: ArrayBuffer) {
  const old = images.get(key);
  if (old) {
    cachedBytes -= old.png.byteLength;
    images.delete(key);
  }
  images.set(key, { card, png });
  cachedBytes += png.byteLength;
  while (images.size > MAX_ENTRIES || cachedBytes > MAX_BYTES) {
    const oldest = images.keys().next();
    if (oldest.done) break;
    cachedBytes -= images.get(oldest.value)!.png.byteLength;
    images.delete(oldest.value);
  }
}

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
const tooBusy = () =>
  new Response("Busy, try again shortly", { status: 503, headers: { "Retry-After": "5", "Cache-Control": "no-store" } });

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return notFound();
  const locale = lang;
  const parts = (slug ?? []).map(safeDecode);
  // Extra or unknown segments: 404 at once, even under load.
  if (!hasPageShape(parts)) return notFound();

  // A path already rendered (or rendering) only ever holds validated keys.
  const path = `${locale}/${parts.join("/")}`;
  const known = images.has(path) || renderingPaths.has(path);
  if (!known) {
    if (busy >= MAX_RENDERS) return tooBusy();
    busy++;
  }
  try {
    return await answer(locale, parts, path);
  } finally {
    if (!known) busy--;
  }
}

async function answer(locale: Locale, parts: string[], path: string): Promise<Response> {
  let card: Card | null;
  let outage = false;
  try {
    card = await describe(locale, parts);
  } catch {
    // The API is unavailable, so the path cannot be checked: a generic card
    // (one per language, rendered once) is better than a broken preview —
    // but it must not be cached as if it were this page's image.
    card = { kicker: locale === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn, title: SITE_NAME[locale] };
    outage = true;
  }
  if (!card) return notFound();

  const key = outage ? `outage/${locale}` : path;
  const text = JSON.stringify(card);
  const headers = {
    "Content-Type": "image/png",
    "Cache-Control": outage
      ? "no-store"
      : // Titles change rarely; let caches keep a day and serve stale for a week.
        "public, max-age=86400, stale-while-revalidate=604800",
  };

  const hit = recall(key, text);
  if (hit) return new Response(hit, { headers });

  const job = `${key}\n${text}`;
  let render = inflight.get(job);
  if (!render) {
    const finished = card;
    renderingPaths.add(key);
    render = (async () => {
      try {
        const png = await renderSpaced(finished, locale);
        remember(key, text, png);
        return png;
      } finally {
        renderingPaths.delete(key);
        inflight.delete(job);
      }
    })();
    inflight.set(job, render);
  }
  return new Response(await render, { headers });
}
