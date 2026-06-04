export type Locale = "az" | "en";

export const formOfEducationLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Əyani" : "Full-time";
    if (v === 2) return locale === "az" ? "Qiyabi" : "Correspondence";
    return "—";
};

export const languageLabel = (v: number | null | undefined, locale: Locale) => {
    if (v === 1) return locale === "az" ? "Azərbaycan" : "Azerbaijani";
    if (v === 2) return locale === "az" ? "İngilis" : "English";
    if (v === 3) return locale === "az" ? "Rus" : "Russian";
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
