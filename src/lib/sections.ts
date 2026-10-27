import type { Locale } from "./site";

/** Sections of a programme, in tab order. `slug` is the URL segment. */
export const PROGRAMME_SECTIONS = [
  { slug: "", az: "Ümumi məlumat", en: "Overview" },
  { slug: "program-learning-outcomes", az: "Təlim məqsədləri", en: "Learning outcomes" },
  { slug: "subjects", az: "Tədris planı", en: "Curriculum" },
  { slug: "clo", az: "Fənn nəticələri", en: "Course outcomes" },
  { slug: "competency", az: "Səriştələr", en: "Competencies" },
  { slug: "competency-match-table", az: "Səriştə matrisi", en: "Competency matrix" },
  { slug: "graduate-career-opportunities", az: "Karyera imkanları", en: "Career paths" },
] as const;

export type ProgrammeSection = (typeof PROGRAMME_SECTIONS)[number]["slug"];

/** Sections of a subject, in tab order. */
export const SUBJECT_SECTIONS = [
  { slug: "", az: "Ümumi məlumat", en: "Overview" },
  { slug: "syllabus", az: "Sillabus", en: "Syllabus" },
  { slug: "topics", az: "Mövzu planı", en: "Topics" },
  { slug: "clo-plo-match-table", az: "CLO↔PLO matrisi", en: "CLO↔PLO matrix" },
] as const;

export type SubjectSection = (typeof SUBJECT_SECTIONS)[number]["slug"];

export function sectionLabel(
  sections: readonly { slug: string; az: string; en: string }[],
  slug: string,
  locale: Locale
) {
  const s = sections.find((x) => x.slug === slug);
  return s ? s[locale] : "";
}

/** Degree labels. */
export function degreeLabel(degree: 1 | 2, locale: Locale, form: "short" | "programme" | "list" = "short") {
  const az = locale === "az";
  if (form === "programme") {
    return degree === 2 ? (az ? "Magistr proqramı" : "Master's programme") : az ? "Bakalavr proqramı" : "Bachelor's programme";
  }
  if (form === "list") {
    return degree === 2 ? (az ? "Magistr ixtisasları" : "Master's programmes") : az ? "Bakalavr ixtisasları" : "Bachelor's programmes";
  }
  return degree === 2 ? (az ? "Magistr" : "Master's") : az ? "Bakalavr" : "Bachelor's";
}

/** "N ixtisas" / "N programmes" — Azerbaijani nouns stay singular after a numeral. */
export function countLabel(
  n: number,
  locale: Locale,
  noun: "programme" | "faculty" | "department" | "subject" | "credit" | "outcome" | "competency" | "career" | "topic"
) {
  const az: Record<typeof noun, string> = {
    programme: "ixtisas",
    faculty: "fakültə",
    department: "kafedra",
    subject: "fənn",
    credit: "kredit",
    outcome: "nəticə",
    competency: "səriştə",
    career: "karyera istiqaməti",
    topic: "mövzu",
  };
  const en: Record<typeof noun, [string, string]> = {
    programme: ["programme", "programmes"],
    faculty: ["faculty", "faculties"],
    department: ["department", "departments"],
    subject: ["subject", "subjects"],
    credit: ["credit", "credits"],
    outcome: ["outcome", "outcomes"],
    competency: ["competency", "competencies"],
    career: ["career path", "career paths"],
    topic: ["topic", "topics"],
  };
  return locale === "az" ? `${n} ${az[noun]}` : `${n} ${en[noun][n === 1 ? 0 : 1]}`;
}
