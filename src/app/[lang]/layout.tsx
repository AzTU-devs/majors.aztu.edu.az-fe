import LocaleSync from "@/components/localeSync/LocaleSync";
import SiteShell from "@/components/layout/SiteShell";
import { localeParam } from "@/lib/params";
import { LOCALES } from "@/lib/site";

/** Both language trees. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// No metadata here on purpose: every page sets its own title, description,
// canonical and hreflang (src/lib/seo.ts). A canonical declared on this layout
// was inherited by every page that did not override it.

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Anything but /az or /en is a 404 (it used to render the Azerbaijani site).
  const locale = localeParam((await params).lang);

  return (
    <>
      <LocaleSync />
      <SiteShell locale={locale}>{children}</SiteShell>
    </>
  );
}
