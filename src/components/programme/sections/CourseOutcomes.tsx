"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { subjectPath } from "@/lib/routes";
import { getCloBySubjectCode, type Clo } from "@/services/clo/clo";
import { getCurriculaBySpecialtyCode, type Subject } from "@/services/curricula/curricula";
import {
  ArrowRight,
  Card,
  CodeChip,
  EmptyState,
  SectionHeading,
  Skeleton,
} from "@/components/ui/primitives";

/**
 * Course learning outcomes for the whole programme, grouped by subject.
 * Subjects with no recorded outcomes are omitted rather than shown empty.
 */
export default function CourseOutcomes({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [rows, setRows] = useState<{ subject: Subject; clos: Clo[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const subjects = await getCurriculaBySpecialtyCode(specialtyCode, 0, 400, locale);
      if (cancelled) return;

      const clos = await Promise.all(
        subjects.map((s) => getCloBySubjectCode(s.subject_code, locale))
      );
      if (cancelled) return;

      setRows(
        subjects
          .map((subject, i) => ({ subject, clos: clos[i] }))
          .filter((r) => r.clos.length > 0)
      );
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "CLO", "CLO")}
        title={tr(locale, "Fənn təlim nəticələri", "Course learning outcomes")}
        subtitle={tr(
          locale,
          "Hər fənnin sonunda tələbənin əldə etməli olduğu nəticələr.",
          "What a student is expected to achieve by the end of each subject."
        )}
      />

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Bu ixtisasın fənləri üçün təlim nəticələri hələ əlavə edilməyib.",
            "No course learning outcomes have been published for this programme's subjects yet."
          )}
        />
      ) : (
        <div className="space-y-5">
          {rows.map(({ subject, clos }) => (
            <Card key={subject.subject_code} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-6 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <CodeChip>{subject.subject_code}</CodeChip>
                  <h3 className="truncate text-[15px] font-bold">{subject.subject_name}</h3>
                </div>
                <Link
                  href={subjectPath(locale, specialtyCode, subject.subject_code)}
                  className="group inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-[var(--brand-accent)]"
                >
                  {tr(locale, "Fənnə bax", "Open subject")}
                  <ArrowRight />
                </Link>
              </div>

              <ol className="divide-y divide-[var(--border-subtle)]">
                {clos.map((clo, i) => (
                  <li key={i} className="flex gap-4 px-6 py-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--brand-tint)] text-[11.5px] font-extrabold text-[var(--brand-accent)]">
                      {i + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed text-[var(--text-body)]">{clo.clo_content}</p>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
