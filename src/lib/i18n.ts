type Locale = "az" | "en";

// EN

import enHome from "@/locales/en/home.json";
import enHeader from "@/locales/en/header.json";
import enFaculty from "@/locales/en/faculty.json";

// AZ

import azHome from "@/locales/az/home.json";
import azHeader from "@/locales/az/header.json";
import azFaculty from "@/locales/az/faculty.json";

type Page = "header" | "faculty" | "home";
type TranslationKey = string;

const translations: Record<Locale, Record<Page, Record<TranslationKey, string>>> = {
  en: {
    header: enHeader,
    faculty: enFaculty,
    home: enHome
  },
  az: {
    header: azHeader,
    faculty: azFaculty,
    home: azHome
  }
};

export function t(page: Page, key: TranslationKey, locale: Locale = "az") {
  return translations[locale][page][key];
}