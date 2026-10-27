import PrintButton from "@/components/subject/PrintButton";
import RefreshErrorState from "@/components/ui/RefreshErrorState";
import { IconExternal } from "@/components/ui/icons";
import { InfoRow, PanelHead, Pill, TableFrame } from "@/components/ui/primitives";
import {
  formOfEducationLabel,
  languageLabel,
  parseTeachingMethods,
  semesterLongLabel,
  statusLabel,
  teachingMethodLabel,
} from "@/constants/subjectMeta";
import type { Settled } from "@/lib/api";
import type { Marked } from "@/lib/content";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { safeExternalUrl } from "@/lib/url";
import type { Clo } from "@/services/clo/clo";
import type { SubjectDetails } from "@/services/curricula/curricula";
import type { Literature } from "@/services/literature/literatureService";
import type { Tlo } from "@/services/tlo/tloService";
import type { Topic } from "@/services/topic/topic";

/** Topic delivery type. */
export const TOPIC_TYPE: Record<number, { az: string; en: string }> = {
  1: { az: "Mühazirə", en: "Lecture" },
  2: { az: "Məşğələ", en: "Seminar" },
  3: { az: "Laboratoriya", en: "Laboratory" },
  4: { az: "Sərbəst iş", en: "Independent work" },
};

export interface SyllabusData {
  subject: SubjectDetails;
  /** On an English page, records shown in their Azerbaijani fallback carry lang "az". */
  clos: Marked<Clo>[];
  topics: (Marked<Topic> & { tlos: Marked<Tlo>[] })[];
  literatures: Literature[];
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-8 first:border-t-0 first:pt-0 md:py-10">
      <h3 id={id} className="t-lg">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Syllabus({
  locale,
  data,
  descriptionLang,
}: {
  locale: Locale;
  data: Settled<SyllabusData>;
  /** "az" when an English page shows the Azerbaijani description. */
  descriptionLang?: "az";
}) {
  const header = (
    <PanelHead
      title={tr(locale, "Sillabus", "Syllabus")}
      lead={tr(
        locale,
        "Fənnin rəsmi proqramı: ümumi məlumat, təlim nəticələri, mövzu planı, ədəbiyyat və qiymətləndirmə.",
        "The subject's official programme: general information, outcomes, topic plan, reading list and assessment."
      )}
      aside={data.ok ? <PrintButton label={tr(locale, "Çap et", "Print")} /> : undefined}
    />
  );

  if (!data.ok) {
    return (
      <>
        {header}
        <RefreshErrorState locale={locale} />
      </>
    );
  }

  const { subject, clos, topics, literatures } = data.data;
  const methods = parseTeachingMethods(subject.teaching_methods);

  return (
    <>
      {header}
      <article className="card p-6 sm:p-9 md:p-12">
        <Block id="syl-general" title={tr(locale, "Ümumi məlumat", "General information")}>
          <dl className="grid gap-x-10 md:grid-cols-2">
            <div>
              <InfoRow label={tr(locale, "Fənn kodu", "Subject code")} value={<span className="code">{subject.subject_code || "—"}</span>} />
              <InfoRow label={tr(locale, "Kredit", "Credits")} value={subject.credit ?? "—"} />
              <InfoRow label={tr(locale, "Tələbənin iş yükü", "Student workload")} value={subject.hours_per_week ?? "—"} />
              <InfoRow label={tr(locale, "Semestr", "Semester")} value={semesterLongLabel(subject.semester, locale)} />
            </div>
            <div>
              <InfoRow label={tr(locale, "Akademik il", "Academic year")} value={subject.year?.trim() || "—"} />
              <InfoRow label={tr(locale, "Fənnin tipi", "Subject type")} value={statusLabel(subject.status, locale)} />
              <InfoRow label={tr(locale, "Təhsil forması", "Form of education")} value={formOfEducationLabel(subject.form_of_education, locale)} />
              <InfoRow label={tr(locale, "Tədris dili", "Language of instruction")} value={languageLabel(subject.language_of_instruction, locale)} />
            </div>
          </dl>
          {(subject.in_class_hours || subject.out_of_class_hours) && (
            <dl className="mt-2 grid gap-x-10 md:grid-cols-2">
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
          )}
        </Block>

        {subject.subject_description?.trim() && (
          <Block id="syl-about" title={tr(locale, "Fənn haqqında", "About the subject")}>
            <p className="prose-text" lang={descriptionLang}>
              {subject.subject_description}
            </p>
          </Block>
        )}

        {methods.length > 0 && (
          <Block id="syl-methods" title={tr(locale, "Tədris metodları", "Teaching methods")}>
            <ul className="flex flex-wrap gap-2">
              {methods.map((k) => (
                <li key={k}>
                  <Pill tone="k">{teachingMethodLabel(k, locale)}</Pill>
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block id="syl-clo" title={tr(locale, "Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)")}>
          {clos.length === 0 ? (
            <p className="text-[15px] text-ink-3">
              {tr(locale, "Təlim nəticəsi əlavə edilməyib.", "No learning outcomes have been added.")}
            </p>
          ) : (
            <ol className="flex flex-col gap-3.5">
              {clos.map((clo, i) => (
                <li key={clo.clo_code ?? i} className="flex items-start gap-3.5">
                  <span className="num !h-8 !min-w-8 !rounded-[10px] !text-[12px]" aria-hidden>
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[15.5px] leading-relaxed text-ink-2 [overflow-wrap:anywhere]">
                    <span className="sr-only">CLO {i + 1}: </span>
                    <span lang={clo.lang}>{clo.clo_content}</span>
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Block>

        <Block id="syl-topics" title={tr(locale, "Mövzu planı", "Topic plan")}>
          {topics.length === 0 ? (
            <p className="text-[15px] text-ink-3">{tr(locale, "Mövzu əlavə edilməyib.", "No topics have been added.")}</p>
          ) : (
            <ol className="flex flex-col divide-y divide-line">
              {topics.map((topic, i) => (
                <li key={topic.topic_key} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="w-8 shrink-0 pt-0.5 text-right font-mono text-[13px] font-semibold text-k-700">{i + 1}.</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[15.5px] font-semibold text-ink [overflow-wrap:anywhere]" lang={topic.lang}>
                        {topic.topic_name}
                      </span>
                      {TOPIC_TYPE[topic.topic_type] && (
                        <span className="text-[13px] text-ink-3">{TOPIC_TYPE[topic.topic_type][locale]}</span>
                      )}
                    </div>
                    {topic.topic_desc && (
                      <p className="mt-1 text-[14.5px] leading-relaxed text-ink-3" lang={topic.lang}>
                        {topic.topic_desc}
                      </p>
                    )}
                    {topic.tlos.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14.5px] text-ink-2 marker:text-k-500">
                        {topic.tlos.map((tlo, idx) => (
                          <li key={`${tlo.tlo_code}-${idx}`} lang={tlo.lang}>
                            {tlo.tlo_content}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Block>

        <Block id="syl-reading" title={tr(locale, "Ədəbiyyat", "Reading list")}>
          {literatures.length === 0 ? (
            <p className="text-[15px] text-ink-3">{tr(locale, "Ədəbiyyat əlavə edilməyib.", "No reading list has been added.")}</p>
          ) : (
            <ol className="list-decimal space-y-2.5 pl-6 text-[15.5px] text-ink-2 marker:font-mono marker:text-[13px] marker:text-ink-3">
              {literatures.map((lit, idx) => {
                const href = safeExternalUrl(lit.url);
                // An entry without a title in this language still lists its link.
                const label = lit.literature_name?.trim() || href || lit.url || "—";
                return (
                  <li key={lit.id ?? `${lit.literature_code}-${idx}`} className="pl-1 [overflow-wrap:anywhere]">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-baseline gap-1.5 text-navy underline decoration-line-2 underline-offset-4 hover:decoration-navy"
                      >
                        {label}
                        <IconExternal size={13} className="shrink-0 translate-y-0.5" />
                        <span className="sr-only">{tr(locale, "(yeni pəncərədə açılır)", "(opens in a new tab)")}</span>
                      </a>
                    ) : (
                      label
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </Block>

        {subject.assessment && subject.assessment.length > 0 && (
          <Block id="syl-assessment" title={tr(locale, "Qiymətləndirmə", "Assessment")}>
            <TableFrame className="!shadow-none" label={tr(locale, "Qiymətləndirmə cədvəli", "Assessment table")}>
              <table className="tbl min-w-[600px]">
                <thead>
                  <tr>
                    <th scope="col">{tr(locale, "Qiymətləndirmə forması", "Form")}</th>
                    <th scope="col">{tr(locale, "Açıqlama", "Description")}</th>
                    <th scope="col">{tr(locale, "Bal", "Score")}</th>
                    <th scope="col">{tr(locale, "Uyğun FTN", "Related CLO")}</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.assessment.map((row, i) => (
                    <tr key={i}>
                      <td className="font-semibold text-ink">{row.form}</td>
                      <td className="text-ink-2">{row.description}</td>
                      <td className="whitespace-nowrap text-ink">{row.score}</td>
                      <td className="whitespace-nowrap text-ink-2">{row.ftn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          </Block>
        )}
      </article>
    </>
  );
}
