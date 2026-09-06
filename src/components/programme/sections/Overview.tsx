"use client";

import { useEffect, useState } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { getSpecialtyChar, type SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";
import { Card, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";

export default function Overview({
  locale,
  specialtyCode,
}: {
  locale: Locale;
  specialtyCode: string;
}) {
  const [chars, setChars] = useState<SpecialtyChar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSpecialtyChar(specialtyCode, locale)
      .then((res) => {
        if (!cancelled) setChars(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [specialtyCode, locale]);

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i} className="p-7">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-4 h-32 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (!chars) {
    return (
      <EmptyState
        title={tr(locale, "Məlumat hazırlanır", "Details coming soon")}
        message={tr(
          locale,
          "Bu ixtisas üçün ümumi məlumat hələ əlavə edilməyib. Tədris planı və təlim nəticələri bölmələrinə baxa bilərsiniz.",
          "An overview has not been published for this programme yet. The curriculum and learning outcomes sections may already have content."
        )}
      />
    );
  }

  const requirements = Array.isArray(chars.degree_requirements)
    ? chars.degree_requirements.join("\n")
    : chars.degree_requirements;

  const panels = [
    {
      title: tr(locale, "Proqramın təsviri", "Programme description"),
      body: chars.program_desc,
    },
    {
      title: tr(locale, "Dərəcə tələbləri", "Degree requirements"),
      body: requirements,
    },
  ].filter((p) => p.body);

  if (panels.length === 0) {
    return (
      <EmptyState
        message={tr(
          locale,
          "Bu ixtisas üçün ümumi məlumat hələ əlavə edilməyib.",
          "An overview has not been published for this programme yet."
        )}
      />
    );
  }

  return (
    <>
      <SectionHeading
        as="h2"
        eyebrow={tr(locale, "Ümumi məlumat", "Overview")}
        title={tr(locale, "Proqram haqqında", "About the programme")}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((panel) => (
          <Card key={panel.title} className="relative overflow-hidden p-7">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-700 to-sky-brand-400" />
            <h3 className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
              {panel.title}
            </h3>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[var(--text-body)]">
              {panel.body}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
