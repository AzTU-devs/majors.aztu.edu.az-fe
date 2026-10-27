/**
 * Catalogue search, done in memory over the full programme list.
 *
 * The server and the browser run the same function over the same list, so a
 * server-rendered `?q=` result and the live filter in the browser can never
 * disagree — and a search term never reaches the API or the server's data
 * cache (a cache entry per distinct term used to grow without bound).
 *
 * Matching is case- and diacritic-insensitive with Azerbaijani rules in mind:
 * İ/I/ı/i are one letter (JavaScript's toLowerCase() turns "İ" into "i" plus a
 * combining dot, and the Azerbaijani lower case of "I" is "ı"), and ə/ş/ç/ğ/ö/ü
 * also match e/s/c/g/o/u, so "muhendis", "MÜHƏNDİS" and "mühəndis" find
 * "Kompüter mühəndisliyi". Every word of the query must appear in the name or
 * the code, in any order. This is a superset of what the API's own search
 * matched (case-folded substring of the name or the code).
 */

/** Fold text for matching (see above). */
export function foldText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[İI]/g, "i")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/\s+/g, " ")
    .trim();
}

/** The words of a query, folded; empty for a blank query. */
export function queryTerms(query: string | null | undefined): string[] {
  const folded = foldText(query);
  return folded ? folded.split(" ") : [];
}

/** Whether a programme with this name and code matches every term. */
export function matchesTerms(terms: readonly string[], name: string, code: string): boolean {
  if (terms.length === 0) return true;
  const n = foldText(name);
  const c = foldText(code);
  return terms.every((t) => n.includes(t) || c.includes(t));
}

/** Longest query honoured (longer input is cut, not rejected). */
export const MAX_QUERY_LENGTH = 100;

/** A query-string value, trimmed and bounded. */
export function cleanQuery(value: string | string[] | null | undefined, max = MAX_QUERY_LENGTH): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, max);
}

/**
 * The programmes matching a query and an (optional) faculty. `facultyOf`
 * maps specialty_key -> faculty_code.
 */
export function filterProgrammes<T extends { key: string; name: string; code: string }>(
  items: readonly T[],
  query: string,
  faculty: string | null,
  facultyOf: Record<string, string>
): T[] {
  const terms = queryTerms(query);
  return items.filter(
    (p) => (!faculty || facultyOf[p.key] === faculty) && matchesTerms(terms, p.name, p.code)
  );
}
