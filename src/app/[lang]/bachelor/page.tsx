import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import ProgrammeCatalogue from "@/components/catalogue/ProgrammeCatalogue";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchSpecialties } from "@/lib/api";
import { SITE_NAME, localeAlternates, resolveLocale } from "@/lib/site";

const PATH = "/bachelor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";
  const title = az ? "Bakalavr ixtisasları" : "Bachelor's programmes";
  const description = az ? "AzTU-nun bütün bakalavr ixtisasları: tədris planı, fənlər, təlim nəticələri və karyera imkanları." : "All bachelor's degree programmes at AzTU: curriculum, subjects, learning outcomes and career paths.";

  return {
    title,
    description,
    alternates: localeAlternates(PATH, locale),
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";
  const items = await fetchSpecialties(locale, 1);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Bakalavr ixtisasları" : "Bachelor's programmes", path: `/${locale}${PATH}` },
          ]),
          {
            "@type": "ItemList",
            name: az ? "Bakalavr ixtisasları" : "Bachelor's programmes",
            numberOfItems: items.length,
            itemListElement: items.slice(0, 100).map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.specialty_name,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://majors.aztu.edu.az"}/${locale}/programmes/${encodeURIComponent(s.specialty_code)}`,
            })),
          }
        )}
      />
      <PageHero
        eyebrow={az ? "Bakalavr" : "Bachelor"}
        title={az ? "Bakalavr ixtisasları" : "Bachelor's programmes"}
        subtitle={az ? "Azərbaycan Texniki Universitetinin bütün bakalavr təhsil proqramları — fakültə və axtarış üzrə filtrlə." : "Every undergraduate programme at Azerbaijan Technical University — filter by faculty or search by name."}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Bakalavr" : "Bachelor" },
        ]}
      />
      <ProgrammeCatalogue locale={locale} degree={1} />
    </>
  );
}
