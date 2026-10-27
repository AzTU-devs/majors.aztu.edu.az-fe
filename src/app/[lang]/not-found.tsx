import type { Metadata } from "next";
import { headers } from "next/headers";

import NotFoundContent from "@/components/errors/NotFoundContent";
import { resolveLocale } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Səhifə tapılmadı / Page not found | AzTU" },
  robots: { index: false, follow: true },
};

/**
 * 404 for a record that does not exist (a page or layout under [lang] called
 * notFound(): unknown or deleted programme, subject, faculty, department).
 * Rendered inside the [lang] layout, so it has the site header and footer.
 * Not-found boundaries receive no params, so the language comes from the
 * header the middleware sets from the URL.
 *
 * Next.js 15 sends these with status 404 but renders a thrown notFound() on
 * the client (the HTML is a minimal shell plus the payload) — the same as the
 * previous build. URLs that match no route at all use app/not-found.tsx and
 * are fully server-rendered.
 */
export default async function NotFound() {
  const locale = resolveLocale((await headers()).get("x-aztu-lang"));
  return <NotFoundContent locale={locale} />;
}
