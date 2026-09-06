import Topics from "@/components/subject/sections/Topics";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; subjectCode: string }>;
}) {
  const { lang, subjectCode } = await params;
  return <Topics locale={resolveLocale(lang)} subjectCode={decodeURIComponent(subjectCode)} />;
}
