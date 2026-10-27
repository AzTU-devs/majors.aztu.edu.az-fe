import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import Topics from "@/components/subject/sections/Topics";
import { loadSubject, readSubjectParams, subjectJsonLd, subjectMetadata, type SubjectParams } from "@/components/subject/subjectData";
import { settle } from "@/lib/api";
import { markedTopics } from "@/lib/content";

export function generateMetadata({ params }: { params: SubjectParams }): Promise<Metadata> {
  return subjectMetadata(params, "topics");
}

export default async function Page({ params }: { params: SubjectParams }) {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  const loaded = await loadSubject(specialtyKey, subjectKey, locale);
  if (!loaded) notFound();
  const { subject, specialty } = loaded;
  const [topics, jsonLd] = await Promise.all([
    settle(markedTopics(locale, subjectKey)),
    subjectJsonLd(locale, specialtyKey, subjectKey, subject, specialty, "topics"),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <Topics locale={locale} topics={topics} />
    </>
  );
}
