import Link from "next/link";

import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconArrowRight, IconCalendar, IconClock, IconDoc, IconLayers } from "@/components/ui/icons";
import { InfoRow, StatTile } from "@/components/ui/primitives";
import {
  formOfEducationLabel,
  languageLabel,
  semesterLabel,
  statusLabel,
} from "@/constants/subjectMeta";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import { subjectPath } from "@/lib/routes";
import type { Locale } from "@/lib/site";
import type { Clo } from "@/services/clo/clo";
import type { SubjectDetails } from "@/services/curricula/curricula";

export default function SubjectOverview({
  locale,
  specialtyKey,
  subjectKey,
  subject,
  descriptionLang,
  clos,
}: {
  locale: Locale;
  specialtyKey: string;
  subjectKey: string;
  subject: SubjectDetails;
  /** "az" when an English page shows the Azerbaijani description. */
  descriptionLang?: "az";
  /** On an English page, outcomes shown in their Azerbaijani fallback carry lang "az". */
  clos: Settled<Marked<Clo>[]>;
}) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="sr-only">{tr(locale, "Fənn haqqında", "About this subject")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<IconLayers />} label={tr(locale, "Kredit", "Credits")} value={subject.credit ?? "—"} />
        <StatTile
          icon={<IconClock />}
          label={tr(locale, "İş yükü", "Workload")}
          value={subject.hours_per_week ?? "—"}
          hint={subject.hours_per_week ? tr(locale, "saat", "hours") : undefined}
        />
        <StatTile icon={<IconCalendar />} label={tr(locale, "Semestr", "Semester")} value={semesterLabel(subject.semester, locale)} />
        <StatTile icon={<IconCalendar />} label={tr(locale, "Tədris ili", "Academic year")} value={subject.year?.trim() || "—"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {subject.subject_description?.trim() && (
            <section className="card p-7 md:p-9" aria-labelledby="subject-about">
              <h3 id="subject-about" className="t-lg">
                {tr(locale, "Fənnin təsviri", "Description")}
              </h3>
              <p className="prose-text mt-4" lang={descriptionLang}>
                {subject.subject_description}
              </p>
            </section>
          )}

          <section className="card p-7 md:p-9" aria-labelledby="subject-clo">
            <h3 id="subject-clo" className="t-lg">
              {tr(locale, "Fənn təlim nəticələri", "Course learning outcomes")}
            </h3>
            {!clos.ok ? (
              <div className="mt-5">
                <RefreshErrorState locale={locale} />
              </div>
            ) : clos.data.length === 0 ? (
              <p className="mt-3 text-[15px] text-ink-3">
                {tr(locale, "Təlim nəticəsi əlavə edilməyib.", "No learning outcomes have been added.")}
              </p>
            ) : (
              <ol className="mt-5 flex flex-col gap-4">
                {clos.data.map((clo, i) => (
                  <li key={clo.clo_code ?? i} className="flex gap-4">
                    <span className="num !h-9 !min-w-9 !rounded-[11px]" aria-hidden>
                      {i + 1}
                    </span>
                    <p className="pt-1.5 text-[15.5px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
                      <span className="sr-only">CLO {i + 1}: </span>
                      <span lang={clo.lang}>{clo.clo_content}</span>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Link
            href={subjectPath(locale, specialtyKey, subjectKey, "syllabus")}
            className="group relative overflow-hidden rounded-[24px] bg-brand-navy p-7 text-white elev-2 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-white/12 text-white">
              <IconDoc />
            </span>
            <span className="mt-5 block font-display text-[21px] font-bold tracking-[-0.015em]">
              {tr(locale, "Tam sillabus", "Full syllabus")}
            </span>
            <span className="mt-1.5 block text-[14.5px] leading-snug text-white/75">
              {tr(locale, "Mövzu planı, qiymətləndirmə və ədəbiyyat siyahısı", "Topic plan, assessment and reading list")}
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-gold">
              {tr(locale, "Sillabusu açın", "Open the syllabus")}
              <IconArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          <section className="card p-7" aria-labelledby="subject-facts">
            <h3 id="subject-facts" className="t-md">
              {tr(locale, "Ümumi məlumat", "General information")}
            </h3>
            <dl className="mt-3">
              <InfoRow label={tr(locale, "Fənn kodu", "Subject code")} value={<span className="code">{subject.subject_code || "—"}</span>} />
              <InfoRow label={tr(locale, "Fənnin tipi", "Subject type")} value={statusLabel(subject.status, locale)} />
              <InfoRow label={tr(locale, "Təhsil forması", "Form of education")} value={formOfEducationLabel(subject.form_of_education, locale)} />
              <InfoRow label={tr(locale, "Tədris dili", "Language of instruction")} value={languageLabel(subject.language_of_instruction, locale)} />
              {subject.in_class_hours && (
                <InfoRow
                  label={tr(locale, "Auditoriyadaxili saatlar", "In-class hours")}
                  value={<span className="whitespace-pre-line">{subject.in_class_hours}</span>}
                />
              )}
              {subject.out_of_class_hours && (
                <InfoRow
                  label={tr(locale, "Auditoriyadan kənar saatlar", "Out-of-class hours")}
                  value={<span className="whitespace-pre-line">{subject.out_of_class_hours}</span>}
                />
              )}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
