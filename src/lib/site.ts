/**
 * Single source of truth for site-wide identity, URLs and locale handling.
 *
 * Everything SEO-related (canonicals, hreflang, sitemap, JSON-LD) derives from
 * here so the values can never drift apart.
 */

export const LOCALES = ["az", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "az";

/** Narrow an unknown route segment to a supported locale. */
export function resolveLocale(value: unknown): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  return LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE;
}

/** BCP-47 tags, used for `<html lang>` and hreflang alternates. */
export const HTML_LANG: Record<Locale, string> = {
  az: "az-AZ",
  en: "en",
};

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
    streetAz: "H.Cavid prospekti 25",
    streetEn: "25 H.Javid Avenue",
    cityAz: "Bakı",
    cityEn: "Baku",
    postalCode: "AZ1073",
    countryCode: "AZ",
  },
  /** Approximate campus coordinates, used for LocalBusiness/Place markup. */
  geo: { lat: 40.3777, lng: 49.8339 },
  founded: "1920",
} as const;

export const SITE_NAME: Record<Locale, string> = {
  az: "AzTU Təhsil Proqramları",
  en: "AzTU Academic Programmes",
};

export const SITE_TAGLINE: Record<Locale, string> = {
  az: "İxtisas İnformasiya Sistemi",
  en: "Programme Information System",
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
    "qəbul",
  ],
  en: [
    "AzTU",
    "Azerbaijan Technical University",
    "specialties",
    "academic programmes",
    "bachelor degree",
    "master degree",
    "faculties",
    "departments",
    "syllabus",
    "curriculum",
    "learning outcomes",
    "admissions",
  ],
};

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Canonical + hreflang alternates for a path *without* its locale prefix.
 *
 * `localePath("/bachelor", "en")` -> canonical /en/bachelor, alternates for
 * every locale plus x-default pointing at the default locale.
 */
export function localeAlternates(pathWithoutLocale: string, locale: Locale) {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HTML_LANG[l]] = absoluteUrl(`/${l}${clean}`);
  }
  languages["x-default"] = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`);

  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages,
  };
}

/**
 * Whether the site is behind the password gate.
 *
 * The gate hides the whole site from visitors *and* from search engines, so it
 * must be switched off before any of the SEO work here can take effect. Set
 * SITE_GATE=off once the site is ready to be public.
 */
export const GATE_ENABLED =
  (process.env.SITE_GATE ?? process.env.NEXT_PUBLIC_SITE_GATE ?? "on").toLowerCase() !==
  "off";
