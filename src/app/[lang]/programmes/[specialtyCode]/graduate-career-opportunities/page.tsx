import CareerPaths from "@/components/programme/sections/CareerPaths";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyCode: string }>;
}) {
  const { lang, specialtyCode } = await params;
  return (
    <CareerPaths locale={resolveLocale(lang)} specialtyCode={decodeURIComponent(specialtyCode)} />
  );
}
