import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import DepartmentProgrammes from "@/components/faculties/DepartmentProgrammes";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchFaculties } from "@/lib/api";
import { API_BASE_URL } from "@/util/apiClient";
import { facultyPath } from "@/lib/routes";
import { SITE_NAME, localeAlternates, resolveLocale, type Locale } from "@/lib/site";

interface RouteParams {
  lang: string;
  facultyCode: string;
  cafedraCode: string;
}

/** Faculty + department names, read server-side so the title is meaningful. */
async function resolveNames(facultyCode: string, cafedraCode: string, locale: Locale) {
  const faculties = await fetchFaculties(locale);
  const faculty = faculties.find((f) => f.faculty_code === facultyCode) ?? null;

  let cafedraName = cafedraCode;
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/cafedras/${encodeURIComponent(facultyCode)}?lang=${locale}`,
      { next: { revalidate: 1800 }, headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const body = await res.json();
      const match = Array.isArray(body?.cafedras)
        ? body.cafedras.find((c: { cafedra_code: string }) => c.cafedra_code === cafedraCode)
        : null;
      if (match?.cafedra_name) cafedraName = match.cafedra_name;
    }
  } catch {
    // Fall back to the code — the page still renders.
  }

  return { facultyName: faculty?.faculty_name ?? facultyCode, cafedraName };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const facultyCode = decodeURIComponent(p.facultyCode);
  const cafedraCode = decodeURIComponent(p.cafedraCode);
  const { cafedraName, facultyName } = await resolveNames(facultyCode, cafedraCode, locale);
  const az = locale === "az";

  const title = az ? `${cafedraName} — ixtisaslar` : `${cafedraName} — programmes`;
  const description = az
    ? `${cafedraName} kafedrasının (${facultyName}) bakalavr və magistr ixtisasları — Azərbaycan Texniki Universiteti.`
    : `Bachelor's and master's programmes run by the ${cafedraName} department (${facultyName}) at Azerbaijan Technical University.`;

  return {
    title,
    description,
    alternates: localeAlternates(
      `/faculties/${encodeURIComponent(facultyCode)}/${encodeURIComponent(cafedraCode)}`,
      locale
    ),
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const p = await params;
  const locale = resolveLocale(p.lang);
  const facultyCode = decodeURIComponent(p.facultyCode);
  const cafedraCode = decodeURIComponent(p.cafedraCode);
  const { cafedraName, facultyName } = await resolveNames(facultyCode, cafedraCode, locale);
  const az = locale === "az";

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Fakültələr" : "Faculties", path: `/${locale}/faculties` },
            { name: facultyName, path: facultyPath(locale, facultyCode) },
            { name: cafedraName, path: facultyPath(locale, facultyCode, cafedraCode) },
          ])
        )}
      />
      <PageHero
        eyebrow={az ? "Kafedra" : "Department"}
        title={cafedraName}
        subtitle={az ? "Bu kafedraya aid bütün ixtisaslar" : "All programmes run by this department"}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Fakültələr" : "Faculties", href: `/${locale}/faculties` },
          { label: facultyName, href: facultyPath(locale, facultyCode) },
          { label: cafedraName },
        ]}
      />
      <DepartmentProgrammes locale={locale} cafedraCode={cafedraCode} />
    </>
  );
}
