import { notFound } from "next/navigation";

import { readParams } from "@/components/programme/programmeData";
import { fetchSpecialty } from "@/lib/api";

/**
 * Every page under a programme (its tabs and its subjects) exists only while
 * the programme does. An unknown (or deleted) key renders the 404 page; an
 * API outage throws instead, so it shows the error page rather than a
 * misleading 404.
 */
export default async function ProgrammeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; specialtyKey: string }>;
}) {
  const { locale, key } = await readParams(params);
  const specialty = await fetchSpecialty(key, locale);
  if (!specialty) notFound();
  return <>{children}</>;
}
