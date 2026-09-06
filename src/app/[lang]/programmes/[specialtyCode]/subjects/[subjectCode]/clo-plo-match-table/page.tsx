import CloPloMatrix from "@/components/subject/sections/CloPloMatrix";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string; subjectCode: string }>;
}) {
  const { lang, specialtyCode, subjectCode } = await params;
  return (
    <CloPloMatrix
      locale={resolveLocale(lang)}
      specialtyCode={decodeURIComponent(specialtyCode)}
      subjectCode={decodeURIComponent(subjectCode)}
    />
  );
}
