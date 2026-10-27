"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { IconGrid, IconLayers, IconSearch, IconTable } from "@/components/ui/icons";
import { CardSkeletonGrid, CodePill, EmptyState, ErrorState, PanelHead, Pill, cx } from "@/components/ui/primitives";
import { semesterLabel, statusLabel } from "@/constants/subjectMeta";
import { useApi } from "@/hooks/useApi";
import { tr } from "@/lib/i18n";
import { subjectPath } from "@/lib/routes";
import type { Marked } from "@/lib/content";
import { matchesTerms, queryTerms } from "@/lib/search";
import type { Locale } from "@/lib/site";
import { getCurriculaBySpecialtyKey, type Subject } from "@/services/curricula/curricula";

type ViewMode = "grid" | "table";

/** "2025/2026" and "2025-2026" are the same year; "" means not recorded. */
function normaliseYear(year: string | null | undefined) {
  const y = (year ?? "").trim().replace(/\s*[/–-]\s*/, "–");
  return y;
}

/**
 * The curriculum tab: every subject of the programme (server-rendered, all
 * pages of the list), with semester / status filters, a text filter and a
 * card or table view. Interactive, so a client component, seeded with the
 * server's data; "try again" after a failed load fetches in the browser.
 */
export default function Curriculum({
  locale,
  specialtyKey,
  initial,
}: {
  locale: Locale;
  specialtyKey: string;
  /**
   * Server-rendered subjects; null when the API failed. On an English page,
   * names shown in their Azerbaijani fallback carry lang "az".
   */
  initial: Marked<Subject>[] | null;
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [semester, setSemester] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  // Every page of the curriculum is read (see getCurriculaBySpecialtyKey);
  // the old fixed 0–400 window silently truncated longer plans.
  const { data: subjects, loading, error, retry } = useApi<Marked<Subject>[]>(
    JSON.stringify([specialtyKey, locale]),
    (signal) => getCurriculaBySpecialtyKey(specialtyKey, locale, signal),
    [],
    initial ? { data: initial } : { error: true }
  );

  // Same matching as the catalogue search (case- and diacritic-insensitive,
  // Azerbaijani İ/I/ı/i alike; every word in the name or the code).
  const filtered = useMemo(() => {
    const terms = queryTerms(query);
    return subjects.filter(
      (s) =>
        (semester === null || s.semester === semester) &&
        (status === null || s.status === status) &&
        matchesTerms(terms, s.subject_name, s.subject_code ?? "")
    );
  }, [subjects, semester, status, query]);

  const totals = useMemo(() => {
    const credits = subjects.reduce((sum, s) => sum + (Number(s.credit) || 0), 0);
    return { credits, count: subjects.length };
  }, [subjects]);

  /** Subjects grouped by academic year (unrecorded year last). */
  const grouped = useMemo(() => {
    const map = new Map<string, Marked<Subject>[]>();
    for (const s of filtered) {
      const key = normaliseYear(s.year);
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return [...map.entries()].sort((a, b) => (a[0] === "" ? 1 : b[0] === "" ? -1 : a[0].localeCompare(b[0])));
  }, [filtered]);

  const statuses = useMemo(() => [...new Set(subjects.map((s) => s.status).filter((v) => v === 1 || v === 2))].sort(), [subjects]);

  const seg = (active: boolean) =>
    cx(
      "inline-flex h-9 items-center rounded-full px-3.5 text-[13.5px] font-semibold transition-colors",
      active ? "bg-k-100 text-k-900 [box-shadow:inset_0_0_0_2px_var(--k-700)]" : "text-ink-2 hover:bg-surface-2"
    );

  return (
    <>
      <PanelHead
        title={tr(locale, "Fənlər", "Subjects")}
        lead={
          totals.count > 0
            ? tr(
                locale,
                `${totals.count} fənn · ${totals.credits} kredit`,
                `${totals.count} subjects · ${totals.credits} credits`
              )
            : tr(locale, "İxtisasın tədris planındakı fənlər.", "The subjects of the programme's curriculum.")
        }
      />

      {!error && subjects.length > 0 && (
        <div className="mb-8 flex flex-col gap-3 rounded-[24px] bg-surface p-3 ring-line lg:flex-row lg:items-center">
          <div className="field-search !h-11 lg:w-[300px]">
            <IconSearch />
            <label htmlFor="curriculum-filter" className="sr-only">
              {tr(locale, "Fənn axtar", "Filter subjects")}
            </label>
            <input
              id="curriculum-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr(locale, "Fənn adı və ya kodu…", "Subject name or code…")}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label={tr(locale, "Semestr filtri", "Semester filter")}>
            {[null, 1, 2].map((v) => (
              <button key={String(v)} type="button" aria-pressed={semester === v} onClick={() => setSemester(v)} className={seg(semester === v)}>
                {v === null ? tr(locale, "Bütün semestrlər", "All semesters") : semesterLabel(v, locale)}
              </button>
            ))}
          </div>
          {statuses.length > 1 && (
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label={tr(locale, "Fənnin tipi", "Subject type")}>
              {[null, ...statuses].map((v) => (
                <button key={String(v)} type="button" aria-pressed={status === v} onClick={() => setStatus(v)} className={seg(status === v)}>
                  {v === null ? tr(locale, "Hamısı", "All") : statusLabel(v, locale)}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 lg:ml-auto" role="group" aria-label={tr(locale, "Görünüş", "View")}>
            {(["grid", "table"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={mode === "grid" ? tr(locale, "Kart görünüşü", "Card view") : tr(locale, "Cədvəl görünüşü", "Table view")}
                className={cx("btn-icon !h-9 !w-9", view === mode && "bg-k-100 text-k-900 [box-shadow:inset_0_0_0_2px_var(--k-700)]")}
              >
                {mode === "grid" ? <IconGrid size={18} /> : <IconTable size={18} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <ErrorState locale={locale} onRetry={retry} retrying={loading} />
      ) : loading && subjects.length === 0 ? (
        <CardSkeletonGrid count={6} height="h-[190px]" />
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={<IconLayers size={26} />}
          message={tr(
            locale,
            "Bu ixtisas üçün tədris planı hələ əlavə edilməyib.",
            "The curriculum for this programme has not been published yet."
          )}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={26} />}
          message={tr(locale, "Seçilmiş filtrlər üzrə fənn tapılmadı.", "No subjects match the selected filters.")}
        />
      ) : (
        <div className="flex flex-col gap-12">
          {grouped.map(([year, list]) => (
            <section key={year || "none"} aria-label={year || tr(locale, "Tədris ili göstərilməyib", "Academic year not recorded")}>
              <h3 className="mb-5 flex items-center gap-3 text-[15px] font-semibold text-ink-2">
                <span aria-hidden className="h-[2px] w-7 rounded bg-gold" />
                {year ? `${tr(locale, "Tədris ili", "Academic year")} ${year}` : tr(locale, "Tədris ili göstərilməyib", "Academic year not recorded")}
                <span className="font-normal text-ink-3">· {list.length}</span>
              </h3>

              {view === "grid" ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((sub) => (
                    <li key={sub.subject_key}>
                      <article className="card card-lift group flex h-full flex-col p-5">
                        <div className="flex items-center justify-between gap-2">
                          <CodePill className="max-w-[60%] truncate">{sub.subject_code}</CodePill>
                          <Pill tone={sub.status === 2 ? "k" : "line"} size="sm">
                            {statusLabel(sub.status, locale)}
                          </Pill>
                        </div>
                        <h4 className="clamp-3 mb-5 mt-4 font-display text-[16.5px] font-bold leading-snug tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">
                          <Link href={subjectPath(locale, specialtyKey, sub.subject_key)} lang={sub.lang} className="card-link">
                            {sub.subject_name}
                          </Link>
                        </h4>
                        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-4">
                          {[
                            { k: tr(locale, "Kredit", "Credits"), v: sub.credit ?? "—" },
                            { k: tr(locale, "Saat", "Hours"), v: sub.hours_per_week ?? "—" },
                            { k: tr(locale, "Semestr", "Term"), v: semesterLabel(sub.semester, locale) },
                          ].map((cell) => (
                            <div key={cell.k} className="min-w-0">
                              <dt className="text-[12px] text-ink-3">{cell.k}</dt>
                              <dd className="mt-0.5 truncate text-[15px] font-semibold text-ink">{cell.v}</dd>
                            </div>
                          ))}
                        </dl>
                      </article>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="tbl-frame">
                  <div className="tbl-scroll" tabIndex={0} role="region" aria-label={tr(locale, "Fənlər cədvəli", "Subjects table")}>
                    <table className="tbl min-w-[720px]">
                      <thead>
                        <tr>
                          <th scope="col">{tr(locale, "Kod", "Code")}</th>
                          <th scope="col">{tr(locale, "Fənnin adı", "Subject")}</th>
                          <th scope="col">{tr(locale, "Semestr", "Term")}</th>
                          <th scope="col">{tr(locale, "Kredit", "Credits")}</th>
                          <th scope="col">{tr(locale, "Saat", "Hours")}</th>
                          <th scope="col">{tr(locale, "Tip", "Type")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((sub) => (
                          <tr key={sub.subject_key}>
                            <td className="code whitespace-nowrap text-ink-2">{sub.subject_code}</td>
                            <td>
                              <Link
                                href={subjectPath(locale, specialtyKey, sub.subject_key)}
                                lang={sub.lang}
                                className="font-semibold text-ink hover:text-navy hover:underline"
                              >
                                {sub.subject_name}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap text-ink-2">{semesterLabel(sub.semester, locale)}</td>
                            <td className="font-semibold text-ink">{sub.credit ?? "—"}</td>
                            <td className="text-ink-2">{sub.hours_per_week ?? "—"}</td>
                            <td>
                              <Pill tone={sub.status === 2 ? "k" : "line"} size="sm">
                                {statusLabel(sub.status, locale)}
                              </Pill>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
