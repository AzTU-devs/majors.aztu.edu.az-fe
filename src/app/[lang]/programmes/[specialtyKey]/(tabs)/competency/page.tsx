import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Competencies from "@/components/programme/sections/Competencies";
import { programmeJsonLd, programmeMetadata, readParams, type ProgrammeParams } from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import { fetchCompetencies, fetchSpecialty, settle } from "@/lib/api";
import { COMPETENCY, marked } from "@/lib/content";

const SLUG = "competency";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, SLUG);
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const [items, jsonLd] = await Promise.all([
    settle(marked(locale, (l) => fetchCompetencies(key, l), COMPETENCY)),
    programmeJsonLd(locale, key, specialty, SLUG),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <Competencies locale={locale} items={items} />
    </>
  );
}
