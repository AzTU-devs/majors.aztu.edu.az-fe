import Syllabus from "@/components/subject/sections/Syllabus";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; subjectKey: string }>;
}) {
  const { lang, subjectKey } = await params;
  return <Syllabus locale={resolveLocale(lang)} subjectKey={decodeURIComponent(subjectKey)} />;
}
