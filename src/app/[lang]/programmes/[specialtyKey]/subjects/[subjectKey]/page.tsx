import SubjectOverview from "@/components/subject/sections/SubjectOverview";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string; subjectKey: string }>;
}) {
  const { lang, specialtyKey, subjectKey } = await params;
  return (
    <SubjectOverview
      locale={resolveLocale(lang)}
      specialtyKey={decodeURIComponent(specialtyKey)}
      subjectKey={decodeURIComponent(subjectKey)}
    />
  );
}
