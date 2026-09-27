import LearningOutcomes from "@/components/programme/sections/LearningOutcomes";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { lang, specialtyKey } = await params;
  return (
    <LearningOutcomes locale={resolveLocale(lang)} specialtyKey={decodeURIComponent(specialtyKey)} />
  );
}
