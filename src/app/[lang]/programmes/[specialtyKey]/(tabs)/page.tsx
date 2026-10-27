import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Overview from "@/components/programme/sections/Overview";
import {
  programmeDescription,
  programmeFacts,
  programmeJsonLd,
  programmeMetadata,
  readParams,
  type ProgrammeParams,
} from "@/components/programme/programmeData";
import JsonLd from "@/components/seo/JsonLd";
import {
  fetchCompetencies,
  fetchCurriculum,
  fetchGcos,
  fetchPlos,
  fetchSpecialty,
  fetchSpecialtyCharacteristics,
  orFallback,
  settle,
} from "@/lib/api";

export function generateMetadata({ params }: { params: ProgrammeParams }): Promise<Metadata> {
  return programmeMetadata(params, "");
}

export default async function Page({ params }: { params: ProgrammeParams }) {
  const { locale, key } = await readParams(params);
  // Layouts and pages render in parallel, so the page checks too.
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  const count = <T,>(p: Promise<T[]>) => orFallback(p.then((l) => l.length), null);
  const [chars, facts, subjects, plos, competencies, careers, jsonLd] = await Promise.all([
    settle(fetchSpecialtyCharacteristics(key, locale)),
    programmeFacts(key, locale),
    count(fetchCurriculum(key, locale)),
    count(fetchPlos(key, locale)),
    count(fetchCompetencies(key, locale)),
    count(fetchGcos(key, locale)),
    programmeJsonLd(locale, key, specialty, ""),
  ]);
  const charsLang = chars.ok ? (await programmeDescription(key, locale, chars.data)).lang : undefined;

  return (
    <>
      <JsonLd data={jsonLd} />
      <Overview
        locale={locale}
        specialtyKey={key}
        code={specialty.specialty_code}
        degree={specialty.degree}
        chars={chars}
        charsLang={charsLang}
        facts={facts}
        counts={{ subjects, plos, competencies, careers }}
      />
    </>
  );
}
