import Link from "next/link";

import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconArrowRight, IconDoc } from "@/components/ui/icons";
import { CodePill, EmptyState, PanelHead, Pill } from "@/components/ui/primitives";
import type { Settled, SubjectSummary } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { subjectPath } from "@/lib/routes";
import { countLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { Clo } from "@/services/clo/clo";

/**
 * Course learning outcomes for the whole programme, grouped by subject.
 * Subjects with no recorded outcomes are omitted rather than shown empty.
 */
export default function CourseOutcomes({
  locale,
  specialtyKey,
  rows,
}: {
  locale: Locale;
  specialtyKey: string;
  /** On an English page, records shown in their Azerbaijani fallback carry lang "az". */
  rows: Settled<{ subject: Marked<SubjectSummary>; clos: Marked<Clo>[] }[]>;
}) {
  return (
    <>
      <PanelHead
        title={tr(locale, "Fənn təlim nəticələri", "Course learning outcomes")}
        lead={tr(
          locale,
          "Hər fənnin sonunda tələbənin əldə etməli olduğu nəticələr.",
          "What a student is expected to achieve by the end of each subject."
        )}
        aside={rows.ok && rows.data.length > 0 ? <Pill tone="k">{countLabel(rows.data.length, locale, "subject")}</Pill> : undefined}
      />

      {!rows.ok ? (
        <RefreshErrorState locale={locale} />
      ) : rows.data.length === 0 ? (
        <EmptyState
          icon={<IconDoc size={26} />}
          message={tr(
            locale,
            "Bu ixtisasın fənləri üçün təlim nəticələri hələ əlavə edilməyib.",
            "No course learning outcomes have been published for this programme's subjects yet."
          )}
        />
      ) : (
        <ul className="flex flex-col gap-5">
          {rows.data.map(({ subject, clos }) => (
            <li key={subject.subject_key} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-6 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <CodePill className="max-w-[10rem] truncate">{subject.subject_code}</CodePill>
                  <h3 className="truncate font-display text-[17px] font-bold tracking-[-0.01em] text-ink" lang={subject.lang}>
                    {subject.subject_name}
                  </h3>
                </div>
                <Link href={subjectPath(locale, specialtyKey, subject.subject_key)} className="link-arrow !text-[14px]">
                  {tr(locale, "Fənnin səhifəsi", "Subject page")}
                  <span className="sr-only">: {subject.subject_name}</span>
                  <IconArrowRight />
                </Link>
              </div>
              <ol className="divide-y divide-line">
                {clos.map((clo, i) => (
                  <li key={clo.clo_code ?? i} className="flex gap-4 px-6 py-4">
                    <span className="num !h-8 !min-w-8 !rounded-[10px] !text-[12px]" aria-hidden>
                      {i + 1}
                    </span>
                    <p className="text-[15.5px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
                      <span className="sr-only">CLO {i + 1}: </span>
                      <span lang={clo.lang}>{clo.clo_content}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
