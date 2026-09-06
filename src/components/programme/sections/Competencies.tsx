"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getCompetencyBySpecialty, type Competency } from "@/services/competency/competencyService";
import { Card, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";

const BulbIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <path d="M9 18h6M10 21h4" strokeLinecap="round" />
    <path d="M12 3a6 6 0 00-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0012 3z" strokeLinejoin="round" />
  </svg>
);

/** competency_type: 1 = job/professional, 2 = specialty/general. */
const GROUPS = [
  { type: 1, az: "Peşə səriştələri", en: "Professional competencies" },
  { type: 2, az: "İxtisas səriştələri", en: "Specialty competencies" },
] as const;

export default function Competencies({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [items, setItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCompetencyBySpecialty(specialtyCode, locale)
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
        eyebrow={tr(locale, "Səriştələr", "Competencies")}
        title={tr(locale, "Proqram səriştələri", "Programme competencies")}
        subtitle={tr(
          locale,
          "Məzunun əldə etdiyi peşə və ixtisas səriştələri.",
          "The professional and specialty competencies a graduate acquires."
        )}
      />

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BulbIcon}
          message={tr(
            locale,
            "Bu ixtisas üçün səriştələr hələ əlavə edilməyib.",
            "No competencies have been published for this programme yet."
          )}
        />
      ) : (
        <div className="space-y-10">
          {GROUPS.map((group) => {
            const groupItems = items.filter((c) => (c.competency_type ?? 2) === group.type);
            if (groupItems.length === 0) return null;
            return (
              <section key={group.type}>
                <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold text-[var(--text-strong)]">
                  <span className="h-4 w-1 rounded-full bg-[var(--brand-accent)]" aria-hidden />
                  {tr(locale, group.az, group.en)}
                  <span className="text-[13px] font-semibold text-[var(--text-muted)]">
                    ({groupItems.length})
                  </span>
                </h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {groupItems.map((c, idx) => (
                    <li key={c.id ?? c.competency_code ?? idx}>
                      <Card className="flex h-full items-start gap-4 p-5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                          {BulbIcon}
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            {c.competency_code}
                          </p>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-body)]">
                            {c.competency_content}
                          </p>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
