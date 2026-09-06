import Syllabus from "@/components/subject/sections/Syllabus";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; subjectCode: string }>;
}) {
  const { lang, subjectCode } = await params;
  return <Syllabus locale={resolveLocale(lang)} subjectCode={decodeURIComponent(subjectCode)} />;
}
