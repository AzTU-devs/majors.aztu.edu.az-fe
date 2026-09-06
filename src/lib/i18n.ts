import type { Locale } from "./site";
import { DEFAULT_LOCALE } from "./site";

// EN
import enHome from "@/locales/en/home.json";
import enHeader from "@/locales/en/header.json";
import enFaculty from "@/locales/en/faculty.json";

// AZ
import azHome from "@/locales/az/home.json";
import azHeader from "@/locales/az/header.json";
import azFaculty from "@/locales/az/faculty.json";

export type { Locale };

type Page = "header" | "faculty" | "home";
type TranslationKey = string;

const translations: Record<Locale, Record<Page, Record<TranslationKey, string>>> = {
  en: { header: enHeader, faculty: enFaculty, home: enHome },
  az: { header: azHeader, faculty: azFaculty, home: azHome },
};

/**
 * Look up a translation.
 *
 * Falls back to the default locale and finally to the key itself, so a missing
 * entry renders something readable instead of throwing or printing
 * "undefined" into the page.
 */
export function t(page: Page, key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  return (
    translations[locale]?.[page]?.[key] ??
    translations[DEFAULT_LOCALE]?.[page]?.[key] ??
    key
  );
}

/** Pick between an Azerbaijani and an English string. */
export function tr(locale: Locale, az: string, en: string): string {
  return locale === "az" ? az : en;
}
