import LearningOutcomes from "@/components/programme/sections/LearningOutcomes";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string }>;
}) {
  const { lang, specialtyCode } = await params;
  return (
    <LearningOutcomes locale={resolveLocale(lang)} specialtyCode={decodeURIComponent(specialtyCode)} />
  );
}
