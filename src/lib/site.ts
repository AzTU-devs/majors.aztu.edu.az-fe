/**
 * Single source of truth for site-wide identity, URLs and locale handling.
 *
 * Everything SEO-related (canonicals, hreflang, sitemap, JSON-LD) derives from
 * here so the values can never drift apart.
 */

export const LOCALES = ["az", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "az";

/** Whether a value is a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Narrow an unknown value to a supported locale (the default otherwise).
 * For headers and client hooks; a route's `[lang]` segment goes through
 * localeParam (src/lib/params.ts), which answers 404 instead.
 */
export function resolveLocale(value: unknown): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

/**
 * BCP-47 tags, used for `<html lang>` and the hreflang alternates (the same
 * values appear in the sitemap). Plain language codes: the catalogue is for
 * Azerbaijani and English readers wherever they are, not one region.
 */
export const HTML_LANG: Record<Locale, string> = {
  az: "az",
  en: "en",
};

/** Open Graph locale tags. */
export const OG_LOCALE: Record<Locale, string> = {
  az: "az_AZ",
  en: "en_US",
};

/** Browser UI colour (meta theme-color) per colour scheme. */
export const THEME_COLOR = { light: "#f6f8fc", dark: "#060d18" } as const;

/**
 * Public origin of the site. Set NEXT_PUBLIC_SITE_URL in the environment;
 * the fallback is the production hostname so canonical URLs are never relative.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://majors.aztu.edu.az"
).replace(/\/$/, "");

export const UNIVERSITY = {
  nameAz: "Azərbaycan Texniki Universiteti",
  nameEn: "Azerbaijan Technical University",
  shortName: "AzTU",
  url: "https://aztu.edu.az",
  email: "aztu@aztu.edu.az",
  phones: ["+994125383383", "+994125391305"],
  address: {
    streetAz: "H. Cavid prospekti 25",
    streetEn: "25 H. Javid Avenue",
    cityAz: "Bakı",
    cityEn: "Baku",
    postalCode: "AZ1073",
    countryCode: "AZ",
  },
  /** Approximate campus coordinates, used for the map and Place markup. */
  geo: { lat: 40.3777, lng: 49.8339 },
  founded: "1920",
} as const;

export const SITE_NAME: Record<Locale, string> = {
  az: "AzTU Təhsil Proqramları",
  en: "AzTU Academic Programmes",
};

/** Second line of the header wordmark ("AZTU" / this). */
export const BRAND_WORDMARK: Record<Locale, string> = {
  az: "İxtisaslar",
  en: "Programmes",
};

export const SITE_DESCRIPTION: Record<Locale, string> = {
  az:
    "Azərbaycan Texniki Universitetinin bakalavr və magistr ixtisasları, fakültələr və kafedralar, tədris planları, sillabuslar, təlim nəticələri və məzun karyera imkanları — hamısı bir yerdə.",
  en:
    "Bachelor's and master's programmes at Azerbaijan Technical University — faculties and departments, curricula, syllabi, learning outcomes and graduate career paths, all in one place.",
};

export const SITE_KEYWORDS: Record<Locale, string[]> = {
  az: [
    "AzTU",
    "Azərbaycan Texniki Universiteti",
    "ixtisaslar",
    "təhsil proqramları",
    "bakalavr",
    "magistr",
    "fakültələr",
    "kafedralar",
    "sillabus",
    "tədris planı",
    "təlim nəticələri",
  ],
  en: [
    "AzTU",
    "Azerbaijan Technical University",
    "academic programmes",
    "bachelor's degree",
    "master's degree",
    "faculties",
    "departments",
    "syllabus",
    "curriculum",
    "learning outcomes",
  ],
};

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The hreflang map for a path *without* its locale prefix. */
export function languageAlternates(pathWithoutLocale: string): Record<string, string> {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HTML_LANG[l]] = absoluteUrl(`/${l}${clean}`);
  languages["x-default"] = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`);
  return languages;
}

/**
 * Canonical + hreflang alternates for a path *without* its locale prefix.
 *
 * `localeAlternates("/bachelor", "en")` -> canonical /en/bachelor, alternates
 * for every locale plus x-default pointing at the default locale.
 */
export function localeAlternates(pathWithoutLocale: string, locale: Locale) {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "");
  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages: languageAlternates(pathWithoutLocale),
  };
}

/** Collapse runs of whitespace (catalogue names can carry stray tabs). */
export function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}
