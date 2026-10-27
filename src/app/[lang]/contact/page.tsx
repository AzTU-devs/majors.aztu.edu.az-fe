import type { Metadata } from "next";

import ContactCards from "@/components/contact/ContactCards";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import { tr } from "@/lib/i18n";
import { breadcrumbSchema, graph, organizationSchema } from "@/lib/jsonld";
import { ogPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { localeParam } from "@/lib/params";
import { SITE_NAME, UNIVERSITY } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const locale = localeParam((await params).lang);
  const az = locale === "az";
  return pageMetadata({
    locale,
    path: "/contact",
    title: az ? "Əlaqə" : "Contact",
    description: az
      ? `Azərbaycan Texniki Universiteti ilə əlaqə: ${UNIVERSITY.email}, (+994 12) 538-33-83, ${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz}.`
      : `Contact Azerbaijan Technical University: ${UNIVERSITY.email}, (+994 12) 538-33-83, ${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn}.`,
    image: ogPath(locale, "page", "contact"),
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = localeParam((await params).lang);
  const az = locale === "az";

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(locale),
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Əlaqə" : "Contact", path: `/${locale}/contact` },
          ])
        )}
      />
      <PageHero
        locale={locale}
        hue="k-data"
        crumbs={[{ label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` }, { label: tr(locale, "Əlaqə", "Contact") }]}
        kicker={tr(locale, "Bizimlə əlaqə", "Get in touch")}
        title={tr(locale, "Əlaqə", "Contact")}
        lead={tr(
          locale,
          "Təhsil proqramları ilə bağlı suallarınız üçün Azərbaycan Texniki Universiteti ilə əlaqə saxlayın.",
          "Reach out to Azerbaijan Technical University with any question about our programmes."
        )}
        art="route"
      />
      <ContactCards locale={locale} />
    </>
  );
}
