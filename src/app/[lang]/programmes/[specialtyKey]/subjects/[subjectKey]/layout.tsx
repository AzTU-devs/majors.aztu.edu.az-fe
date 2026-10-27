import { notFound } from "next/navigation";

import { programmeFacts } from "@/components/programme/programmeData";
import SubjectShell from "@/components/subject/SubjectShell";
import { loadSubject, readSubjectParams, subjectTranslated, type SubjectParams } from "@/components/subject/subjectData";

export default async function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: SubjectParams;
}) {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  const loaded = await loadSubject(specialtyKey, subjectKey, locale);
  if (!loaded) notFound();
  const { subject, specialty } = loaded;

  const [facts, translated] = await Promise.all([
    programmeFacts(specialtyKey, locale),
    subjectTranslated(specialtyKey, subjectKey),
  ]);

  return (
    <SubjectShell
      locale={locale}
      specialtyKey={specialtyKey}
      specialtyName={specialty.specialty_name}
      degree={specialty.degree}
      subjectKey={subjectKey}
      subject={subject}
      style={facts.style}
      untranslated={locale === "en" && !translated}
    >
      {children}
    </SubjectShell>
  );
}
