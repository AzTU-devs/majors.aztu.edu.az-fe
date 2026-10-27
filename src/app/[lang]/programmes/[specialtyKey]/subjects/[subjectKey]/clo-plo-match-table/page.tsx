import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import CloPloMatrix from "@/components/subject/sections/CloPloMatrix";
import { loadSubject, readSubjectParams, subjectJsonLd, subjectMetadata, type SubjectParams } from "@/components/subject/subjectData";
import { fetchCloPloMatches, fetchClos, fetchPlos, settle } from "@/lib/api";
import { CLO, PLO, marked } from "@/lib/content";

export function generateMetadata({ params }: { params: SubjectParams }): Promise<Metadata> {
  return subjectMetadata(params, "clo-plo-match-table");
}

export default async function Page({ params }: { params: SubjectParams }) {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  const loaded = await loadSubject(specialtyKey, subjectKey, locale);
  if (!loaded) notFound();
  const { subject, specialty } = loaded;
  const [data, jsonLd] = await Promise.all([
    settle(
      Promise.all([
        marked(locale, (l) => fetchClos(subjectKey, l), CLO),
        marked(locale, (l) => fetchPlos(specialtyKey, l), PLO),
        fetchCloPloMatches(subjectKey),
      ]).then(([clos, plos, matches]) => ({
        clos,
        plos,
        matches: new Set(matches.map((m) => `${m.clo_code}__${m.plo_code}`)),
      }))
    ),
    subjectJsonLd(locale, specialtyKey, subjectKey, subject, specialty, "clo-plo-match-table"),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <CloPloMatrix locale={locale} data={data} />
    </>
  );
}
