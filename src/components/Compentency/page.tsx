"use client";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import EmptyState from "@/components/specialtyDetails/EmptyState";
import { getCompetencyBySpecialty, Competency } from "@/services/competency/competencyService";

export type Locale = "az" | "en";

export default function CompetencyPage({ specialtyCode }: { specialtyCode: string }) {
  const locale: Locale = useSelector((s: RootState) => s.locale.value);
  const [items, setItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCompetencyBySpecialty(specialtyCode, locale)
      .then((res: any) => {
        if (cancelled) return;
        setItems(Array.isArray(res) ? res : []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [specialtyCode, locale]);

  const subtitle = locale === "az" ? "Səriştələr" : "Competencies";

  const groups = [
    { type: 1, az: "Peşə Səriştələri", en: "Job Competencies" },
    { type: 2, az: "İxtisas Səriştələri", en: "Specialty Competencies" },
  ];

  const renderCard = (c: Competency, idx: number) => (
    <div
      key={c.id ?? idx}
      className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#182f79]/10 text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
        <EmojiObjectsOutlinedIcon fontSize="small" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#182f79]/70 dark:text-blue-300/70">
          {c.competency_code}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-gray-800 dark:text-slate-200">
          {c.competency_content}
        </p>
      </div>
    </div>
  );

  return (
    <SpecialtyShell specialtyCode={specialtyCode} active="competency" subtitle={subtitle}>
      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0,1,2,3].map(i => <Skeleton key={i} variant="rectangular" height={92} className="rounded-2xl" sx={{ bgcolor: "rgba(148,163,184,.2)" }} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={locale === "az" ? "Səriştə əlavə edilməyib." : "No competencies yet."} />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const groupItems = items.filter((c) => (c.competency_type ?? 2) === group.type);
            if (groupItems.length === 0) return null;
            return (
              <section key={group.type}>
                <h3 className="mb-3 text-base font-semibold text-[#182f79] dark:text-blue-300">
                  {locale === "az" ? group.az : group.en}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {groupItems.map((c, idx) => renderCard(c, idx))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </SpecialtyShell>
  );
}
