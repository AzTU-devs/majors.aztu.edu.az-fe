"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getGcosBySpecailty, type Gco } from "@/services/gco/gcoService";
import { Card, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";

const BriefcaseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
    <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3 12.5h18" strokeLinecap="round" />
  </svg>
);

export default function CareerPaths({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [items, setItems] = useState<Gco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGcosBySpecailty(specialtyCode, locale)
      .then((res) => !cancelled && setItems(res))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Karyera", "Careers")}
        title={tr(locale, "Məzun karyera imkanları", "Graduate career paths")}
        subtitle={tr(
          locale,
          "Bu proqramın məzunlarının çalışa biləcəyi sahələr və vəzifələr.",
          "The fields and roles graduates of this programme go on to work in."
        )}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BriefcaseIcon}
          message={tr(
            locale,
            "Bu ixtisas üçün karyera imkanları hələ əlavə edilməyib.",
            "No career paths have been published for this programme yet."
          )}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((g, idx) => (
            <Card key={g.id ?? g.career_code ?? idx} className="relative overflow-hidden p-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 to-sky-brand-400" />
              <div className="flex items-center gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                  {BriefcaseIcon}
                </span>
                <h3 className="text-[16px] font-bold">{g.career_title}</h3>
              </div>
              {g.career_content && (
                <p className="mt-3.5 text-[14px] leading-relaxed text-[var(--text-muted)]">
                  {g.career_content}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
