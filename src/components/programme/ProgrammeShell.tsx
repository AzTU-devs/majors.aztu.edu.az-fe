import Link from "next/link";
import type { ReactNode } from "react";

import PageHero from "@/components/ui/PageHero";
import SectionNav, { SectionTitle } from "@/components/ui/SectionNav";
import { IconBuilding, IconCap, IconLayers, IconUsers } from "@/components/ui/icons";
import { CodePill, Pill } from "@/components/ui/primitives";
import { tr } from "@/lib/i18n";
import type { FacultyStyle } from "@/lib/hues";
import { degreeListPath, facultyPath, programmePath } from "@/lib/routes";
import { PROGRAMME_SECTIONS, countLabel, degreeLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";

/**
 * Frame shared by every programme tab: the hero row (breadcrumbs, the page's
 * h1, meta pills) and the sticky tab strip. Rendered from the route layout
 * so the navigation is present and identical on all tabs.
 */
export default function ProgrammeShell({
  locale,
  specialtyKey,
  specialtyCode,
  specialtyName,
  degree,
  facts,
  subjectCount,
  untranslated,
  children,
}: {
  locale: Locale;
  /** Identifies the programme in links. */
  specialtyKey: string;
  /** Display-only; not unique. */
  specialtyCode: string;
  specialtyName: string;
  degree: 1 | 2;
  facts: { cafedra: string | null; facultyCode: string | null; facultyName: string | null; style: FacultyStyle };
  subjectCount: number | null;
  /** The name is the Azerbaijani fallback shown on an English page. */
  untranslated: boolean;
  children: ReactNode;
}) {
  const base = programmePath(locale, specialtyKey);
  const sections = PROGRAMME_SECTIONS.map((s) => ({ slug: s.slug, label: s[locale] }));
  const hrefFor = Object.fromEntries(PROGRAMME_SECTIONS.map((s) => [s.slug, programmePath(locale, specialtyKey, s.slug)]));

  return (
    <>
      <PageHero
        locale={locale}
        hue={facts.style.hue}
        crumbs={[
          { label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` },
          { label: degreeLabel(degree, locale), href: degreeListPath(locale, degree) },
          { label: specialtyName },
        ]}
        kicker={degreeLabel(degree, locale, "programme")}
        heading={
          <SectionTitle name={specialtyName} base={base} sections={sections} lang={untranslated ? "az" : undefined} />
        }
        art={facts.style.art}
        meta={
          <>
            <Pill tone="k0">
              <IconCap />
              {degreeLabel(degree, locale)}
            </Pill>
            {specialtyCode && <CodePill tone="k0">{specialtyCode}</CodePill>}
            {facts.facultyCode && facts.facultyName && (
              <Link href={facultyPath(locale, facts.facultyCode)} className="pill pill-k0 hover:underline">
                <IconBuilding />
                {facts.facultyName}
              </Link>
            )}
            {facts.cafedra && (
              <Pill tone="k0">
                <IconUsers />
                {facts.cafedra}
              </Pill>
            )}
            {subjectCount !== null && subjectCount > 0 && (
              <Pill tone="k0">
                <IconLayers />
                {countLabel(subjectCount, locale, "subject")}
              </Pill>
            )}
          </>
        }
      />

      <SectionNav
        label={tr(locale, "İxtisas bölmələri", "Programme sections")}
        base={base}
        sections={sections}
        hrefFor={hrefFor}
      />

      <div className={`${facts.style.hue} wrap py-10 md:py-14`}>{children}</div>
    </>
  );
}
