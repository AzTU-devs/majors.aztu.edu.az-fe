import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import ProgrammeCatalogue from "@/components/catalogue/ProgrammeCatalogue";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchSpecialties } from "@/lib/api";
import { SITE_NAME, localeAlternates, resolveLocale } from "@/lib/site";

const PATH = "/master";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";
  const title = az ? "Magistr ixtisasları" : "Master's programmes";
  const description = az ? "AzTU-nun bütün magistr ixtisasları: ixtisaslaşma istiqamətləri, fənlər və təlim nəticələri." : "All master's degree programmes at AzTU: specialisation tracks, subjects and learning outcomes.";

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
  const items = await fetchSpecialties(locale, 2);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Magistr ixtisasları" : "Master's programmes", path: `/${locale}${PATH}` },
          ]),
          {
            "@type": "ItemList",
            name: az ? "Magistr ixtisasları" : "Master's programmes",
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
        eyebrow={az ? "Magistr" : "Master"}
        title={az ? "Magistr ixtisasları" : "Master's programmes"}
        subtitle={az ? "Azərbaycan Texniki Universitetinin bütün magistr təhsil proqramları — fakültə və axtarış üzrə filtrlə." : "Every graduate programme at Azerbaijan Technical University — filter by faculty or search by name."}
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Magistr" : "Master" },
        ]}
      />
      <ProgrammeCatalogue locale={locale} degree={2} />
    </>
  );
}
