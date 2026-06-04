"use client";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getGcosBySpecailty, Gco as GcoT } from "@/services/gco/gcoService";

export type Locale = "az" | "en";

export default function Gco({ specialtyCode }: { specialtyCode: string }) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [items, setItems] = useState<GcoT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGcosBySpecailty(specialtyCode, locale)
      .then((res: any) => {
        if (cancelled) return;
        setItems(Array.isArray(res) ? res : []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  const subtitle = locale === "az" ? "Karyera İmkanları" : "Career Opportunities";

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="graduate-career-opportunities" subtitle={subtitle}>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0,1,2,3].map(i => <Skeleton key={i} variant="rectangular" height={140} className="rounded-2xl" sx={{ bgcolor: "rgba(148,163,184,.2)" }} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={locale === "az" ? "Karyera imkanı əlavə edilməyib." : "No career opportunities yet."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((g, idx) => (
            <article
              key={g.id ?? idx}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182f79] to-[#3b4fc2]" />
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#182f79]/10 text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                  <WorkOutlineIcon fontSize="small" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-slate-200">
                  {g.career_title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {g.career_content}
              </p>
            </article>
          ))}
        </div>
      )}
    </SpecialtyShell>
  );
}
