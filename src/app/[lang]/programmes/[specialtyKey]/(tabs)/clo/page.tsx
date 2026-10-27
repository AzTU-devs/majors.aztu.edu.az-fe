import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CourseOutcomes from "@/components/programme/sections/CourseOutcomes";
import { programmeJsonLd, programmeMetadata, readParams, type ProgrammeParams } from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import { fetchCurriculum, fetchProgrammeClos, fetchSpecialty, orFallback, settle } from "@/lib/api";
import { CLO, SUBJECT, marked, markList } from "@/lib/content";
import type { Locale } from "@/lib/site";

const SLUG = "clo";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, SLUG);
}

/**
 * Subjects of the programme that have outcomes, in curriculum order. On an
 * English page, names and outcomes shown in their Azerbaijani fallback are
 * marked (src/lib/content.ts).
 */
async function rows(key: string, locale: Locale) {
  const subjects = await marked(locale, (l) => fetchCurriculum(key, l), SUBJECT);
  const clos = await fetchProgrammeClos(key, locale, subjects);
  const azClos =
    locale === "en"
      ? await orFallback(fetchCurriculum(key, "az").then((list) => fetchProgrammeClos(key, "az", list)), null)
      : null;
  return subjects
    .map((subject) => {
      const own = clos.get(subject.subject_key) ?? [];
      return { subject, clos: locale === "en" ? markList(own, azClos?.get(subject.subject_key) ?? null, CLO).items : own };
    })
    .filter((r) => r.clos.length > 0);
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const [data, jsonLd] = await Promise.all([settle(rows(key, locale)), programmeJsonLd(locale, key, specialty, SLUG)]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <CourseOutcomes locale={locale} specialtyKey={key} rows={data} />
    </>
  );
}
