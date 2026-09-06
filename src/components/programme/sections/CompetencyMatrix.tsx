"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getCompetencyBySpecialty, type Competency } from "@/services/competency/competencyService";
import { getCurriculaBySpecialtyCode, type Subject } from "@/services/curricula/curricula";
import { getMatchedSubjectsByCompetency } from "@/services/competencyMatch/competencyMatchService";
import { EmptyState, SectionHeading, Skeleton, TableFrame } from "@/components/ui/primitives";

const Tick = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="mx-auto h-4 w-4">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Competency ↔ subject matrix.
 *
 * Rows are competencies, columns are subjects; a tick means the subject
 * contributes to that competency. The table scrolls inside its own frame so a
 * wide curriculum never makes the page scroll sideways.
 */
export default function CompetencyMatrix({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!specialtyCode) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [comps, subs] = await Promise.all([
          getCompetencyBySpecialty(specialtyCode, locale),
          getCurriculaBySpecialtyCode(specialtyCode, 0, 400, locale),
        ]);

        const results = await Promise.all(
          comps.map((c) => getMatchedSubjectsByCompetency(c.competency_code))
        );
        const keys = new Set<string>();
        comps.forEach((c, i) => {
          results[i].forEach((m) => keys.add(`${c.competency_code}__${m.subject_code}`));
        });

        if (cancelled) return;
        setCompetencies(comps);
        setSubjects(subs);
        setMatches(keys);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, specialtyCode]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Matris", "Matrix")}
        title={tr(locale, "Səriştə uyğunluq cədvəli", "Competency matching table")}
        subtitle={tr(
          locale,
          "Hansı fənnin hansı səriştəyə töhfə verdiyini göstərir.",
          "Shows which subject contributes to which competency."
        )}
      />

      {loading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : competencies.length === 0 || subjects.length === 0 ? (
        <EmptyState
          message={
            competencies.length === 0
              ? tr(locale, "Səriştə əlavə edilməyib.", "No competencies have been added.")
              : tr(locale, "Bu ixtisas üçün fənn tapılmadı.", "No subjects found for this programme.")
          }
        />
      ) : (
        <TableFrame
          caption={tr(
            locale,
            `${competencies.length} səriştə × ${subjects.length} fənn`,
            `${competencies.length} competencies × ${subjects.length} subjects`
          )}
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--surface-sunken)]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[220px] border-b border-r border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-4 py-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]"
                >
                  {tr(locale, "Səriştə", "Competency")}
                </th>
                {subjects.map((s) => (
                  <th
                    key={s.subject_code}
                    scope="col"
                    title={s.subject_name}
                    className="border-b border-[var(--border-subtle)] px-2 py-3 text-center font-mono text-[10.5px] font-semibold text-[var(--text-muted)]"
                  >
                    <span className="block max-w-[68px] truncate">{s.subject_code}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competencies.map((c) => (
                <tr key={c.competency_code} className="transition-colors hover:bg-[var(--surface-sunken)]/60">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-r border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 text-left align-top"
                  >
                    <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                      {c.competency_code}
                    </span>
                    <span className="mt-1 block max-w-[260px] text-[13px] font-medium leading-snug text-[var(--text-body)]">
                      {c.competency_content}
                    </span>
                  </th>
                  {subjects.map((s) => {
                    const hit = matches.has(`${c.competency_code}__${s.subject_code}`);
                    return (
                      <td
                        key={s.subject_code}
                        className="border-b border-[var(--border-subtle)] px-2 py-3 text-center"
                      >
                        {hit ? (
                          <span className="text-[var(--brand-accent)]" title={s.subject_name}>
                            {Tick}
                          </span>
                        ) : (
                          <span className="text-[var(--border-strong)]" aria-hidden>
                            ·
                          </span>
                        )}
                        <span className="sr-only">
                          {hit
                            ? tr(locale, "uyğundur", "matches")
                            : tr(locale, "uyğun deyil", "does not match")}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
    </>
  );
}
