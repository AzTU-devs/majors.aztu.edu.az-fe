"use client";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getPloBySpecialty, PloInterface } from "@/services/plo/ploService";

export type Locale = "az" | "en";

export default function Plo({ specialtyCode }: { specialtyCode: string }) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [plos, setPlos] = useState<PloInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPloBySpecialty(specialtyCode, locale)
      .then((res: any) => {
        if (cancelled) return;
        setPlos(Array.isArray(res) ? res : []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  const subtitle = locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes";

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="program-learning-outcomes" subtitle={subtitle}>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={56} className="mt-2 rounded" />
            </div>
          ))}
        </div>
      ) : plos.length === 0 ? (
        <EmptyState message={locale === "az" ? "PLO əlavə edilməyib." : "No PLO has been added."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plos.map((p, idx) => (
            <article
              key={p.id ?? idx}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#182f79] to-[#3b4fc2]" />
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#182f79]/10 text-sm font-bold text-[#182f79]">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#182f79]/70">
                    {p.plo_code}
                  </p>
                  <p className="mt-1 text-base leading-relaxed text-gray-800">
                    {p.plo_content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </SpecialtyShell>
  );
}
