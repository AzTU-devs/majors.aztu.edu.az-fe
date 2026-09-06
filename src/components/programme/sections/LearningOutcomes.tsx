"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getPloBySpecialty, type PloInterface } from "@/services/plo/ploService";
import { Card, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";

export default function LearningOutcomes({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [plos, setPlos] = useState<PloInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPloBySpecialty(specialtyCode, locale)
      .then((res) => !cancelled && setPlos(res))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "PLO", "PLO")}
        title={tr(locale, "Proqram təlim məqsədləri", "Programme learning outcomes")}
        subtitle={tr(
          locale,
          "Məzunun proqramı bitirdikdə nümayiş etdirməli olduğu bilik və bacarıqlar.",
          "What a graduate is expected to know and be able to do on completing the programme."
        )}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : plos.length === 0 ? (
        <EmptyState
          message={tr(
            locale,
            "Bu ixtisas üçün proqram təlim məqsədləri hələ əlavə edilməyib.",
            "No programme learning outcomes have been published for this programme yet."
          )}
        />
      ) : (
        <ol className="grid gap-4 md:grid-cols-2">
          {plos.map((p, idx) => (
            <li key={p.id ?? p.plo_code ?? idx}>
              <Card className="relative h-full overflow-hidden p-6">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 to-sky-brand-400" />
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-tint)] text-[13px] font-extrabold text-[var(--brand-accent)]">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {p.plo_code}
                    </p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--text-body)]">
                      {p.plo_content}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
