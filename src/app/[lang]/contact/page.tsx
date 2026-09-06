import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import ContactCards from "@/components/contact/ContactCards";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { SITE_NAME, UNIVERSITY, localeAlternates, resolveLocale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";

  const title = az ? "Əlaqə" : "Contact";
  const description = az
    ? `Azərbaycan Texniki Universiteti ilə əlaqə: ${UNIVERSITY.email}, (+994 12) 538-33-83, ${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz}.`
    : `Contact Azerbaijan Technical University: ${UNIVERSITY.email}, (+994 12) 538-33-83, ${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn}.`;

  return {
    title,
    description,
    alternates: localeAlternates("/contact", locale),
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = resolveLocale((await params).lang);
  const az = locale === "az";

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Əlaqə" : "Contact", path: `/${locale}/contact` },
          ])
        )}
      />
      <PageHero
        eyebrow={az ? "Bizimlə əlaqə" : "Get in touch"}
        title={az ? "Əlaqə" : "Contact"}
        subtitle={
          az
            ? "Təhsil proqramları ilə bağlı suallarınız üçün Azərbaycan Texniki Universiteti ilə əlaqə saxlayın."
            : "Reach out to Azerbaijan Technical University with any question about our programmes."
        }
        breadcrumbs={[
          { label: az ? "Ana səhifə" : "Home", href: `/${locale}` },
          { label: az ? "Əlaqə" : "Contact" },
        ]}
      />
      <ContactCards locale={locale} />
    </>
  );
}
