import Topics from "@/components/subject/sections/Topics";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; subjectKey: string }>;
}) {
  const { lang, subjectKey } = await params;
  return <Topics locale={resolveLocale(lang)} subjectKey={decodeURIComponent(subjectKey)} />;
}
