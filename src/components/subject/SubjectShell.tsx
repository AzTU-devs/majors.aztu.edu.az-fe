import Link from "next/link";
import type { ReactNode } from "react";

import PageHero from "@/components/ui/PageHero";
import SectionNav, { SectionTitle } from "@/components/ui/SectionNav";
import { IconCalendar, IconCap, IconClock, IconLayers } from "@/components/ui/icons";
import { CodePill, Pill } from "@/components/ui/primitives";
import { semesterLongLabel, statusLabel } from "@/constants/subjectMeta";
import type { FacultyStyle } from "@/lib/hues";
import { tr } from "@/lib/i18n";
import { degreeListPath, programmePath, subjectPath } from "@/lib/routes";
import { SUBJECT_SECTIONS, degreeLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";
import type { SubjectDetails } from "@/services/curricula/curricula";

/** Frame shared by every page of a single subject: hero row + tab strip. */
export default function SubjectShell({
  locale,
  specialtyKey,
  specialtyName,
  degree,
  subjectKey,
  subject,
  style,
  untranslated,
  children,
}: {
  locale: Locale;
  /** Identifies the programme in links. */
  specialtyKey: string;
  specialtyName: string;
  degree: 1 | 2 | null;
  /** Identifies the subject in links. */
  subjectKey: string;
  subject: SubjectDetails;
  style: FacultyStyle;
  untranslated: boolean;
  children: ReactNode;
}) {
  const base = subjectPath(locale, specialtyKey, subjectKey);
  const sections = SUBJECT_SECTIONS.map((s) => ({ slug: s.slug, label: s[locale] }));
  const hrefFor = Object.fromEntries(SUBJECT_SECTIONS.map((s) => [s.slug, subjectPath(locale, specialtyKey, subjectKey, s.slug)]));

  const crumbs = [{ label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` }];
  if (degree) crumbs.push({ label: degreeLabel(degree, locale), href: degreeListPath(locale, degree) });
  crumbs.push(
    { label: specialtyName, href: programmePath(locale, specialtyKey) },
    { label: tr(locale, "Tədris planı", "Curriculum"), href: programmePath(locale, specialtyKey, "subjects") }
  );

  return (
    <>
      <PageHero
        locale={locale}
        hue={style.hue}
        crumbs={[...crumbs, { label: subject.subject_name }]}
        kicker={
          <>
            {tr(locale, "Fənn", "Subject")} ·{" "}
            <Link href={programmePath(locale, specialtyKey)} className="underline decoration-1 underline-offset-4 hover:decoration-2">
              {specialtyName}
            </Link>
          </>
        }
        heading={
          <SectionTitle name={subject.subject_name} base={base} sections={sections} lang={untranslated ? "az" : undefined} />
        }
        art={style.art}
        meta={
          <>
            {subject.subject_code && <CodePill tone="k0">{subject.subject_code}</CodePill>}
            {typeof subject.credit === "number" && (
              <Pill tone="k0">
                <IconLayers />
                {tr(locale, `${subject.credit} kredit`, `${subject.credit} credits`)}
              </Pill>
            )}
            {(subject.semester === 1 || subject.semester === 2) && (
              <Pill tone="k0">
                <IconCalendar />
                {semesterLongLabel(subject.semester, locale)}
              </Pill>
            )}
            {(subject.status === 1 || subject.status === 2) && (
              <Pill tone="k0">
                <IconCap />
                {statusLabel(subject.status, locale)}
              </Pill>
            )}
            {subject.year?.trim() && (
              <Pill tone="k0">
                <IconClock />
                {subject.year.trim()}
              </Pill>
            )}
          </>
        }
      />

      <SectionNav label={tr(locale, "Fənn bölmələri", "Subject sections")} base={base} sections={sections} hrefFor={hrefFor} />

      <div className={`${style.hue} wrap py-10 md:py-14`}>{children}</div>
    </>
  );
}
