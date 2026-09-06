"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/site";
import { programmePath, subjectPath } from "@/lib/routes";
import PageHero from "@/components/ui/PageHero";
import { CodeChip, Container, cx } from "@/components/ui/primitives";

export const SUBJECT_SECTIONS = [
  { slug: "", az: "Ümumi məlumat", en: "Overview" },
  { slug: "syllabus", az: "Sillabus", en: "Syllabus" },
  { slug: "topics", az: "Mövzu planı", en: "Topics" },
  { slug: "clo-plo-match-table", az: "CLO↔PLO matrisi", en: "CLO↔PLO matrix" },
] as const;

/** Frame shared by every page of a single subject. */
export default function SubjectShell({
  locale,
  specialtyCode,
  specialtyName,
  subjectCode,
  subjectName,
  children,
}: {
  locale: Locale;
  specialtyCode: string;
  specialtyName: string;
  subjectCode: string;
  subjectName: string;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const base = subjectPath(locale, specialtyCode, subjectCode);
  const az = locale === "az";

  const activeSlug = (() => {
    const rest = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\//, "") : "";
    if (!rest) return "";
    const match = SUBJECT_SECTIONS.filter((s) => s.slug && rest.startsWith(s.slug)).sort(
      (a, b) => b.slug.length - a.slug.length
    )[0];
    return match?.slug ?? "";
  })();

  return (
    <>
      <PageHero
        tone="brand"
        eyebrow={az ? "Fənn" : "Subject"}
        title={subjectName}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: specialtyName, href: programmePath(locale, specialtyCode) },
          {
            label: az ? "Tədris planı" : "Curriculum",
            href: programmePath(locale, specialtyCode, "subjects"),
          },
          { label: subjectName },
        ]}
        meta={<CodeChip className="border-white/20 bg-white/10 text-white/90">{subjectCode}</CodeChip>}
      />

      <div className="sticky top-[71px] z-30 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-xl no-print">
        <Container>
          <nav aria-label={az ? "Fənn bölmələri" : "Subject sections"} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2.5">
            {SUBJECT_SECTIONS.map((section) => {
              const href = subjectPath(locale, specialtyCode, subjectCode, section.slug);
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

      <Container width="narrow" className="py-10 md:py-14">
        {children}
      </Container>
    </>
  );
}
