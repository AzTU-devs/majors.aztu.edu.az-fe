import Competencies from "@/components/programme/sections/Competencies";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string }>;
}) {
  const { lang, specialtyCode } = await params;
  return (
    <Competencies locale={resolveLocale(lang)} specialtyCode={decodeURIComponent(specialtyCode)} />
  );
}
