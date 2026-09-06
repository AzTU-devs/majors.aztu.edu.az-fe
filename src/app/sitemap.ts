import type { MetadataRoute } from "next";
import { fetchFaculties, fetchSpecialties } from "@/lib/api";
import { GATE_ENABLED, LOCALES, absoluteUrl, HTML_LANG, DEFAULT_LOCALE } from "@/lib/site";

// Rendered per request so it always reflects the current SITE_GATE setting and
// the live catalogue. The underlying API reads are cached for 30 minutes in
// lib/api.ts, so this stays cheap.
export const dynamic = "force-dynamic";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale, each carrying hreflang alternates for the others. */
function localized(
  pathWithoutLocale: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"]
): Entry[] {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HTML_LANG[l]] = absoluteUrl(`/${l}${clean}`);
  languages["x-default"] = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`);

  return LOCALES.map((l) => ({
    url: absoluteUrl(`/${l}${clean}`),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A gated site has nothing crawlable; publishing URLs would only advertise
  // pages that every crawler is then redirected away from.
  if (GATE_ENABLED) return [];

  const entries: Entry[] = [
    ...localized("/", 1.0, "weekly"),
    ...localized("/bachelor", 0.9, "weekly"),
    ...localized("/master", 0.9, "weekly"),
    ...localized("/faculties", 0.8, "monthly"),
    ...localized("/contact", 0.5, "yearly"),
  ];

  // Faculties and programmes are enumerated from the live catalogue.
  const [faculties, bachelors, masters] = await Promise.all([
    fetchFaculties(DEFAULT_LOCALE),
    fetchSpecialties(DEFAULT_LOCALE, 1),
    fetchSpecialties(DEFAULT_LOCALE, 2),
  ]);

  for (const f of faculties) {
    entries.push(...localized(`/faculties/${encodeURIComponent(f.faculty_code)}`, 0.6, "monthly"));
  }

  const seen = new Set<string>();
  for (const s of [...bachelors, ...masters]) {
    if (seen.has(s.specialty_code)) continue;
    seen.add(s.specialty_code);
    const base = `/programmes/${encodeURIComponent(s.specialty_code)}`;
    entries.push(...localized(base, 0.8, "monthly"));
    // The high-value sub-pages of a programme.
    for (const sub of ["subjects", "program-learning-outcomes", "graduate-career-opportunities"]) {
      entries.push(...localized(`${base}/${sub}`, 0.6, "monthly"));
    }
  }

  return entries;
}
