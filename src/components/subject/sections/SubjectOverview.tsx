"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { subjectPath } from "@/lib/routes";
import {
  formOfEducationLabel,
  languageLabel,
  semesterLabel,
  statusLabel,
} from "@/constants/subjectMeta";
import { getSubjectDetails, type SubjectDetails } from "@/services/curricula/curricula";
import { getCloBySubjectCode, type Clo } from "@/services/clo/clo";
import {
  ArrowRight,
  Card,
  EmptyState,
  InfoRow,
  SectionHeading,
  Skeleton,
  StatTile,
} from "@/components/ui/primitives";

export default function SubjectOverview({
  locale,
  specialtyCode,
  subjectCode,
}: {
  locale: Locale;
  specialtyCode: string;
  subjectCode: string;
}) {
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [clos, setClos] = useState<Clo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getSubjectDetails(subjectCode, locale),
      getCloBySubjectCode(subjectCode, locale),
    ])
      .then(([details, cloList]) => {
        if (cancelled) return;
        setSubject(details);
        setClos(cloList);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [subjectCode, locale]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!subject) {
    return (
      <EmptyState
        message={tr(
          locale,
          "Bu fənn üçün məlumat tapılmadı.",
          "No details were found for this subject."
        )}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Headline figures */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={tr(locale, "Kredit", "Credits")} value={subject.credit ?? "—"} />
        <StatTile label={tr(locale, "İş yükü", "Workload")} value={subject.hours_per_week ?? "—"} hint={tr(locale, "saat", "hours")} />
        <StatTile label={tr(locale, "Semestr", "Semester")} value={semesterLabel(subject.semester, locale)} />
        <StatTile label={tr(locale, "Tədris ili", "Academic year")} value={subject.year || "—"} />
      </div>

      {/* Syllabus CTA */}
      <Link href={subjectPath(locale, specialtyCode, subjectCode, "syllabus")} className="block">
        <div className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-navy-700 p-6 text-white transition-transform duration-200 hover:-translate-y-0.5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_90%_-10%,#2f4184_0%,transparent_60%)]"
          />
          <div className="relative flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/12">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-6 w-6">
                <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" strokeLinejoin="round" />
                <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[16px] font-bold">{tr(locale, "Tam sillabus", "Full syllabus")}</p>
              <p className="mt-0.5 text-[13.5px] text-white/65">
                {tr(
                  locale,
                  "Mövzu planı, qiymətləndirmə və ədəbiyyat siyahısı",
                  "Topic plan, assessment and reading list"
                )}
              </p>
            </div>
          </div>
          <ArrowRight className="relative h-5 w-5 shrink-0" />
        </div>
      </Link>

      {/* Description */}
      {subject.subject_description && (
        <Card className="p-7">
          <h2 className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
            {tr(locale, "Fənn haqqında", "About this subject")}
          </h2>
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[var(--text-body)]">
            {subject.subject_description}
          </p>
        </Card>
      )}

      {/* Details */}
      <Card className="p-7">
        <h2 className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
          {tr(locale, "Ümumi məlumat", "General information")}
        </h2>
        <dl>
          <InfoRow label={tr(locale, "Fənn kodu", "Subject code")} value={<span className="font-mono">{subjectCode}</span>} />
          <InfoRow label={tr(locale, "Fənnin tipi", "Subject type")} value={statusLabel(subject.status, locale)} />
          <InfoRow
            label={tr(locale, "Təhsil forması", "Form of education")}
            value={formOfEducationLabel(subject.form_of_education, locale)}
          />
          <InfoRow
            label={tr(locale, "Tədris dili", "Language of instruction")}
            value={languageLabel(subject.language_of_instruction, locale)}
          />
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
      </Card>

      {/* Course learning outcomes */}
      {clos.length > 0 && (
        <div>
          <SectionHeading
            as="h2"
            title={tr(locale, "Fənn təlim nəticələri", "Course learning outcomes")}
            className="mb-5"
          />
          <ol className="grid gap-3">
            {clos.map((clo, i) => (
              <li key={i}>
                <Card className="flex gap-4 p-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-tint)] text-[12px] font-extrabold text-[var(--brand-accent)]">
                    {i + 1}
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-[var(--text-body)]">{clo.clo_content}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
