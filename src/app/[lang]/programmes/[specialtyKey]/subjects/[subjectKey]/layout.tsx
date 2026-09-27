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
  specialtyKey: string;
  subjectKey: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const specialtyKey = decodeURIComponent(p.specialtyKey);
  const subjectKey = decodeURIComponent(p.subjectKey);

  const [subject, specialty] = await Promise.all([
    fetchSubject(subjectKey, locale),
    fetchSpecialty(specialtyKey, locale),
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
      ? `${subject.subject_name} (${subject.subject_code}) fənni${
          specialty ? ` — ${specialty.specialty_name} ixtisası` : ""
        }: sillabus, kredit, mövzu planı, təlim nəticələri və ədəbiyyat siyahısı.`
      : `The ${subject.subject_name} (${subject.subject_code}) course${
          specialty ? ` in the ${specialty.specialty_name} programme` : ""
        }: syllabus, credits, topic plan, learning outcomes and reading list.`);

  return {
    // Set explicitly: the "%s | AzTU" template declared on the [lang] layout is
    // consumed by the programme layout and does not reach this depth.
    title: { absolute: `${title} | ${UNIVERSITY.shortName}` },
    description,
    alternates: localeAlternates(
      `/programmes/${encodeURIComponent(specialtyKey)}/subjects/${encodeURIComponent(subjectKey)}`,
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
  const specialtyKey = decodeURIComponent(p.specialtyKey);
  const subjectKey = decodeURIComponent(p.subjectKey);

  const [subject, specialty] = await Promise.all([
    fetchSubject(subjectKey, locale),
    fetchSpecialty(specialtyKey, locale),
  ]);

  if (!subject) notFound();

  const az = locale === "az";
  // The URL segment is a key, not something to show a reader, so a failed
  // programme lookup falls back to a generic label.
  const specialtyName = specialty?.specialty_name ?? (az ? "İxtisas" : "Programme");
  const path = subjectPath(locale, specialtyKey, subjectKey);

  return (
    <>
      <JsonLd
        data={graph(
          courseSchema({
            locale,
            name: subject.subject_name,
            code: subject.subject_code,
            path,
            description: subject.subject_description,
          }),
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: specialtyName, path: programmePath(locale, specialtyKey) },
            {
              name: az ? "Tədris planı" : "Curriculum",
              path: programmePath(locale, specialtyKey, "subjects"),
            },
            { name: subject.subject_name, path },
          ])
        )}
      />
      <SubjectShell
        locale={locale}
        specialtyKey={specialtyKey}
        specialtyName={specialtyName}
        subjectKey={subjectKey}
        subjectCode={subject.subject_code}
        subjectName={subject.subject_name}
      >
        {children}
      </SubjectShell>
    </>
  );
}
