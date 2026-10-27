import type { Metadata } from "next";
import { headers } from "next/headers";

import NotFoundContent from "@/components/errors/NotFoundContent";
import SiteShell from "@/components/layout/SiteShell";
import { resolveLocale } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Səhifə tapılmadı / Page not found | AzTU" },
  robots: { index: false, follow: true },
};

/**
 * 404 for any URL that matches no route (e.g. /en/no-such-page). Rendered
 * with the site header and footer, in the language of the URL (the
 * middleware passes it in a request header — not-found pages get no params).
 */
export default async function NotFound() {
  const locale = resolveLocale((await headers()).get("x-aztu-lang"));
  return (
    <SiteShell locale={locale}>
      <NotFoundContent locale={locale} />
    </SiteShell>
  );
}
