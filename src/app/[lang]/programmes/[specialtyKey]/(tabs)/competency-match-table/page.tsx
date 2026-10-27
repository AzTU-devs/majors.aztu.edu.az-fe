import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CompetencyMatrix from "@/components/programme/sections/CompetencyMatrix";
import { programmeJsonLd, programmeMetadata, readParams, type ProgrammeParams } from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import {
  fetchCompetencies,
  fetchCurriculum,
  fetchProgrammeCompetencyMatches,
  fetchSpecialty,
  settle,
} from "@/lib/api";
import { COMPETENCY, SUBJECT, marked } from "@/lib/content";
import type { Locale } from "@/lib/site";

const SLUG = "competency-match-table";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, SLUG);
}

async function matrix(key: string, locale: Locale) {
  const [competencies, subjects] = await Promise.all([
    marked(locale, (l) => fetchCompetencies(key, l), COMPETENCY),
    marked(locale, (l) => fetchCurriculum(key, l), SUBJECT),
  ]);
  // Joined on subject_key: subject codes are not unique.
  const matches = await fetchProgrammeCompetencyMatches(key, competencies);
  return { competencies, subjects, matches };
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const [data, jsonLd] = await Promise.all([settle(matrix(key, locale)), programmeJsonLd(locale, key, specialty, SLUG)]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <CompetencyMatrix locale={locale} specialtyKey={key} data={data} />
    </>
  );
}
