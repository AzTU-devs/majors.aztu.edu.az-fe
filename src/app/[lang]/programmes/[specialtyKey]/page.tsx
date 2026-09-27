import Overview from "@/components/programme/sections/Overview";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { lang, specialtyKey } = await params;
  return (
    <Overview locale={resolveLocale(lang)} specialtyKey={decodeURIComponent(specialtyKey)} />
  );
}
