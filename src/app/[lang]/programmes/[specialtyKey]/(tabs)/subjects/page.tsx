import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Curriculum from "@/components/programme/sections/Curriculum";
import { programmeJsonLd, programmeMetadata, readParams, type ProgrammeParams } from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import { fetchCurriculum, fetchSpecialty, settle } from "@/lib/api";
import { SUBJECT, marked } from "@/lib/content";
import type { Subject } from "@/services/curricula/curricula";

const SLUG = "subjects";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, SLUG);
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const curriculum = await settle(marked(locale, (l) => fetchCurriculum(key, l), SUBJECT));
  const jsonLd = await programmeJsonLd(locale, key, specialty, SLUG, {
    subjects: curriculum.ok ? curriculum.data : undefined,
  });
  return (
    <>
      <JsonLd data={jsonLd} />
      <Curriculum
        locale={locale}
        specialtyKey={key}
        initial={curriculum.ok ? (curriculum.data as Subject[]) : null}
      />
    </>
  );
}
