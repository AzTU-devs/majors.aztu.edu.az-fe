"use client";

import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export type SectionKey =
  | "overview"
  | "program-learning-outcomes"
  | "student-learning-outcomes"
  | "graduate-career-opportunities"
  | "competency"
  | "subjects"
  | "clo";

const NAV: { key: SectionKey; href: string; az: string; en: string }[] = [
  { key: "overview", href: "", az: "Ümumi məlumat", en: "Overview" },
  { key: "program-learning-outcomes", href: "program-learning-outcomes", az: "Proqram Təlim Məqsədləri", en: "Program Learning Outcomes" },
  { key: "student-learning-outcomes", href: "student-learning-outcomes", az: "Tələbə Təlim Nəticələri", en: "Student Learning Outcomes" },
  { key: "graduate-career-opportunities", href: "graduate-career-opportunities", az: "Karyera İmkanları", en: "Career Opportunities" },
  { key: "competency", href: "competency", az: "Səriştələr", en: "Competencies" },
  { key: "subjects", href: "subjects", az: "Kurrikulum", en: "Curriculum" },
  { key: "clo", href: "clo", az: "Təlim Nəticələri", en: "Course Outcomes" },
];

interface Props {
  specialtyCode: string;
  active: SectionKey;
  children: ReactNode;
  /** subtitle shown above body (e.g. section title) */
  subtitle?: string;
}

export default function SpecialtyShell({ specialtyCode, active, children, subtitle }: Props) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const pathname = usePathname();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSpecialtyDetails(specialtyCode, locale)
      .then((res) => setName(typeof res === "string" ? res : ""))
      .finally(() => setLoading(false));
  }, [specialtyCode, locale]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#182f79]/5 blur-3xl dark:bg-blue-500/10" />

        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16 lg:px-10">
          <span className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#2563eb] dark:text-blue-400">
            {locale === "az" ? "Bakalavr ixtisası" : "Bachelor specialty"}
          </span>

          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#0E205B] dark:text-white md:text-[40px]">
            {loading ? (
              <span className="inline-block">
                <Skeleton variant="text" width={420} height={44} sx={{ bgcolor: "rgba(148,163,184,.2)" }} />
              </span>
            ) : (
              name || (locale === "az" ? "İxtisas" : "Specialty")
            )}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-[#182f79] dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300">
              {specialtyCode}
            </span>
            {subtitle && (
              <>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{subtitle}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky tab nav */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white/85 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85">
        <nav className="no-scrollbar mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 lg:px-10">
          {NAV.map((item) => {
            const href = `/${locale}/bachelor/specialty-details/${specialtyCode}${item.href ? `/${item.href}` : ""}`;
            const isActive =
              item.key === active ||
              (item.key !== "overview" && pathname?.endsWith(`/${item.href}`));
            return (
              <Link
                key={item.key}
                href={href}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#182f79] text-white shadow-sm dark:bg-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                {locale === "az" ? item.az : item.en}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">{children}</div>
    </div>
  );
}
