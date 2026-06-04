"use client";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getSloBySpecialty, Slo as SloT } from "@/services/slo/sloService";

export type Locale = "az" | "en";

export default function Slo({ specialtyCode }: { specialtyCode: string }) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [items, setItems] = useState<SloT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSloBySpecialty(specialtyCode, locale)
      .then((res: any) => {
        if (cancelled) return;
        setItems(Array.isArray(res) ? res : []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  const subtitle = locale === "az" ? "Tələbə Təlim Nəticələri" : "Student Learning Outcomes";

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="student-learning-outcomes" subtitle={subtitle}>
      {loading ? (
        <div className="space-y-3">
          {[0,1,2].map(i => <Skeleton key={i} variant="rectangular" height={80} className="rounded-2xl" sx={{ bgcolor: "rgba(148,163,184,.2)" }} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={locale === "az" ? "SLO əlavə edilməyib." : "No SLO has been added."} />
      ) : (
        <ol className="space-y-3">
          {items.map((s, idx) => (
            <li
              key={s.id ?? idx}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-[#182f79]/10 text-sm font-bold text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                {idx + 1}
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#182f79]/70 dark:text-blue-300/70">
                  {s.slo_code}
                </p>
                <p className="mt-1 text-base leading-relaxed text-gray-800 dark:text-slate-200">
                  {s.slo_content}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SpecialtyShell>
  );
}
