import { notFound } from "next/navigation";

import ProgrammeShell from "@/components/programme/ProgrammeShell";
import { programmeFacts, readParams } from "@/components/programme/programmeData";
import { fetchCurriculum, fetchSpecialty, orFallback } from "@/lib/api";
import { programmeTranslated } from "@/lib/catalogue";

/** Hero + tab strip around the programme's tabs (not around its subjects). */
export default async function ProgrammeTabsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { locale, key } = await readParams(params);
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();

  const [facts, curriculum, translated] = await Promise.all([
    programmeFacts(key, locale),
    orFallback(fetchCurriculum(key, locale), null),
    programmeTranslated(key),
  ]);

  return (
    <ProgrammeShell
      locale={locale}
      specialtyKey={key}
      specialtyCode={specialty.specialty_code}
      specialtyName={specialty.specialty_name}
      degree={specialty.degree}
      facts={facts}
      subjectCount={curriculum ? curriculum.length : null}
      untranslated={locale === "en" && !translated}
    >
      {children}
    </ProgrammeShell>
  );
}
