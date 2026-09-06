"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { degreeListPath, programmePath } from "@/lib/routes";
import PageHero from "@/components/ui/PageHero";
import { Badge, CodeChip, Container, cx } from "@/components/ui/primitives";

/** Sections of a programme, in the order they appear in the tab strip. */
export const PROGRAMME_SECTIONS = [
  { slug: "", az: "Ümumi məlumat", en: "Overview" },
  { slug: "program-learning-outcomes", az: "Təlim məqsədləri", en: "Learning outcomes" },
  { slug: "subjects", az: "Tədris planı", en: "Curriculum" },
  { slug: "clo", az: "Fənn nəticələri", en: "Course outcomes" },
  { slug: "competency", az: "Səriştələr", en: "Competencies" },
  { slug: "competency-match-table", az: "Səriştə matrisi", en: "Competency matrix" },
  { slug: "graduate-career-opportunities", az: "Karyera imkanları", en: "Career paths" },
] as const;

export type ProgrammeSection = (typeof PROGRAMME_SECTIONS)[number]["slug"];

/**
 * Frame shared by every programme page: the navy masthead plus the sticky tab
 * strip. Rendering it from the route layout — rather than from each content
 * component — is what keeps the navigation present and identical on all of
 * them.
 */
export default function ProgrammeShell({
  locale,
  specialtyCode,
  specialtyName,
  degree,
  children,
}: {
  locale: Locale;
  specialtyCode: string;
  specialtyName: string;
  degree: 1 | 2;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const base = programmePath(locale, specialtyCode);
  const az = locale === "az";

  // A single subject renders its own masthead and tabs (SubjectShell). Next
  // nests this layout around those routes, so without this the page showed two
  // stacked heroes and two tab strips.
  // Segment-based so it holds for codes that percent-encode (e.g. "6005009 (050509)").
  const segments = pathname.split("/").filter(Boolean);
  const subjectsAt = segments.indexOf("subjects");
  const isSubjectPage = subjectsAt !== -1 && segments.length > subjectsAt + 1;
  if (isSubjectPage) {
    return <>{children}</>;
  }

  const degreeLabel = degree === 2 ? tr(locale, "Magistr", "Master") : tr(locale, "Bakalavr", "Bachelor");

  const activeSlug = (() => {
    // Longest matching section wins, so /subjects/ABC still highlights
    // "Curriculum" rather than falling back to Overview.
    const rest = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\//, "") : "";
    if (!rest) return "";
    const match = PROGRAMME_SECTIONS.filter((s) => s.slug && rest.startsWith(s.slug)).sort(
      (a, b) => b.slug.length - a.slug.length
    )[0];
    return match?.slug ?? "";
  })();

  return (
    <>
      <PageHero
        tone="brand"
        eyebrow={az ? `${degreeLabel} ixtisası` : `${degreeLabel}'s programme`}
        title={specialtyName}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: degreeLabel, href: degreeListPath(locale, degree) },
          { label: specialtyName },
        ]}
        meta={
          <>
            <Badge tone="accent" className="border-white/25 bg-white/10 text-white">
              {degreeLabel}
            </Badge>
            <CodeChip className="border-white/20 bg-white/10 text-white/90">{specialtyCode}</CodeChip>
            <Badge tone="outline" className="border-white/20 text-white/70">
              {degree === 2 ? tr(locale, "2 il", "2 years") : tr(locale, "4 il", "4 years")}
            </Badge>
          </>
        }
      />

      {/* Sticky section tabs. `top` clears the 71px site header. */}
      <div className="sticky top-[71px] z-30 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-xl no-print">
        <Container>
          <nav aria-label={az ? "İxtisas bölmələri" : "Programme sections"} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2.5">
            {PROGRAMME_SECTIONS.map((section) => {
              const href = programmePath(locale, specialtyCode, section.slug);
              const active = activeSlug === section.slug;
              return (
                <Link
                  key={section.slug || "overview"}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                    active
                      ? "bg-[var(--brand)] text-white shadow-sm dark:text-[#0a0f2b]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-strong)]"
                  )}
                >
                  {az ? section.az : section.en}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      <Container className="py-10 md:py-14">{children}</Container>
    </>
  );
}
