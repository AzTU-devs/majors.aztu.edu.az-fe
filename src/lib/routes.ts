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

/** decodeURIComponent that never throws on a malformed segment. */
export function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

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

/** The catalogue: all programmes, or one degree level. */
export function catalogPath(locale: Locale, degree?: 1 | 2, query?: { q?: string; faculty?: string }) {
  const base = degree ? degreeListPath(locale, degree) : `/${locale}/programmes`;
  const params = new URLSearchParams();
  if (query?.q) params.set("q", query.q);
  if (query?.faculty) params.set("faculty", query.faculty);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function facultyPath(locale: Locale, facultyCode: string, cafedraCode?: string) {
  const base = `/${locale}/faculties/${enc(facultyCode)}`;
  return cafedraCode ? `${base}/${enc(cafedraCode)}` : base;
}

/** Social-preview image of a page (rendered by app/[lang]/og/[...slug]). */
export function ogPath(locale: Locale, ...parts: string[]) {
  return `/${locale}/og/${parts.filter(Boolean).map(enc).join("/")}`;
}

/** The same page in another language (swaps the leading locale segment). */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length && (segments[0] === "az" || segments[0] === "en")) segments[0] = next;
  else segments.unshift(next);
  return `/${segments.join("/")}`;
}
