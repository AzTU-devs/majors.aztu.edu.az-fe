import type { Metadata } from "next";

import LocaleSync from "@/components/localeSync/LocaleSync";
import SiteShell from "@/components/layout/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/jsonld";
import {
  LOCALES,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  UNIVERSITY,
  localeAlternates,
  resolveLocale,
} from "@/lib/site";

/** Pre-render both language trees. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);

  return {
    title: {
      default: `${SITE_NAME[locale]} — ${locale === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}`,
      template: `%s | ${UNIVERSITY.shortName}`,
    },
    description: SITE_DESCRIPTION[locale],
    keywords: SITE_KEYWORDS[locale],
    alternates: localeAlternates("/", locale),
    openGraph: {
      title: `${SITE_NAME[locale]} — ${locale === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}`,
      description: SITE_DESCRIPTION[locale],
      locale: locale === "az" ? "az_AZ" : "en_US",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const locale = resolveLocale((await params).lang);

  return (
    <>
      {/* Organisation + website nodes, emitted once per language tree. */}
      <JsonLd data={graph(organizationSchema(locale), websiteSchema(locale))} />
      <LocaleSync />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
