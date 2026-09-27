import CareerPaths from "@/components/programme/sections/CareerPaths";
import { resolveLocale } from "@/lib/site";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { lang, specialtyKey } = await params;
  return (
    <CareerPaths locale={resolveLocale(lang)} specialtyKey={decodeURIComponent(specialtyKey)} />
  );
}
