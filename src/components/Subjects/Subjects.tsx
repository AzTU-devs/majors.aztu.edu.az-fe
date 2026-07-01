"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getCurriculaBySpecialtyCode, Subject } from "@/services/curricula/curricula";

export type Locale = "az" | "en";

const SEMESTER_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Payız", en: "Autumn" },
  2: { az: "Yaz", en: "Spring" },
};

const STATUS_LABEL: Record<number, { az: string; en: string }> = {
  1: { az: "Seçim", en: "Elective" },
  2: { az: "Məcburi", en: "Mandatory" },
  3: { az: "Digər", en: "Other" },
};

export default function Subjects({ specialtyCode }: { specialtyCode: string }) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCurriculaBySpecialtyCode(specialtyCode, 0, 100, locale).then((res: any) => {
      if (cancelled) return;
      if (typeof res === "object" && Array.isArray(res?.subjects)) {
        setItems(res.subjects);
      } else {
        setItems([]);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  const subtitle = locale === "az" ? "Kurrikulum" : "Curriculum";

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="subjects" subtitle={subtitle}>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0,1,2,3,4,5].map(i => <Skeleton key={i} variant="rectangular" height={160} className="rounded-2xl" sx={{ bgcolor: "rgba(148,163,184,.2)" }} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={locale === "az" ? "Fənn əlavə edilməyib." : "No subjects yet."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((sub) => (
            <Link
              key={sub.subject_code}
              href={`/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${sub.subject_code}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182f79] to-[#3b4fc2]" />
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-[11px] font-medium text-gray-600 dark:bg-slate-700 dark:text-slate-400">
                  {sub.subject_code}
                </span>
                <span className="rounded-full bg-[#182f79]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                  {STATUS_LABEL[sub.status]?.[locale] ?? "—"}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-gray-900 dark:text-slate-200">
                {sub.subject_name}
              </h3>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-gray-500 dark:text-slate-400">
                <div>
                  <dt className="font-medium uppercase tracking-wide">{locale === "az" ? "Kredit" : "Credits"}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-slate-200">{sub.credit}</dd>
                </div>
                <div>
                  <dt className="font-medium uppercase tracking-wide">{locale === "az" ? "Tələbənin iş yükü" : "Student workload"}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-slate-200">{sub.hours_per_week}</dd>
                </div>
                <div>
                  <dt className="font-medium uppercase tracking-wide">{locale === "az" ? "Semestr" : "Term"}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-slate-200">
                    {SEMESTER_LABEL[sub.semester]?.[locale] ?? sub.semester}
                  </dd>
                </div>
              </dl>

              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#182f79] transition-all group-hover:gap-2 dark:text-blue-300">
                {locale === "az" ? "Ətraflı bax" : "View details"}
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </SpecialtyShell>
  );
}
