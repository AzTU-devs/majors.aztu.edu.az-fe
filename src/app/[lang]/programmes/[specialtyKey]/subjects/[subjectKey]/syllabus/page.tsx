import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import Syllabus from "@/components/subject/sections/Syllabus";
import {
  loadSubject,
  readSubjectParams,
  subjectDescription,
  subjectJsonLd,
  subjectMetadata,
  type SubjectParams,
} from "@/components/subject/subjectData";
import { fetchClos, fetchLiteratures, settle } from "@/lib/api";
import { CLO, marked, markedTopics } from "@/lib/content";

export function generateMetadata({ params }: { params: SubjectParams }): Promise<Metadata> {
  return subjectMetadata(params, "syllabus");
}

export default async function Page({ params }: { params: SubjectParams }) {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  const loaded = await loadSubject(specialtyKey, subjectKey, locale);
  if (!loaded) notFound();
  const { subject, specialty } = loaded;
  const [rest, jsonLd, description] = await Promise.all([
    settle(
      Promise.all([
        marked(locale, (l) => fetchClos(subjectKey, l), CLO),
        markedTopics(locale, subjectKey),
        fetchLiteratures(subjectKey, locale),
      ])
    ),
    subjectJsonLd(locale, specialtyKey, subjectKey, subject, specialty, "syllabus"),
    subjectDescription(locale, specialtyKey, subjectKey, subject),
  ]);
  const data = rest.ok
    ? { ok: true as const, data: { subject, clos: rest.data[0], topics: rest.data[1], literatures: rest.data[2] } }
    : { ok: false as const };
  return (
    <>
      <JsonLd data={jsonLd} />
      <Syllabus locale={locale} data={data} descriptionLang={description.lang} />
    </>
  );
}
