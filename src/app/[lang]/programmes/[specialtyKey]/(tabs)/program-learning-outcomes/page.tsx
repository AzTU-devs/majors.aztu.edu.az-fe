import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LearningOutcomes from "@/components/programme/sections/LearningOutcomes";
import { programmeJsonLd, programmeMetadata, readParams, type ProgrammeParams } from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import { fetchPlos, fetchSpecialty, settle } from "@/lib/api";
import { PLO, marked } from "@/lib/content";

const SLUG = "program-learning-outcomes";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, SLUG);
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const [plos, jsonLd] = await Promise.all([settle(marked(locale, (l) => fetchPlos(key, l), PLO)), programmeJsonLd(locale, key, specialty, SLUG)]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <LearningOutcomes locale={locale} plos={plos} />
    </>
  );
}
