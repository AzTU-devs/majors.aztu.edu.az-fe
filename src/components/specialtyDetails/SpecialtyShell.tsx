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
    <div className="bg-gradient-to-b from-[#f5f7ff] via-white to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#182f79] via-[#1f3a96] to-[#3b4fc2] text-white">
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-12 lg:py-16 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 ring-1 ring-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {locale === "az" ? "Bakalavr ixtisası" : "Bachelor specialty"}
          </span>

          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {loading ? (
              <span className="inline-block">
                <Skeleton variant="text" width={420} height={44} sx={{ bgcolor: "rgba(255,255,255,.18)" }} />
              </span>
            ) : (
              name || (locale === "az" ? "İxtisas" : "Specialty")
            )}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="rounded-lg bg-white/15 px-3 py-1 font-mono text-xs ring-1 ring-white/20">
              {specialtyCode}
            </span>
            {subtitle && (
              <>
                <span className="text-white/40">/</span>
                <span className="font-medium text-white/95">{subtitle}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky tab nav */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 lg:px-10">
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
                    ? "bg-[#182f79] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
