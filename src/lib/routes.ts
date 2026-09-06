import type { Locale } from "./site";

/**
 * Canonical URL builders.
 *
 * Programmes live under `/[lang]/programmes/[code]` regardless of degree. The
 * old `/[lang]/bachelor/specialty-details/[code]` paths put master programmes
 * under "bachelor"; next.config.ts permanently redirects them here.
 */

export const enc = (s: string) => encodeURIComponent(s);

export function programmePath(locale: Locale, specialtyCode: string, sub = "") {
  const base = `/${locale}/programmes/${enc(specialtyCode)}`;
  return sub ? `${base}/${sub}` : base;
}

export function subjectPath(
  locale: Locale,
  specialtyCode: string,
  subjectCode: string,
  sub = ""
) {
  const base = `/${locale}/programmes/${enc(specialtyCode)}/subjects/${enc(subjectCode)}`;
  return sub ? `${base}/${sub}` : base;
}

export function degreeListPath(locale: Locale, degree: 1 | 2) {
  return `/${locale}/${degree === 2 ? "master" : "bachelor"}`;
}

export function facultyPath(locale: Locale, facultyCode: string, cafedraCode?: string) {
  const base = `/${locale}/faculties/${enc(facultyCode)}`;
  return cafedraCode ? `${base}/${enc(cafedraCode)}` : base;
}
