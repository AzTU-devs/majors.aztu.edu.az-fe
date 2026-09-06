"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getCloBySubjectCode, type Clo } from "@/services/clo/clo";
import { getPloBySpecialty, type PloInterface } from "@/services/plo/ploService";
import { getCloPloMatchesBySubject } from "@/services/cloPloMatch/cloPloMatchService";
import { EmptyState, SectionHeading, Skeleton, TableFrame } from "@/components/ui/primitives";

const Tick = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="mx-auto h-4 w-4">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * CLO ↔ PLO matrix for one subject: which programme outcome each of the
 * subject's course outcomes contributes to.
 */
export default function CloPloMatrix({
  locale,
  specialtyCode,
  subjectCode,
}: {
  locale: Locale;
  specialtyCode: string;
  subjectCode: string;
}) {
  const [clos, setClos] = useState<Clo[]>([]);
  const [plos, setPlos] = useState<PloInterface[]>([]);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const [cloList, ploList, matchList] = await Promise.all([
        getCloBySubjectCode(subjectCode, locale),
        getPloBySpecialty(specialtyCode, locale),
        getCloPloMatchesBySubject(subjectCode),
      ]);
      if (cancelled) return;
      setClos(cloList);
      setPlos(ploList);
      setMatches(new Set(matchList.map((m) => `${m.clo_code}__${m.plo_code}`)));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [specialtyCode, subjectCode, locale]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Matris", "Matrix")}
        title={tr(locale, "CLO ↔ PLO uyğunluq cədvəli", "CLO ↔ PLO matching table")}
        subtitle={tr(
          locale,
          "Fənn təlim nəticələrinin proqram təlim məqsədlərinə uyğunluğu.",
          "How this subject's course outcomes map onto the programme's learning outcomes."
        )}
      />

      {loading ? (
        <Skeleton className="h-72 rounded-2xl" />
      ) : clos.length === 0 || plos.length === 0 ? (
        <EmptyState
          message={
            clos.length === 0
              ? tr(locale, "Bu fənn üçün təlim nəticəsi əlavə edilməyib.", "No course outcomes have been added for this subject.")
              : tr(locale, "Bu ixtisas üçün proqram təlim məqsədi əlavə edilməyib.", "No programme learning outcomes have been added.")
          }
        />
      ) : (
        <TableFrame
          caption={tr(
            locale,
            `${clos.length} CLO × ${plos.length} PLO`,
            `${clos.length} CLOs × ${plos.length} PLOs`
          )}
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--surface-sunken)]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[260px] border-b border-r border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-4 py-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]"
                >
                  {tr(locale, "Fənn təlim nəticəsi", "Course outcome")}
                </th>
                {plos.map((p) => (
                  <th
                    key={p.plo_code}
                    scope="col"
                    title={p.plo_content}
                    className="border-b border-[var(--border-subtle)] px-2 py-3 text-center font-mono text-[10.5px] font-semibold text-[var(--text-muted)]"
                  >
                    {p.plo_code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clos.map((clo, i) => {
                // The match rows key CLOs by their code; fall back to the index
                // label when a record predates codes being stored.
                const cloCode = (clo as Clo & { clo_code?: string }).clo_code ?? "";
                return (
                  <tr key={cloCode || i} className="transition-colors hover:bg-[var(--surface-sunken)]/60">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-r border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 text-left align-top"
                    >
                      <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                        {cloCode || `CLO ${i + 1}`}
                      </span>
                      <span className="mt-1 block max-w-[300px] text-[13px] font-medium leading-snug text-[var(--text-body)]">
                        {clo.clo_content}
                      </span>
                    </th>
                    {plos.map((p) => {
                      const hit = matches.has(`${cloCode}__${p.plo_code}`);
                      return (
                        <td
                          key={p.plo_code}
                          className="border-b border-[var(--border-subtle)] px-2 py-3 text-center"
                        >
                          {hit ? (
                            <span className="text-[var(--brand-accent)]" title={p.plo_content}>
                              {Tick}
                            </span>
                          ) : (
                            <span className="text-[var(--border-strong)]" aria-hidden>
                              ·
                            </span>
                          )}
                          <span className="sr-only">
                            {hit ? tr(locale, "uyğundur", "matches") : tr(locale, "uyğun deyil", "does not match")}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableFrame>
      )}
    </>
  );
}
