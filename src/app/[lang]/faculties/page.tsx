import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import FacultyList from "@/components/faculties/FacultyList";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchFaculties } from "@/lib/api";
import { SITE_NAME, localeAlternates, resolveLocale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";

  const title = az ? "Fakültələr və kafedralar" : "Faculties and departments";
  const description = az
    ? "Azərbaycan Texniki Universitetinin fakültələri, onlara aid kafedralar və hər kafedranın apardığı təhsil proqramları."
    : "The faculties of Azerbaijan Technical University, their departments, and the programmes each department runs.";

  return {
    title,
    description,
    alternates: localeAlternates("/faculties", locale),
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";
  const faculties = await fetchFaculties(locale);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Fakültələr" : "Faculties", path: `/${locale}/faculties` },
          ])
        )}
      />
      <PageHero
        eyebrow={az ? "Struktur" : "Structure"}
        title={az ? "Fakültələr" : "Faculties"}
        subtitle={
          az
            ? "Azərbaycan Texniki Universitetinin fakültələri və onlara aid kafedralar."
            : "The faculties of Azerbaijan Technical University and their departments."
        }
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Fakültələr" : "Faculties" },
        ]}
      />
      <FacultyList locale={locale} faculties={faculties} />
    </>
  );
}
