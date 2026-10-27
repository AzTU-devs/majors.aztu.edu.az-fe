import { gzipSync } from "node:zlib";

import { fetchCafedras, fetchCurriculum, fetchFaculties, fetchSpecialties, mapLimit, orFallback } from "@/lib/api";
import { programmeTabStatus, subjectTranslated } from "@/lib/content";
import { enc } from "@/lib/routes";
import { PROGRAMME_SECTIONS } from "@/lib/sections";
import { isTranslated } from "@/lib/seo";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, absoluteUrl, languageAlternates } from "@/lib/site";

/*
  /sitemap.xml

  Built from the live catalogue at most once an hour and kept in memory: the
  build reads every programme's tabs in both languages (to leave out empty
  tabs and untranslated English pages), which is far too much work per
  request. A stale copy is served while the next one is built. Not
  prerendered at `next build` (dynamic), so the build never depends on the
  API being reachable.

  When the catalogue cannot be read and there is no earlier copy, the answer
  is 503 with Retry-After — not a 200 listing only the static pages, which
  would tell crawlers every programme had gone.

  Next's own sitemap.ts convention cannot answer 503, hence a route handler.
  `next start` compresses rendered pages but not route-handler responses, so
  the (large, repetitive) XML is gzipped here, once per build, for clients
  that accept it; a proxy that compresses skips an already-encoded response.
*/
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 60 * 60 * 1000;
/** The sitemap protocol's limit per file. */
const MAX_URLS = 50_000;
/** Subject tabs listed: the record itself (never empty). The topic plan is
 *  part of the syllabus, and checking each subject's topics and matrix in
 *  both languages would cost two reads per subject per build. */
const SUBJECT_TABS = ["", "syllabus"] as const;

let current: { xml: string; gzip: Buffer; at: number } | null = null;
let building: Promise<unknown> | null = null;

/**
 * One <url> per language, each with the hreflang set the page itself
 * declares. Content whose English page canonicalises to Azerbaijani
 * (`translated: false`) is listed once, without an English alternate.
 * No <lastmod>: the API does not say when a record last changed.
 */
function urls(pathWithoutLocale: string, translated: boolean): string[] {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  const az = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`);
  const languages: Record<string, string> = translated
    ? languageAlternates(pathWithoutLocale)
    : { [HTML_LANG[DEFAULT_LOCALE]]: az, "x-default": az };
  const links = Object.entries(languages)
    .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(href)}" />`)
    .join("\n");
  const locs = translated ? LOCALES.map((l) => absoluteUrl(`/${l}${clean}`)) : [az];
  return locs.map((loc) => `<url>\n<loc>${xml(loc)}</loc>\n${links}\n</url>`);
}

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function build(): Promise<string> {
  // Without these two lists there is no sitemap worth serving (throws -> 503).
  const [programmes, faculties] = await Promise.all([fetchSpecialties("az"), fetchFaculties("az")]);
  const facultiesEn = await orFallback(fetchFaculties("en"), null);

  const entries: string[] = ["/", "/programmes", "/bachelor", "/master", "/faculties", "/contact"].flatMap((p) => urls(p, true));

  const departments = await mapLimit(faculties, 6, async (f) => ({
    faculty: f,
    az: await orFallback(fetchCafedras(f.faculty_code, "az"), null),
    en: await orFallback(fetchCafedras(f.faculty_code, "en"), null),
  }));
  for (const { faculty, az, en } of departments) {
    const enName = facultiesEn?.find((x) => x.faculty_code === faculty.faculty_code)?.faculty_name;
    const base = `/faculties/${enc(faculty.faculty_code)}`;
    entries.push(...urls(base, !facultiesEn?.length || isTranslated(faculty.faculty_name, enName)));
    for (const c of az ?? []) {
      const enC = en?.find((x) => x.cafedra_code === c.cafedra_code)?.cafedra_name;
      entries.push(...urls(`${base}/${enc(c.cafedra_code)}`, !en || isTranslated(c.cafedra_name, enC)));
    }
  }

  // Per programme: its non-empty tabs (each with its own translation status,
  // the same one the page uses for its canonical), then its subjects.
  const perProgramme = await mapLimit(programmes, 4, async (p) => {
    const key = p.specialty_key;
    const base = `/programmes/${enc(key)}`;
    const statuses = await Promise.all(PROGRAMME_SECTIONS.map((s) => programmeTabStatus(key, s.slug)));
    const tabs = PROGRAMME_SECTIONS.flatMap((s, i) =>
      statuses[i].empty ? [] : urls(s.slug ? `${base}/${s.slug}` : base, statuses[i].translated)
    );
    const curriculum = await orFallback(fetchCurriculum(key, "az"), []);
    const subjects = await Promise.all(
      curriculum.map(async (s) => {
        const translated = await subjectTranslated(key, s.subject_key);
        const subjectBase = `${base}/subjects/${enc(s.subject_key)}`;
        return SUBJECT_TABS.map((tab) => urls(tab ? `${subjectBase}/${tab}` : subjectBase, translated));
      })
    );
    return { tabs, subjects: SUBJECT_TABS.map((_, i) => subjects.flatMap((s) => s[i])) };
  });

  // Most important first, so a catalogue that outgrows one file loses the
  // least valuable URLs (syllabi) rather than programmes.
  const all = [
    ...entries,
    ...perProgramme.flatMap((p) => p.tabs),
    ...SUBJECT_TABS.flatMap((_, i) => perProgramme.flatMap((p) => p.subjects[i])),
  ].slice(0, MAX_URLS);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${all.join("\n")}\n</urlset>\n`;
}

function rebuild(): Promise<NonNullable<typeof current>> {
  if (!building) {
    building = build()
      .then((text) => {
        current = { xml: text, gzip: gzipSync(text), at: Date.now() };
        return current;
      })
      .finally(() => {
        building = null;
      });
  }
  return building.then(() => current!);
}

export async function GET(req: Request) {
  const gzip = /\bgzip\b/i.test(req.headers.get("accept-encoding") ?? "");
  if (current && Date.now() - current.at < TTL_MS) return respond(current, gzip);
  if (current) {
    // Stale: serve it, refresh in the background (a failed refresh keeps it).
    rebuild().catch(() => {});
    return respond(current, gzip);
  }
  try {
    return respond(await rebuild(), gzip);
  } catch {
    return new Response("The catalogue is temporarily unavailable.", {
      status: 503,
      headers: { "Retry-After": "300", "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

function respond(map: NonNullable<typeof current>, gzip: boolean) {
  const headers: Record<string, string> = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    Vary: "Accept-Encoding",
  };
  if (!gzip) return new Response(map.xml, { headers });
  return new Response(new Uint8Array(map.gzip), { headers: { ...headers, "Content-Encoding": "gzip" } });
}
