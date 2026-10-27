/**
 * Page metadata.
 *
 * Every page builds its <title>, description, self-canonical, hreflang
 * alternates, Open Graph and Twitter tags here, so no page can silently
 * inherit another page's canonical (which is what happened to every
 * programme and subject tab before).
 */
import type { Metadata } from "next";

import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  SITE_NAME,
  UNIVERSITY,
  absoluteUrl,
  localeAlternates,
  type Locale,
} from "./site";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Trim to a search-snippet length at a word boundary. */
export function fitDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,.;:—–-]+$/, "")}…`;
}

/**
 * Canonical + alternates. `translated: false` marks content that exists only
 * in Azerbaijani (the API falls back to az when a record has no English
 * row): the English URL then canonicalises to the Azerbaijani one and the
 * hreflang set omits English, so search engines don't index two copies of
 * the same Azerbaijani text.
 */
export function alternatesFor(pathWithoutLocale: string, locale: Locale, translated = true) {
  if (translated) return localeAlternates(pathWithoutLocale, locale);
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "");
  const az = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`);
  return {
    canonical: az,
    languages: { [HTML_LANG[DEFAULT_LOCALE]]: az, "x-default": az } as Record<string, string>,
  };
}

/** Whether an English record differs from its Azerbaijani one (i.e. is translated). */
export function isTranslated(az: string | null | undefined, en: string | null | undefined): boolean {
  const norm = (v: string | null | undefined) => (v ?? "").replace(/\s+/g, " ").trim().toLocaleLowerCase("az");
  const a = norm(az);
  const e = norm(en);
  return Boolean(e) && e !== a;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  imageAlt,
  type = "website",
  translated = true,
  index = true,
  absoluteTitle,
}: {
  locale: Locale;
  /** Path without the locale prefix ("/" for home). */
  path: string;
  /** Page title without the site suffix. */
  title: string;
  description: string;
  /** Site-relative URL of the social image (see ogPath). */
  image: string;
  imageAlt?: string;
  type?: "website" | "article";
  translated?: boolean;
  index?: boolean;
  /** Use this exact <title> instead of "title | AzTU". */
  absoluteTitle?: string;
}): Metadata {
  const alternates = alternatesFor(path, locale, translated);
  const desc = fitDescription(description);
  const fullTitle = absoluteTitle ?? `${title} | ${UNIVERSITY.shortName}`;
  const images = [{ url: image, ...OG_SIZE, alt: imageAlt ?? title, type: "image/png" }];

  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates,
    openGraph: {
      type,
      siteName: SITE_NAME[locale],
      title,
      description: desc,
      url: alternates.canonical,
      locale: OG_LOCALE[locale],
      alternateLocale: translated ? LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]) : [],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [{ url: image, alt: imageAlt ?? title }],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        }
      : { index: false, follow: true },
  };
}

/** Metadata for a record that does not exist (rendered with the 404 page). */
export function notFoundMetadata(what: string): Metadata {
  return {
    title: { absolute: `${what} | ${UNIVERSITY.shortName}` },
    robots: { index: false, follow: false },
  };
}

/** Metadata while the API is unavailable (the page renders its error state). */
export function unavailableMetadata(title: string): Metadata {
  return { title: { absolute: `${title} | ${UNIVERSITY.shortName}` }, robots: { index: false, follow: false } };
}
