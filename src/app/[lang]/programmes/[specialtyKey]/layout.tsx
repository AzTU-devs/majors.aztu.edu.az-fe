import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProgrammeShell from "@/components/programme/ProgrammeShell";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, programmeSchema } from "@/lib/jsonld";
import { fetchSpecialty } from "@/lib/api";
import { degreeListPath, programmePath } from "@/lib/routes";
import { SITE_NAME, localeAlternates, resolveLocale } from "@/lib/site";

interface RouteParams {
  lang: string;
  specialtyKey: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { lang, specialtyKey: raw } = await params;
  const locale = resolveLocale(lang);
  const specialtyKey = decodeURIComponent(raw);
  const specialty = await fetchSpecialty(specialtyKey, locale);
  const az = locale === "az";

  if (!specialty) {
    return {
      title: az ? "İxtisas tapılmadı" : "Programme not found",
      robots: { index: false, follow: false },
    };
  }

  const degreeAz = specialty.degree === 2 ? "Magistr" : "Bakalavr";
  const degreeEn = specialty.degree === 2 ? "Master's" : "Bachelor's";

  // A specific, human title — this is what shows in the search result.
  const title = az
    ? `${specialty.specialty_name} — ${degreeAz} ixtisası`
    : `${specialty.specialty_name} — ${degreeEn} programme`;

  const description = az
    ? `${specialty.specialty_name} (${specialty.specialty_code}) ${degreeAz.toLowerCase()} təhsil proqramı: tədris planı, fənlər, təlim nəticələri, səriştələr və məzun karyera imkanları — Azərbaycan Texniki Universiteti.`
    : `${specialty.specialty_name} (${specialty.specialty_code}) ${degreeEn} degree programme at Azerbaijan Technical University: curriculum, subjects, learning outcomes, competencies and graduate career paths.`;

  return {
    title,
    description,
    alternates: localeAlternates(`/programmes/${encodeURIComponent(specialtyKey)}`, locale),
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProgrammeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<RouteParams>;
}) {
  const { lang, specialtyKey: raw } = await params;
  const locale = resolveLocale(lang);
  const specialtyKey = decodeURIComponent(raw);
  const specialty = await fetchSpecialty(specialtyKey, locale);

  // An unknown key renders the 404 page rather than a shell with an empty
  // title and every tab leading nowhere.
  if (!specialty) notFound();

  const az = locale === "az";
  const path = programmePath(locale, specialtyKey);

  return (
    <>
      <JsonLd
        data={graph(
          programmeSchema({
            locale,
            name: specialty.specialty_name,
            code: specialty.specialty_code,
            path,
            degree: specialty.degree,
          }),
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            {
              name:
                specialty.degree === 2
                  ? az ? "Magistr" : "Master"
                  : az ? "Bakalavr" : "Bachelor",
              path: degreeListPath(locale, specialty.degree),
            },
            { name: specialty.specialty_name, path },
          ])
        )}
      />
      <ProgrammeShell
        locale={locale}
        specialtyKey={specialtyKey}
        specialtyCode={specialty.specialty_code}
        specialtyName={specialty.specialty_name}
        degree={specialty.degree}
      >
        {children}
      </ProgrammeShell>
    </>
  );
}
