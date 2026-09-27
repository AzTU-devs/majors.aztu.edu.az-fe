import CourseOutcomes from "@/components/programme/sections/CourseOutcomes";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { lang, specialtyKey } = await params;
  return (
    <CourseOutcomes locale={resolveLocale(lang)} specialtyKey={decodeURIComponent(specialtyKey)} />
  );
}
