"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { RootState } from "@/redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getSubjectDetails, SubjectDetails } from "@/services/curricula/curricula";
import { getCloBySubjectCode, Clo } from "@/services/clo/clo";

export type Locale = "az" | "en";

const SEMESTER_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Yaz", en: "Spring" },
  2: { az: "Payız", en: "Autumn" },
};

const STATUS_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Seçim", en: "Elective" },
  2: { az: "Məcburi", en: "Mandatory" },
  3: { az: "Digər", en: "Other" },
};

export default function SubjectDetailPage() {
  const params = useParams<{ specialtyCode: string; subjectCode: string }>();
  const locale: Locale = useSelector((s: RootState) => s.locale.value);

  const specialtyCode = decodeURIComponent(
    Array.isArray(params.specialtyCode) ? params.specialtyCode[0] : params.specialtyCode || ""
  );
  const subjectCode = decodeURIComponent(
    Array.isArray(params.subjectCode) ? params.subjectCode[0] : params.subjectCode || ""
  );

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [clos, setClos] = useState<Clo[]>([]);
  const [loading, setLoading] = useState(true);
  const [closLoading, setClosLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSubjectDetails(subjectCode, locale)
      .then((res: any) => {
        if (cancelled) return;
        if (res && typeof res === "object") {
          setSubject(res as SubjectDetails);
        } else {
          setSubject(null);
        }
      })
      .finally(() => !cancelled && setLoading(false));

    setClosLoading(true);
    getCloBySubjectCode(subjectCode, locale)
      .then((res) => {
        if (cancelled) return;
        setClos(Array.isArray(res) ? res : []);
      })
      .finally(() => !cancelled && setClosLoading(false));

    return () => {
      cancelled = true;
    };
  }, [subjectCode, locale]);

  const subBase = `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subjectCode}`;
  const t = (az: string, en: string) => (locale === "az" ? az : en);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f5f7ff] via-white to-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#182f79] via-[#1f3a96] to-[#3b4fc2] text-white">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
            <Link
              href={`/${locale}/bachelor/specialty-details/${specialtyCode}/subjects`}
              className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white"
            >
              ← {t("Bütün fənlər", "All subjects")}
            </Link>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {loading ? (
                <Skeleton variant="text" width={400} height={44} sx={{ bgcolor: "rgba(255,255,255,.18)" }} />
              ) : (
                subject?.subject_name || t("Fənn", "Subject")
              )}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="rounded-lg bg-white/15 px-3 py-1 font-mono text-xs ring-1 ring-white/20">
                {subjectCode}
              </span>
              {subject && (
                <>
                  <span className="text-white/40">/</span>
                  <span>
                    {STATUS_LABEL[subject.status]?.[locale] ?? "—"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14 space-y-8">
          {/* Subject info grid */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(loading ? [0, 1, 2, 3] : [
              { label: t("Kredit", "Credits"), value: subject?.credit ?? "—" },
              { label: t("Tələbənin iş yükü", "Student workload"), value: subject?.hours_per_week ?? "—" },
              { label: t("Semestr", "Semester"), value: subject ? SEMESTER_LABEL[subject.semester]?.[locale] ?? subject.semester : "—" },
              { label: t("Tədris ili", "Year"), value: subject?.year ?? "—" },
            ]).map((stat: any, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                {loading ? (
                  <>
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={28} />
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </>
                )}
              </div>
            ))}
          </section>

          {/* Syllabus call-to-action */}
          <Link
            href={`${subBase}/syllabus`}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[#182f79]/15 bg-gradient-to-r from-[#182f79] to-[#3b4fc2] p-6 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <DescriptionIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="text-base font-semibold">{t("Fənnin sillabusu", "Subject syllabus")}</p>
                <p className="text-sm text-white/80">
                  {t(
                    "Tam sillabusa baxın: təlim nəticələri, mövzu planı və ədəbiyyat",
                    "View the full syllabus: outcomes, topic plan and literature"
                  )}
                </p>
              </div>
            </div>
            <ArrowForwardIcon className="transition group-hover:translate-x-1" sx={{ fontSize: 22 }} />
          </Link>

          {/* Description */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("Fənn haqqında", "About the subject")}
            </h2>
            {loading ? (
              <div className="mt-3 space-y-2">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
              </div>
            ) : subject?.subject_description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {subject.subject_description}
              </p>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                {t("Bu fənn üçün təsvir əlavə edilməyib.", "No description available for this subject.")}
              </p>
            )}
          </section>

          {/* Course Learning Outcomes */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)")}
            </h2>
            {closLoading ? (
              <div className="mt-3 space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={48} className="rounded-lg" />
                ))}
              </div>
            ) : clos.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                {t("Hələ təlim nəticəsi əlavə edilməyib.", "No learning outcomes added yet.")}
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {clos.map((clo, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#182f79]/10 text-xs font-bold text-[#182f79]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700">{clo.clo_content}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Sub-route navigation */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("Daha çox", "More")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href={`${subBase}/topics`}
                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#182f79]/8 text-[#182f79]">
                    <ListAltIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t("Mövzular", "Topics")}</p>
                    <p className="text-xs text-gray-500">{t("Fənn üzrə bütün mövzular", "All topics for this subject")}</p>
                  </div>
                </div>
                <ArrowForwardIcon className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#182f79]" sx={{ fontSize: 20 }} />
              </Link>

              <Link
                href={`${subBase}/subject-match-table`}
                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#182f79]/8 text-[#182f79]">
                    <TableChartIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t("Uyğunluq cədvəli", "Match table")}</p>
                    <p className="text-xs text-gray-500">{t("Fənn-PLO uyğunluğu", "Subject-PLO matching")}</p>
                  </div>
                </div>
                <ArrowForwardIcon className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#182f79]" sx={{ fontSize: 20 }} />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
