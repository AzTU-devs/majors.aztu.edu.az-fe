"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import {
  formOfEducationLabel,
  languageLabel,
  parseTeachingMethods,
  semesterLongLabel,
  statusLabel,
  teachingMethodLabel,
} from "@/constants/subjectMeta";
import { getSubjectDetails, type SubjectDetails } from "@/services/curricula/curricula";
import { getCloBySubjectCode, type Clo } from "@/services/clo/clo";
import { getTopics, type Topic } from "@/services/topic/topic";
import { getTloByTopicCode, type Tlo } from "@/services/tlo/tloService";
import { getLiteratures, type Literature } from "@/services/literature/literatureService";
import { Card, EmptyState, InfoRow, Skeleton, TableFrame } from "@/components/ui/primitives";

/** Topic delivery type. */
const TYPE_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Mühazirə", en: "Lecture" },
  2: { az: "Məşğələ", en: "Seminar" },
  3: { az: "Laboratoriya", en: "Laboratory" },
  4: { az: "Sərbəst iş", en: "Independent work" },
};

interface TopicWithTlos extends Topic {
  tlos: Tlo[];
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card as="article" className="p-6 md:p-7">
      <h2 className="mb-4 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
        {title}
      </h2>
      {children}
    </Card>
  );
}

export default function Syllabus({
  locale,
  subjectCode,
}: {
  locale: Locale;
  subjectCode: string;
}) {
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [clos, setClos] = useState<Clo[]>([]);
  const [topics, setTopics] = useState<TopicWithTlos[]>([]);
  const [literatures, setLiteratures] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const [details, cloList, litList, topicList] = await Promise.all([
        getSubjectDetails(subjectCode, locale),
        getCloBySubjectCode(subjectCode, locale),
        getLiteratures(subjectCode),
        getTopics(subjectCode, 0, 200, locale),
      ]);
      if (cancelled) return;

      const withTlos = await Promise.all(
        topicList.map(async (topic) => ({
          ...topic,
          tlos: await getTloByTopicCode(topic.topic_code, locale),
        }))
      );
      if (cancelled) return;

      setSubject(details);
      setClos(cloList);
      setLiteratures(litList);
      setTopics(withTlos);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [subjectCode, locale]);

  const methods = parseTeachingMethods(subject?.teaching_methods);

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!subject) {
    return (
      <EmptyState
        message={tr(locale, "Bu fənn üçün sillabus tapılmadı.", "No syllabus was found for this subject.")}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Print action */}
      <div className="flex justify-end no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--text-body)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
            <path d="M7 8V3h10v5M7 18H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2" strokeLinejoin="round" />
            <rect x="7" y="14" width="10" height="7" rx="1" />
          </svg>
          {tr(locale, "Çap et", "Print")}
        </button>
      </div>

      <Panel title={tr(locale, "Ümumi məlumat", "General information")}>
        <dl>
          <InfoRow label={tr(locale, "Fənn kodu", "Subject code")} value={<span className="font-mono">{subjectCode}</span>} />
          <InfoRow label={tr(locale, "Kredit", "Credits")} value={subject.credit ?? "—"} />
          <InfoRow label={tr(locale, "Tələbənin iş yükü", "Student workload")} value={subject.hours_per_week ?? "—"} />
          <InfoRow label={tr(locale, "Semestr", "Semester")} value={semesterLongLabel(subject.semester, locale)} />
          <InfoRow label={tr(locale, "Akademik il", "Academic year")} value={subject.year || "—"} />
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
      </Panel>

      {subject.subject_description && (
        <Panel title={tr(locale, "Fənn haqqında", "About the subject")}>
          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--text-body)]">
            {subject.subject_description}
          </p>
        </Panel>
      )}

      {methods.length > 0 && (
        <Panel title={tr(locale, "Tədris metodları", "Teaching methods")}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {methods.map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-[14px] text-[var(--text-body)]">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-accent)]" />
                {teachingMethodLabel(k, locale)}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title={tr(locale, "Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)")}>
        {clos.length === 0 ? (
          <p className="text-[14px] text-[var(--text-muted)]">
            {tr(locale, "Təlim nəticəsi əlavə edilməyib.", "No learning outcomes have been added.")}
          </p>
        ) : (
          <ol className="space-y-3">
            {clos.map((clo, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-tint)] text-[11px] font-extrabold text-[var(--brand-accent)]">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-[var(--text-body)]">{clo.clo_content}</p>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <Panel title={tr(locale, "Mövzu planı", "Topic plan")}>
        {topics.length === 0 ? (
          <p className="text-[14px] text-[var(--text-muted)]">
            {tr(locale, "Mövzu əlavə edilməyib.", "No topics have been added.")}
          </p>
        ) : (
          <ol className="space-y-3">
            {topics.map((topic, i) => (
              <li
                key={topic.topic_code}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-4"
              >
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-[13px] font-extrabold text-[var(--brand-accent)]">{i + 1}.</span>
                  <span className="text-[14.5px] font-bold text-[var(--text-strong)]">{topic.topic_name}</span>
                  {TYPE_LABEL[topic.topic_type] && (
                    <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">
                      {TYPE_LABEL[topic.topic_type][locale]}
                    </span>
                  )}
                </div>

                {topic.topic_desc && (
                  <p className="mt-1.5 pl-6 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                    {topic.topic_desc}
                  </p>
                )}

                {topic.tlos.length > 0 && (
                  <div className="mt-3 pl-6">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {tr(locale, "Təlim nəticələri", "Learning outcomes")}
                    </p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13.5px] text-[var(--text-body)]">
                      {topic.tlos.map((tlo) => (
                        <li key={tlo.tlo_code}>{tlo.tlo_content}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <Panel title={tr(locale, "Ədəbiyyat", "Reading list")}>
        {literatures.length === 0 ? (
          <p className="text-[14px] text-[var(--text-muted)]">
            {tr(locale, "Ədəbiyyat əlavə edilməyib.", "No reading list has been added.")}
          </p>
        ) : (
          <ol className="list-decimal space-y-2 pl-5 text-[14px] text-[var(--text-body)] marker:text-[var(--text-muted)]">
            {literatures.map((lit) => (
              <li key={lit.id ?? lit.literature_code}>
                {lit.url ? (
                  <a
                    href={lit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-accent)] underline-offset-2 hover:underline"
                  >
                    {lit.literature_name}
                  </a>
                ) : (
                  lit.literature_name
                )}
              </li>
            ))}
          </ol>
        )}
      </Panel>

      {subject.assessment && subject.assessment.length > 0 && (
        <Panel title={tr(locale, "Qiymətləndirmə", "Assessment")}>
          <TableFrame className="shadow-none">
            <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-[var(--surface-sunken)]">
                  {[
                    tr(locale, "Qiymətləndirmə forması", "Form"),
                    tr(locale, "Açıqlama", "Description"),
                    tr(locale, "Bal", "Score"),
                    tr(locale, "Uyğun FTN", "Related CLO"),
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border-b border-[var(--border-subtle)] px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subject.assessment.map((row, i) => (
                  <tr key={i} className="align-top">
                    <td className="border-b border-[var(--border-subtle)] px-3.5 py-3 font-semibold text-[var(--text-strong)]">
                      {row.form}
                    </td>
                    <td className="border-b border-[var(--border-subtle)] px-3.5 py-3 text-[var(--text-muted)]">
                      {row.description}
                    </td>
                    <td className="whitespace-nowrap border-b border-[var(--border-subtle)] px-3.5 py-3 text-[var(--text-body)]">
                      {row.score}
                    </td>
                    <td className="whitespace-nowrap border-b border-[var(--border-subtle)] px-3.5 py-3 text-[var(--text-body)]">
                      {row.ftn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>
      )}
    </div>
  );
}
