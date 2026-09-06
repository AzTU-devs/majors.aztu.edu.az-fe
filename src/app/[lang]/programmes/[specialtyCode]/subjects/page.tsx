import Curriculum from "@/components/programme/sections/Curriculum";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string }>;
}) {
  const { lang, specialtyCode } = await params;
  return (
    <Curriculum locale={resolveLocale(lang)} specialtyCode={decodeURIComponent(specialtyCode)} />
  );
}
