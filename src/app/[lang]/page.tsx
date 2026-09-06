import type { Metadata } from "next";

import Home from "@/components/home/Home";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { fetchFaculties, fetchSpecialties } from "@/lib/api";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  UNIVERSITY,
  localeAlternates,
  resolveLocale,
} from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";

  const title = az
    ? "AzTU Təhsil Proqramları — bakalavr və magistr ixtisasları"
    : "AzTU Academic Programmes — bachelor's and master's degrees";

  return {
    // The home page carries the full name rather than the "| AzTU" template.
    title: { absolute: `${title} | ${az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}` },
    description: SITE_DESCRIPTION[locale],
    alternates: localeAlternates("/", locale),
    openGraph: {
      type: "website",
      title,
      description: SITE_DESCRIPTION[locale],
      siteName: SITE_NAME[locale],
      images: [{ url: "/aztu-campus.jpg", width: 1920, height: 1280, alt: UNIVERSITY.nameAz }],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = resolveLocale((await params).lang);

  // Real counts, read server-side, so the headline figures are accurate and
  // present in the crawled HTML rather than invented constants.
  const [bachelors, masters, faculties] = await Promise.all([
    fetchSpecialties(locale, 1),
    fetchSpecialties(locale, 2),
    fetchFaculties(locale),
  ]);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([{ name: SITE_NAME[locale], path: `/${locale}` }])
        )}
      />
      <Home
        locale={locale}
        stats={{
          bachelor: bachelors.length,
          master: masters.length,
          faculties: faculties.length,
        }}
      />
    </>
  );
}
