"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { HTML_LANG, LOCALES, type Locale } from "@/lib/site";
import { switchLocalePath } from "@/lib/routes";
import { IconGlobe } from "@/components/ui/icons";
import { cx } from "@/components/ui/primitives";

const NAMES: Record<Locale, string> = { az: "Azərbaycanca", en: "English" };

function Links({ locale, search }: { locale: Locale; search: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  return LOCALES.map((l) => (
    <a
      key={l}
      href={`${switchLocalePath(pathname, l)}${search}`}
      hrefLang={HTML_LANG[l]}
      lang={HTML_LANG[l]}
      aria-current={l === locale ? "true" : undefined}
      aria-label={`${l.toUpperCase()} — ${NAMES[l]}`}
      title={NAMES[l]}
    >
      {l.toUpperCase()}
    </a>
  ));
}

/** The links with the current query string (a filtered catalogue stays filtered). */
function LinksWithQuery({ locale }: { locale: Locale }) {
  const query = useSearchParams()?.toString() ?? "";
  return <Links locale={locale} search={query ? `?${query}` : ""} />;
}

/**
 * Language switch: real links to the same page in the other language,
 * keeping the query string (?q=, ?faculty=).
 *
 * Plain <a> rather than next/link on purpose — a full load renders the root
 * layout again, so `<html lang>` (read from the URL by the middleware)
 * matches the new language; a client-side transition would keep the old one.
 * The links also give crawlers the alternate-language URLs.
 */
export default function LanguageToggler({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <div className={cx("lang-switch", className)} role="group" aria-label={locale === "az" ? "Dil" : "Language"}>
      <IconGlobe />
      {/* useSearchParams needs a boundary wherever a page is prerendered. */}
      <Suspense fallback={<Links locale={locale} search="" />}>
        <LinksWithQuery locale={locale} />
      </Suspense>
    </div>
  );
}
