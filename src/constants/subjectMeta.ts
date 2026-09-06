import type { Locale } from "@/lib/site";

export type { Locale };

/**
 * Canonical semester mapping, matching the backend and the admin create form:
 * 1 = Payız (autumn), 2 = Yaz (spring).
 *
 * Every view reads it from here — five screens previously hardcoded their own
 * copy and had drifted apart.
 */
export const semesterLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Payız" : "Autumn";
    if (v === 2) return locale === "az" ? "Yaz" : "Spring";
    return "—";
};

export const semesterLongLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Payız semestri" : "Autumn semester";
    if (v === 2) return locale === "az" ? "Yaz semestri" : "Spring semester";
    return "—";
};

/** Subject status: 1 = elective, 2 = mandatory, 3 = other. */
export const statusLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Seçmə" : "Elective";
    if (v === 2) return locale === "az" ? "Məcburi" : "Mandatory";
    if (v === 3) return locale === "az" ? "Digər" : "Other";
    return "—";
};

export const formOfEducationLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Əyani" : "Full-time";
    if (v === 2) return locale === "az" ? "Qiyabi" : "Correspondence";
    return "—";
};

export const languageLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Azərbaycan" : "Azerbaijani";
    if (v === 2) return locale === "az" ? "İngilis" : "English";
    if (v === 3) return locale === "az" ? "Rus" : "Russian";
    if (v === 4) return locale === "az" ? "Alman" : "German";
    if (v === 5) return locale === "az" ? "Türk" : "Turkish";
    return "—";
};

const TEACHING_METHODS: Record<string, { az: string; en: string }> = {
    lecture: { az: "mühazirə", en: "lecture" },
    interactive: { az: "interaktiv müzakirə", en: "interactive discussion" },
    seminar: { az: "seminar", en: "seminar" },
    lab: { az: "laboratoriya işi", en: "laboratory work" },
    pbl: { az: "problem-based learning", en: "problem-based learning" },
    case: { az: "case study", en: "case study" },
    project: { az: "layihə əsaslı öyrənmə", en: "project-based learning" },
    team: { az: "komanda işi", en: "teamwork" },
    presentation: { az: "təqdimatlar", en: "presentations" },
};

export const teachingMethodLabel = (key: string, locale: Locale) =>
    TEACHING_METHODS[key]?.[locale] ?? key;

export const parseTeachingMethods = (value?: string | null): string[] =>
    value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
