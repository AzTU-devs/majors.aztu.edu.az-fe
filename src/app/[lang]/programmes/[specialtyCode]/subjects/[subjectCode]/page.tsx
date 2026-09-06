import SubjectOverview from "@/components/subject/sections/SubjectOverview";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string; subjectCode: string }>;
}) {
  const { lang, specialtyCode, subjectCode } = await params;
  return (
    <SubjectOverview
      locale={resolveLocale(lang)}
      specialtyCode={decodeURIComponent(specialtyCode)}
      subjectCode={decodeURIComponent(subjectCode)}
    />
  );
}
