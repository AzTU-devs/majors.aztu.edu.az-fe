import Curriculum from "@/components/programme/sections/Curriculum";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { lang, specialtyKey } = await params;
  return (
    <Curriculum locale={resolveLocale(lang)} specialtyKey={decodeURIComponent(specialtyKey)} />
  );
}
