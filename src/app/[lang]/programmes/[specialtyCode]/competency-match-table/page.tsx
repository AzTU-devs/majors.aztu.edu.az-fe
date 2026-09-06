import CompetencyMatrix from "@/components/programme/sections/CompetencyMatrix";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string }>;
}) {
  const { lang, specialtyCode } = await params;
  return (
    <CompetencyMatrix locale={resolveLocale(lang)} specialtyCode={decodeURIComponent(specialtyCode)} />
  );
}
