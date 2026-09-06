"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { subjectPath } from "@/lib/routes";
import { semesterLabel, statusLabel } from "@/constants/subjectMeta";
import { getCurriculaBySpecialtyCode, type Subject } from "@/services/curricula/curricula";
import {
  ArrowRight,
  Badge,
  Card,
  CardSkeletonGrid,
  CodeChip,
  EmptyState,
  SectionHeading,
  cx,
} from "@/components/ui/primitives";

type ViewMode = "grid" | "table";

export default function Curriculum({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("grid");
  const [semester, setSemester] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // 400 covers a full four-year plan; the old limit of 100 silently truncated
    // longer curricula.
    getCurriculaBySpecialtyCode(specialtyCode, 0, 400, locale)
      .then((res) => !cancelled && setSubjects(res))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  const filtered = useMemo(
    () => (semester === null ? subjects : subjects.filter((s) => s.semester === semester)),
    [subjects, semester]
  );

  const totals = useMemo(() => {
    const credits = subjects.reduce((sum, s) => sum + (Number(s.credit) || 0), 0);
    return { credits, count: subjects.length };
  }, [subjects]);

  /** Subjects grouped by academic year, then semester. */
  const grouped = useMemo(() => {
    const map = new Map<string, Subject[]>();
    for (const s of filtered) {
      const key = s.year || "—";
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const semesterOptions: { value: number | null; label: string }[] = [
    { value: null, label: tr(locale, "Hamısı", "All") },
    { value: 1, label: semesterLabel(1, locale) },
    { value: 2, label: semesterLabel(2, locale) },
  ];

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Tədris planı", "Curriculum")}
        title={tr(locale, "Fənlər", "Subjects")}
        subtitle={
          totals.count > 0
            ? tr(
                locale,
                `${totals.count} fənn · ${totals.credits} kredit`,
                `${totals.count} subjects · ${totals.credits} credits`
              )
            : undefined
        }
      />

      {!loading && subjects.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={tr(locale, "Semestr filtri", "Semester filter")} className="flex gap-1.5">
            {semesterOptions.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setSemester(opt.value)}
                aria-pressed={semester === opt.value}
                className={cx(
                  "rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                  semester === opt.value
                    ? "bg-[var(--brand)] text-white dark:text-[#0a0f2b]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-strong)]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div role="group" aria-label={tr(locale, "Görünüş", "View")} className="flex gap-1 rounded-lg border border-[var(--border-strong)] p-0.5">
            {(["grid", "table"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={
                  mode === "grid"
                    ? tr(locale, "Kart görünüşü", "Card view")
                    : tr(locale, "Cədvəl görünüşü", "Table view")
                }
                className={cx(
                  "rounded-md p-1.5 transition-colors",
                  view === mode
                    ? "bg-[var(--surface-sunken)] text-[var(--brand-accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                )}
              >
                {mode === "grid" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} height="h-[170px]" />
      ) : subjects.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Bu ixtisas üçün tədris planı hələ əlavə edilməyib.",
            "The curriculum for this programme has not been published yet."
          )}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Seçilmiş semestr üzrə fənn tapılmadı.",
            "No subjects found for the selected semester."
          )}
        />
      ) : (
        <div className="space-y-10">
          {grouped.map(([year, list]) => (
            <section key={year}>
              <h3 className="mb-4 flex items-center gap-2.5 text-[14.5px] font-bold text-[var(--text-strong)]">
                <span aria-hidden className="h-4 w-1 rounded-full bg-[var(--brand-accent)]" />
                {tr(locale, "Tədris ili", "Academic year")}: {year}
                <span className="text-[13px] font-semibold text-[var(--text-muted)]">({list.length})</span>
              </h3>

              {view === "grid" ? (
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((sub) => (
                    <li key={sub.subject_code}>
                      <Link href={subjectPath(locale, specialtyCode, sub.subject_code)} className="block h-full">
                        <Card interactive className="relative flex h-full flex-col overflow-hidden p-6">
                          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 to-sky-brand-400" />
                          <div className="flex items-center justify-between gap-2">
                            <CodeChip>{sub.subject_code}</CodeChip>
                            <Badge tone="accent">{statusLabel(sub.status, locale)}</Badge>
                          </div>

                          <h4 className="mt-3.5 line-clamp-2 flex-1 text-[15px] font-bold leading-snug">
                            {sub.subject_name}
                          </h4>

                          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-3.5">
                            {[
                              { k: tr(locale, "Kredit", "Credits"), v: sub.credit ?? "—" },
                              { k: tr(locale, "Saat", "Hours"), v: sub.hours_per_week ?? "—" },
                              { k: tr(locale, "Semestr", "Term"), v: semesterLabel(sub.semester, locale) },
                            ].map((cell) => (
                              <div key={cell.k}>
                                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                                  {cell.k}
                                </dt>
                                <dd className="mt-0.5 text-[14px] font-bold text-[var(--text-strong)]">{cell.v}</dd>
                              </div>
                            ))}
                          </dl>

                          <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--brand-accent)]">
                            {tr(locale, "Sillabusa bax", "View syllabus")}
                            <ArrowRight />
                          </span>
                        </Card>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]">
                  <div className="table-scroll">
                    <table className="w-full min-w-[680px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
                          {[
                            tr(locale, "Kod", "Code"),
                            tr(locale, "Fənnin adı", "Subject"),
                            tr(locale, "Semestr", "Term"),
                            tr(locale, "Kredit", "Credits"),
                            tr(locale, "Status", "Status"),
                          ].map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((sub) => (
                          <tr
                            key={sub.subject_code}
                            className="border-b border-[var(--border-subtle)] transition-colors last:border-0 hover:bg-[var(--surface-sunken)]"
                          >
                            <td className="px-4 py-3">
                              <CodeChip>{sub.subject_code}</CodeChip>
                            </td>
                            <td className="px-4 py-3">
                              <Link
                                href={subjectPath(locale, specialtyCode, sub.subject_code)}
                                className="text-[14px] font-semibold text-[var(--text-strong)] hover:text-[var(--brand-accent)]"
                              >
                                {sub.subject_name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-[13.5px] text-[var(--text-muted)]">
                              {semesterLabel(sub.semester, locale)}
                            </td>
                            <td className="px-4 py-3 text-[13.5px] font-semibold text-[var(--text-strong)]">
                              {sub.credit ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge tone="accent">{statusLabel(sub.status, locale)}</Badge>
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
