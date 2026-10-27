import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import SubjectOverview from "@/components/subject/sections/SubjectOverview";
import {
  loadSubject,
  readSubjectParams,
  subjectDescription,
  subjectJsonLd,
  subjectMetadata,
  type SubjectParams,
} from "@/components/subject/subjectData";
import { fetchClos, settle } from "@/lib/api";
import { CLO, marked } from "@/lib/content";

export function generateMetadata({ params }: { params: SubjectParams }): Promise<Metadata> {
  return subjectMetadata(params, "");
}

export default async function Page({ params }: { params: SubjectParams }) {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  // Layouts and pages render in parallel, so the page checks too — and reads
  // the subject's data only once both keys are known to exist.
  const loaded = await loadSubject(specialtyKey, subjectKey, locale);
  if (!loaded) notFound();
  const { subject, specialty } = loaded;
  const [clos, jsonLd, description] = await Promise.all([
    settle(marked(locale, (l) => fetchClos(subjectKey, l), CLO)),
    subjectJsonLd(locale, specialtyKey, subjectKey, subject, specialty, ""),
    subjectDescription(locale, specialtyKey, subjectKey, subject),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <SubjectOverview
        locale={locale}
        specialtyKey={specialtyKey}
        subjectKey={subjectKey}
        subject={subject}
        descriptionLang={description.lang}
        clos={clos}
      />
    </>
  );
}
