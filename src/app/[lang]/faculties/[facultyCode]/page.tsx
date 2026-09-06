import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageHero from "@/components/ui/PageHero";
import DepartmentList from "@/components/faculties/DepartmentList";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchFaculties } from "@/lib/api";
import { facultyPath } from "@/lib/routes";
import { SITE_NAME, localeAlternates, resolveLocale } from "@/lib/site";

interface RouteParams {
  lang: string;
  facultyCode: string;
}

/** The faculty's display name, resolved from the faculty index. */
async function findFaculty(code: string, locale: "az" | "en") {
  const faculties = await fetchFaculties(locale);
  return faculties.find((f) => f.faculty_code === code) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const facultyCode = decodeURIComponent(p.facultyCode);
  const faculty = await findFaculty(facultyCode, locale);
  const az = locale === "az";

  if (!faculty) {
    return {
      title: az ? "Fakültə tapılmadı" : "Faculty not found",
      robots: { index: false, follow: false },
    };
  }

  const title = az ? `${faculty.faculty_name} — kafedralar` : `${faculty.faculty_name} — departments`;
  const description = az
    ? `${faculty.faculty_name} tərkibindəki kafedralar və onların bakalavr və magistr təhsil proqramları — Azərbaycan Texniki Universiteti.`
    : `The departments within ${faculty.faculty_name} and their bachelor's and master's programmes at Azerbaijan Technical University.`;

  return {
    title,
    description,
    alternates: localeAlternates(`/faculties/${encodeURIComponent(facultyCode)}`, locale),
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const facultyCode = decodeURIComponent(p.facultyCode);
  const faculty = await findFaculty(facultyCode, locale);

  if (!faculty) notFound();

  const az = locale === "az";

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Fakültələr" : "Faculties", path: `/${locale}/faculties` },
            { name: faculty.faculty_name, path: facultyPath(locale, facultyCode) },
          ])
        )}
      />
      <PageHero
        eyebrow={az ? "Fakültə" : "Faculty"}
        title={faculty.faculty_name}
        subtitle={az ? "Fakültənin kafedraları" : "Departments of this faculty"}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Fakültələr" : "Faculties", href: `/${locale}/faculties` },
          { label: faculty.faculty_name },
        ]}
      />
      <DepartmentList locale={locale} facultyCode={facultyCode} />
    </>
  );
}
