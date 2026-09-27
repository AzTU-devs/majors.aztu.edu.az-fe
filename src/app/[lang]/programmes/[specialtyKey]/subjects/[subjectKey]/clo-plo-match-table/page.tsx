import CloPloMatrix from "@/components/subject/sections/CloPloMatrix";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string; subjectKey: string }>;
}) {
  const { lang, specialtyKey, subjectKey } = await params;
  return (
    <CloPloMatrix
      locale={resolveLocale(lang)}
      specialtyKey={decodeURIComponent(specialtyKey)}
      subjectKey={decodeURIComponent(subjectKey)}
    />
  );
}
