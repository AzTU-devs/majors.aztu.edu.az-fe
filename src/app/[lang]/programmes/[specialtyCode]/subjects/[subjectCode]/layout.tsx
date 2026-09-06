import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SubjectShell from "@/components/subject/SubjectShell";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, courseSchema, graph } from "@/lib/jsonld";
import { fetchSpecialty, fetchSubject } from "@/lib/api";
import { programmePath, subjectPath } from "@/lib/routes";
import { SITE_NAME, UNIVERSITY, localeAlternates, resolveLocale } from "@/lib/site";

interface RouteParams {
  lang: string;
  specialtyCode: string;
  subjectCode: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const specialtyCode = decodeURIComponent(p.specialtyCode);
  const subjectCode = decodeURIComponent(p.subjectCode);

  const [subject, specialty] = await Promise.all([
    fetchSubject(subjectCode, locale),
    fetchSpecialty(specialtyCode, locale),
  ]);
  const az = locale === "az";

  if (!subject) {
    return {
      title: az ? "Fənn tapılmadı" : "Subject not found",
      robots: { index: false, follow: false },
    };
  }

  const title = az
    ? `${subject.subject_name} — sillabus və mövzu planı`
    : `${subject.subject_name} — syllabus and topics`;

  const description =
    subject.subject_description?.slice(0, 300) ||
    (az
      ? `${subject.subject_name} (${subjectCode}) fənni${
          specialty ? ` — ${specialty.specialty_name} ixtisası` : ""
        }: sillabus, kredit, mövzu planı, təlim nəticələri və ədəbiyyat siyahısı.`
      : `The ${subject.subject_name} (${subjectCode}) course${
          specialty ? ` in the ${specialty.specialty_name} programme` : ""
        }: syllabus, credits, topic plan, learning outcomes and reading list.`);

  return {
    // Set explicitly: the "%s | AzTU" template declared on the [lang] layout is
    // consumed by the programme layout and does not reach this depth.
    title: { absolute: `${title} | ${UNIVERSITY.shortName}` },
    description,
    alternates: localeAlternates(
      `/programmes/${encodeURIComponent(specialtyCode)}/subjects/${encodeURIComponent(subjectCode)}`,
      locale
    ),
    openGraph: { title, description, type: "article" },
  };
}

export default async function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<RouteParams>;
}) {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const specialtyCode = decodeURIComponent(p.specialtyCode);
  const subjectCode = decodeURIComponent(p.subjectCode);

  const [subject, specialty] = await Promise.all([
    fetchSubject(subjectCode, locale),
    fetchSpecialty(specialtyCode, locale),
  ]);

  if (!subject) notFound();

  const az = locale === "az";
  const specialtyName = specialty?.specialty_name ?? specialtyCode;
  const path = subjectPath(locale, specialtyCode, subjectCode);

  return (
    <>
      <JsonLd
        data={graph(
          courseSchema({
            locale,
            name: subject.subject_name,
            code: subjectCode,
            path,
            description: subject.subject_description,
          }),
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: specialtyName, path: programmePath(locale, specialtyCode) },
            {
              name: az ? "Tədris planı" : "Curriculum",
              path: programmePath(locale, specialtyCode, "subjects"),
            },
            { name: subject.subject_name, path },
          ])
        )}
      />
      <SubjectShell
        locale={locale}
        specialtyCode={specialtyCode}
        specialtyName={specialtyName}
        subjectCode={subjectCode}
        subjectName={subject.subject_name}
      >
        {children}
      </SubjectShell>
    </>
  );
}
