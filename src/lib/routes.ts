import type { Locale } from "./site";

/**
 * Canonical URL builders.
 *
 * Programmes live under `/[lang]/programmes/[key]` regardless of degree. The
 * old `/[lang]/bachelor/specialty-details/[code]` paths put master programmes
 * under "bachelor"; next.config.ts permanently redirects them here.
 *
 * URL segments are the records' immutable keys (`specialty_key`,
 * `subject_key`) as returned by the API — never their display codes, which
 * are not unique. Records created before keys existed have key == their old
 * code, so their old URLs keep resolving.
 */

export const enc = (s: string) => encodeURIComponent(s);

export function programmePath(locale: Locale, specialtyKey: string, sub = "") {
  const base = `/${locale}/programmes/${enc(specialtyKey)}`;
  return sub ? `${base}/${sub}` : base;
}

export function subjectPath(
  locale: Locale,
  specialtyKey: string,
  subjectKey: string,
  sub = ""
) {
  const base = `/${locale}/programmes/${enc(specialtyKey)}/subjects/${enc(subjectKey)}`;
  return sub ? `${base}/${sub}` : base;
}

export function degreeListPath(locale: Locale, degree: 1 | 2) {
  return `/${locale}/${degree === 2 ? "master" : "bachelor"}`;
}

export function facultyPath(locale: Locale, facultyCode: string, cafedraCode?: string) {
  const base = `/${locale}/faculties/${enc(facultyCode)}`;
  return cafedraCode ? `${base}/${enc(cafedraCode)}` : base;
}
