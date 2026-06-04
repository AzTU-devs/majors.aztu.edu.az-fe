"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import PrintIcon from "@mui/icons-material/Print";
import { RootState } from "@/redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getSubjectDetails, SubjectDetails } from "@/services/curricula/curricula";
import { getCloBySubjectCode, Clo } from "@/services/clo/clo";
import { getTopics, Topic } from "@/services/topic/topic";
import { getTloByTopicCode, Tlo } from "@/services/tlo/tloService";
import { getLiteratures, Literature } from "@/services/literature/literatureService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";
import {
  formOfEducationLabel,
  languageLabel,
  teachingMethodLabel,
  parseTeachingMethods,
} from "@/constants/subjectMeta";

export type Locale = "az" | "en";

const SEMESTER_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Yaz semestri", en: "Spring semester" },
  2: { az: "Payız semestri", en: "Autumn semester" },
};

const STATUS_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Seçmə", en: "Elective" },
  2: { az: "Məcburi", en: "Mandatory" },
  3: { az: "Digər", en: "Other" },
};

const TYPE_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Mühazirə", en: "Lecture" },
  2: { az: "Məşğələ", en: "Seminar" },
  3: { az: "Laboratoriya", en: "Laboratory" },
  4: { az: "Sərbəst iş", en: "Independent work" },
};

interface TopicWithTlos extends Topic {
  tlos: Tlo[];
}

export default function SubjectSyllabusPage() {
  const params = useParams<{ specialtyCode: string; subjectCode: string }>();
  const locale: Locale = useSelector((s: RootState) => s.locale.value);

  const specialtyCode = decodeURIComponent(
    Array.isArray(params.specialtyCode) ? params.specialtyCode[0] : params.specialtyCode || ""
  );
  const subjectCode = decodeURIComponent(
    Array.isArray(params.subjectCode) ? params.subjectCode[0] : params.subjectCode || ""
  );

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [specialtyName, setSpecialtyName] = useState("");
  const [clos, setClos] = useState<Clo[]>([]);
  const [topics, setTopics] = useState<TopicWithTlos[]>([]);
  const [literatures, setLiteratures] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (az: string, en: string) => (locale === "az" ? az : en);
  const label = (map: Record<number, { az: string; en: string }>, key?: number) =>
    key != null && map[key] ? map[key][locale] : "—";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const [detailsRes, specialtyRes, cloRes, litRes, topicRes] = await Promise.all([
        getSubjectDetails(subjectCode, locale),
        getSpecialtyDetails(specialtyCode, locale),
        getCloBySubjectCode(subjectCode, locale),
        getLiteratures(subjectCode),
        getTopics(subjectCode, 0, 100, locale),
      ]);

      const topicList: Topic[] =
        topicRes && typeof topicRes === "object" && Array.isArray(topicRes.topics)
          ? topicRes.topics
          : [];
      const withTlos = await Promise.all(
        topicList.map(async (topic) => ({
          ...topic,
          tlos: await getTloByTopicCode(topic.topic_code, locale),
        }))
      );

      if (cancelled) return;
      setSubject(detailsRes && typeof detailsRes === "object" ? (detailsRes as SubjectDetails) : null);
      setSpecialtyName(typeof specialtyRes === "string" && specialtyRes !== "ERROR" && specialtyRes !== "NOT FOUND" ? specialtyRes : "");
      setClos(Array.isArray(cloRes) ? cloRes : []);
      setLiteratures(
        litRes && typeof litRes === "object" && Array.isArray(litRes.literatures) ? litRes.literatures : []
      );
      setTopics(withTlos);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [subjectCode, specialtyCode, locale]);

  const subBase = `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subjectCode}`;

  const InfoRow = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex gap-4 border-b border-gray-100 py-2.5 last:border-0">
      <span className="w-44 flex-shrink-0 text-[13px] font-medium text-gray-500">{k}</span>
      <span className="text-[14px] text-gray-800">{v}</span>
    </div>
  );

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-[15px] font-semibold text-[#182f79]">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f5f7ff] via-white to-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#182f79] via-[#1f3a96] to-[#3b4fc2] text-white print:bg-none print:text-black">
          <div className="relative mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-14">
            <Link
              href={subBase}
              className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white print:hidden"
            >
              ← {t("Fənnə qayıt", "Back to subject")}
            </Link>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
              {t("Sillabus", "Syllabus")}
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {loading ? (
                <Skeleton variant="text" width={380} height={44} sx={{ bgcolor: "rgba(255,255,255,.18)" }} />
              ) : (
                subject?.subject_name || t("Fənn", "Subject")
              )}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="rounded-lg bg-white/15 px-3 py-1 font-mono text-xs ring-1 ring-white/20">
                {subjectCode}
              </span>
              {specialtyName && (
                <>
                  <span className="text-white/40">/</span>
                  <span>{specialtyName} ({specialtyCode})</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 space-y-6">
          <div className="flex justify-end print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#182f79]/20 bg-white px-4 py-2 text-sm font-medium text-[#182f79] shadow-sm transition hover:bg-[#182f79]/5"
            >
              <PrintIcon sx={{ fontSize: 18 }} />
              {t("Çap et", "Print")}
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={64} />
              ))}
            </div>
          ) : (
            <>
              {/* General information */}
              <SectionCard title={t("Ümumi məlumat", "General information")}>
                <div className="divide-y divide-gray-100">
                  <InfoRow k={t("Fənn kodu", "Subject code")} v={subjectCode} />
                  <InfoRow k={t("Kredit", "Credits")} v={subject?.credit ?? "—"} />
                  <InfoRow k={t("Saat / həftə", "Hours / week")} v={subject?.hours_per_week ?? "—"} />
                  <InfoRow k={t("Semestr", "Semester")} v={label(SEMESTER_LABEL, subject?.semester)} />
                  <InfoRow k={t("Tədris ili", "Year")} v={subject?.year ?? "—"} />
                  <InfoRow k={t("Fənnin tipi", "Subject type")} v={label(STATUS_LABEL, subject?.status)} />
                  <InfoRow
                    k={t("Təhsil forması", "Form of education")}
                    v={formOfEducationLabel(subject?.form_of_education, locale)}
                  />
                  <InfoRow
                    k={t("Tədris dili", "Language of instruction")}
                    v={languageLabel(subject?.language_of_instruction, locale)}
                  />
                  {subject?.in_class_hours && (
                    <InfoRow
                      k={t("Auditoriyadaxili saatlar", "In-class hours")}
                      v={<span className="whitespace-pre-line">{subject.in_class_hours}</span>}
                    />
                  )}
                </div>
              </SectionCard>

              {/* Teaching methods */}
              {parseTeachingMethods(subject?.teaching_methods).length > 0 && (
                <SectionCard title={t("Tədris metodları", "Teaching methods")}>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {parseTeachingMethods(subject?.teaching_methods).map((k) => (
                      <li key={k} className="flex items-center gap-2 text-[14px] text-gray-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#182f79]" />
                        {teachingMethodLabel(k, locale)}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {/* Description */}
              {subject?.subject_description && (
                <SectionCard title={t("Fənn haqqında", "About the subject")}>
                  <p className="whitespace-pre-line text-[14px] leading-relaxed text-gray-700">
                    {subject.subject_description}
                  </p>
                </SectionCard>
              )}

              {/* CLOs */}
              <SectionCard title={t("Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)")}>
                {clos.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("Təlim nəticəsi əlavə edilməyib.", "No learning outcomes added.")}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {clos.map((clo, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#182f79]/10 text-[11px] font-bold text-[#182f79]">
                          {i + 1}
                        </span>
                        <p className="text-[14px] leading-relaxed text-gray-700">{clo.clo_content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              {/* Topic plan with TLOs */}
              <SectionCard title={t("Mövzu planı", "Topic plan")}>
                {topics.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("Mövzu əlavə edilməyib.", "No topics added.")}
                  </p>
                ) : (
                  <ol className="space-y-4">
                    {topics.map((topic, i) => (
                      <li key={topic.topic_code} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[13px] font-bold text-[#182f79]">{i + 1}.</span>
                          <span className="text-[14px] font-semibold text-gray-900">{topic.topic_name}</span>
                          <span className="text-[11px] font-medium text-gray-400">
                            {label(TYPE_LABEL, topic.topic_type)}
                          </span>
                        </div>
                        {topic.topic_desc && (
                          <p className="mt-1 pl-5 text-[13px] leading-relaxed text-gray-600">{topic.topic_desc}</p>
                        )}
                        {topic.tlos.length > 0 && (
                          <div className="mt-2 pl-5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              {t("Təlim nəticələri", "Learning outcomes")}
                            </p>
                            <ul className="mt-1 list-disc pl-5 text-[13px] text-gray-600">
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
              </SectionCard>

              {/* Literature */}
              <SectionCard title={t("Ədəbiyyat", "Literature")}>
                {literatures.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("Ədəbiyyat əlavə edilməyib.", "No literature added.")}
                  </p>
                ) : (
                  <ul className="list-decimal space-y-1.5 pl-5 text-[14px] text-gray-700">
                    {literatures.map((lit) => (
                      <li key={lit.id}>
                        {lit.url ? (
                          <a href={lit.url} target="_blank" rel="noreferrer" className="text-[#182f79] hover:underline">
                            {lit.literature_name}
                          </a>
                        ) : (
                          lit.literature_name
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              {/* Assessment */}
              {subject?.assessment && subject.assessment.length > 0 && (
                <SectionCard title={t("Qiymətləndirmə haqqında məlumat", "Assessment")}>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full border-collapse text-[13px]">
                      <thead>
                        <tr className="bg-gray-50 text-left text-[12px] font-semibold text-gray-600">
                          <th className="border-b border-gray-100 px-3 py-2">{t("Qiymətləndirmə forması", "Form")}</th>
                          <th className="border-b border-gray-100 px-3 py-2">{t("Açıqlama", "Description")}</th>
                          <th className="border-b border-gray-100 px-3 py-2 whitespace-nowrap">{t("Bal", "Score")}</th>
                          <th className="border-b border-gray-100 px-3 py-2 whitespace-nowrap">{t("Uyğun FTN", "Related CLO")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subject.assessment.map((row, i) => (
                          <tr key={i} className="align-top">
                            <td className="border-b border-gray-100 px-3 py-2 font-medium text-gray-800">{row.form}</td>
                            <td className="border-b border-gray-100 px-3 py-2 text-gray-600">{row.description}</td>
                            <td className="border-b border-gray-100 px-3 py-2 whitespace-nowrap text-gray-700">{row.score}</td>
                            <td className="border-b border-gray-100 px-3 py-2 whitespace-nowrap text-gray-700">{row.ftn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
