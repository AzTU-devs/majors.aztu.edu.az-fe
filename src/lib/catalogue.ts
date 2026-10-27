/**
 * Server helpers that combine API reads with the design system's hues.
 */
import { cache } from "react";

import {
  fetchFaculties,
  fetchFacultyIndex,
  fetchSpecialties,
  orFallback,
  type FacultyIndex,
  type SpecialtySummary,
} from "./api";
import { makeCard, type ProgrammeCardData } from "./cards";
import { facultyStyles, styleFromKey, type FacultyStyle } from "./hues";
import { isTranslated } from "./seo";
import type { Locale } from "./site";

export type { ProgrammeCardData } from "./cards";

export interface FacultyMeta {
  code: string;
  name: string;
  hue: FacultyStyle["hue"];
  art: FacultyStyle["art"];
  scene: FacultyStyle["scene"];
}

/**
 * Hue + art per faculty code. Computed from the names in both languages, so a
 * faculty has the same colour on /az and /en. Decorative: an outage yields {}.
 */
export const facultyStyleMap = cache(async (): Promise<Record<string, FacultyStyle>> => {
  const [az, en] = await Promise.all([
    orFallback(fetchFaculties("az"), []),
    orFallback(fetchFaculties("en"), []),
  ]);
  const base = az.length ? az : en;
  return facultyStyles(
    base.map((f) => ({
      faculty_code: f.faculty_code,
      names: [
        az.find((x) => x.faculty_code === f.faculty_code)?.faculty_name ?? "",
        en.find((x) => x.faculty_code === f.faculty_code)?.faculty_name ?? "",
      ],
    }))
  );
});

/** Faculties of `locale` with their style (empty during an outage). */
export const facultyMetas = cache(async (locale: Locale): Promise<FacultyMeta[]> => {
  const [list, styles] = await Promise.all([orFallback(fetchFaculties(locale), []), facultyStyleMap()]);
  return list.map((f) => ({
    code: f.faculty_code,
    name: f.faculty_name,
    ...(styles[f.faculty_code] ?? styleFromKey(f.faculty_code)),
  }));
});

const EMPTY_INDEX: FacultyIndex = { faculties: [], facultyOf: {}, counts: {} };

/** Programme → faculty index (decorative: empty during an outage). */
export const facultyIndex = cache(
  async (locale: Locale): Promise<FacultyIndex> => orFallback(fetchFacultyIndex(locale), EMPTY_INDEX)
);

export function toCard(
  s: SpecialtySummary,
  index: FacultyIndex,
  styles: Record<string, FacultyStyle>,
  facultyNames: Record<string, string>
): ProgrammeCardData {
  return makeCard(s, index.facultyOf, styles, facultyNames);
}

/** Everything a programme list needs to colour and label its cards. */
export async function cardContext(locale: Locale) {
  const [index, styles, metas] = await Promise.all([facultyIndex(locale), facultyStyleMap(), facultyMetas(locale)]);
  const names: Record<string, string> = {};
  for (const f of metas) names[f.code] = f.name;
  return { index, styles, names, metas };
}

/** The hue/art of a faculty (stable fallback when unknown). */
export async function facultyStyle(code: string): Promise<FacultyStyle> {
  const styles = await facultyStyleMap();
  return styles[code] ?? styleFromKey(code);
}

/**
 * Whether a programme has an English translation of its own (the API falls
 * back to the Azerbaijani text when it has none). Decides the canonical and
 * hreflang of its pages. Defaults to true when either read fails.
 */
export const programmeTranslated = cache(async (key: string): Promise<boolean> => {
  const [az, en] = await Promise.all([
    orFallback(fetchSpecialties("az"), null),
    orFallback(fetchSpecialties("en"), null),
  ]);
  if (!az || !en) return true;
  const a = az.find((s) => s.specialty_key === key);
  const e = en.find((s) => s.specialty_key === key);
  if (!a || !e) return true;
  return isTranslated(a.specialty_name, e.specialty_name);
});

/** The newest programmes first (by creation date, then by API order). */
export function newestFirst(list: SpecialtySummary[]): SpecialtySummary[] {
  return list
    .map((s, i) => ({ s, i }))
    .sort((a, b) => {
      const ca = a.s.created_at ?? "";
      const cb = b.s.created_at ?? "";
      if (ca !== cb) return ca < cb ? 1 : -1;
      return b.i - a.i;
    })
    .map((x) => x.s);
}
