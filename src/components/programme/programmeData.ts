/**
 * Shared server logic for the programme pages: per-tab metadata, JSON-LD and
 * the context every tab needs. Each tab gets its own title, description,
 * self-canonical and hreflang (they all used to inherit the overview's).
 */
import type { Metadata } from "next";

import {
  fetchCurriculum,
  fetchSpecialties,
  fetchSpecialty,
  fetchSpecialtyCharacteristics,
  orFallback,
} from "@/lib/api";
import { cardContext } from "@/lib/catalogue";
import { characteristicsTexts, charsInAz, ownText, programmeTabStatus } from "@/lib/content";
import { styleFromKey, type FacultyStyle } from "@/lib/hues";
import { breadcrumbSchema, graph, programmeSchema } from "@/lib/jsonld";
import { localeParam } from "@/lib/params";
import { degreeListPath, ogPath, programmePath, safeDecode, subjectPath } from "@/lib/routes";
import { PROGRAMME_SECTIONS, degreeLabel, sectionLabel, type ProgrammeSection } from "@/lib/sections";
import { fitDescription, isTranslated, notFoundMetadata, pageMetadata, unavailableMetadata } from "@/lib/seo";
import { SITE_NAME, UNIVERSITY, type Locale } from "@/lib/site";
import type { SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";

export type ProgrammeParams = Promise<{ lang: string; specialtyKey: string }>;

export interface Programme {
  specialty_code: string;
  specialty_name: string;
  degree: 1 | 2;
}

export async function readParams(params: ProgrammeParams) {
  const { lang, specialtyKey } = await params;
  return { locale: localeParam(lang), key: safeDecode(specialtyKey) };
}

/**
 * The programme's description as this page's own text (null when there is
 * none, or when an English page would show the Azerbaijani fallback), and
 * the `lang` of the description and requirements blocks ("az" for that
 * fallback).
 */
export async function programmeDescription(key: string, locale: Locale, chars: SpecialtyChar | null) {
  const az = locale === "en" ? await charsInAz(key) : null;
  const own = ownText(locale, chars?.program_desc, az ? az.program_desc ?? "" : undefined);
  const texts = characteristicsTexts(chars);
  const azTexts = characteristicsTexts(az);
  const fallback =
    locale === "en" && Boolean(az) && texts.some((t) => t?.trim()) && texts.every((t, i) => !isTranslated(azTexts[i], t));
  return { own, lang: fallback ? ("az" as const) : undefined };
}

/** Department, faculty and hue of a programme (decorative; empty during an outage). */
export async function programmeFacts(key: string, locale: Locale) {
  const [list, ctx] = await Promise.all([orFallback(fetchSpecialties(locale), null), cardContext(locale)]);
  const entry = list?.find((s) => s.specialty_key === key);
  const facultyCode = ctx.index.facultyOf[key];
  const style: FacultyStyle = (facultyCode && ctx.styles[facultyCode]) || styleFromKey(key);
  return {
    cafedra: entry?.cafedra_name ?? null,
    facultyCode: facultyCode ?? null,
    facultyName: facultyCode ? ctx.names[facultyCode] ?? null : null,
    style,
  };
}

function tabCopy(locale: Locale, slug: ProgrammeSection, p: Programme, subjects: number | null) {
  const az = locale === "az";
  const name = p.specialty_name;
  const code = p.specialty_code ? ` (${p.specialty_code})` : "";
  const degreeAz = p.degree === 2 ? "magistr" : "bakalavr";
  const degreeEn = p.degree === 2 ? "master's" : "bachelor's";
  switch (slug) {
    case "":
      return {
        title: az ? `${name} — ${degreeLabel(p.degree, "az")} ixtisası` : `${name} — ${degreeLabel(p.degree, "en")} programme`,
        description: az
          ? `${name}${code} ${degreeAz} təhsil proqramı: tədris planı, fənlər, təlim nəticələri, səriştələr və məzun karyera imkanları — ${UNIVERSITY.nameAz}.`
          : `${name}${code} ${degreeEn} degree programme at ${UNIVERSITY.nameEn}: curriculum, subjects, learning outcomes, competencies and graduate career paths.`,
      };
    case "program-learning-outcomes":
      return {
        title: az ? `${name} — proqram təlim məqsədləri (PLO)` : `${name} — programme learning outcomes (PLO)`,
        description: az
          ? `${name}${code} ${degreeAz} proqramının təlim məqsədləri: məzunun proqramı bitirərkən nümayiş etdirməli olduğu bilik və bacarıqlar.`
          : `Programme learning outcomes of the ${name}${code} ${degreeEn} programme: what a graduate is expected to know and be able to do.`,
      };
    case "subjects":
      return {
        title: az ? `${name} — tədris planı və fənlər` : `${name} — curriculum and subjects`,
        description: az
          ? `${name}${code} ixtisasının tədris planı${subjects ? ` (${subjects} fənn)` : ""}: fənlər, kreditlər, semestrlər və hər fənnin sillabusu.`
          : `The ${name}${code} curriculum${subjects ? ` (${subjects} subjects)` : ""}: subjects, credits, semesters and each subject's syllabus.`,
      };
    case "clo":
      return {
        title: az ? `${name} — fənn təlim nəticələri (CLO)` : `${name} — course learning outcomes (CLO)`,
        description: az
          ? `${name}${code} ixtisasının fənləri üzrə təlim nəticələri: hər fənnin sonunda tələbənin əldə etməli olduğu nəticələr.`
          : `Course learning outcomes across the ${name}${code} curriculum: what a student should achieve by the end of each subject.`,
      };
    case "competency":
      return {
        title: az ? `${name} — səriştələr` : `${name} — competencies`,
        description: az
          ? `${name}${code} proqramının məzununa aşıladığı peşə və ixtisas səriştələri.`
          : `The professional and specialty competencies a graduate of ${name}${code} acquires.`,
      };
    case "competency-match-table":
      return {
        title: az ? `${name} — səriştə uyğunluq matrisi` : `${name} — competency matrix`,
        description: az
          ? `${name}${code} ixtisası üzrə hansı fənnin hansı səriştəyə töhfə verdiyini göstərən uyğunluq cədvəli.`
          : `Which subject of ${name}${code} contributes to which competency — the programme's matching table.`,
      };
    case "graduate-career-opportunities":
      return {
        title: az ? `${name} — məzun karyera imkanları` : `${name} — graduate career paths`,
        description: az
          ? `${name}${code} ixtisasının məzunlarının çalışa biləcəyi sahələr və vəzifələr.`
          : `The fields and roles graduates of ${name}${code} go on to work in.`,
      };
  }
}

/**
 * generateMetadata for a programme tab: noindex when the tab's main content
 * is empty; canonical to the Azerbaijani page when the English one only shows
 * the Azerbaijani fallback (src/lib/content.ts).
 */
export async function programmeMetadata(params: ProgrammeParams, slug: ProgrammeSection): Promise<Metadata> {
  const { locale, key } = await readParams(params);
  const az = locale === "az";
  const specialty = await fetchSpecialty(key, locale).catch(() => undefined);
  if (specialty === undefined) return unavailableMetadata(az ? "İxtisas" : "Programme");
  if (!specialty) return notFoundMetadata(az ? "İxtisas tapılmadı" : "Programme not found");

  const [status, chars, subjects] = await Promise.all([
    programmeTabStatus(key, slug),
    slug === "" ? orFallback(fetchSpecialtyCharacteristics(key, locale), null) : Promise.resolve(null),
    slug === "subjects" ? orFallback(fetchCurriculum(key, locale), null) : Promise.resolve(null),
  ]);
  const copy = tabCopy(locale, slug, specialty, subjects ? subjects.length : null);
  const own = slug === "" ? (await programmeDescription(key, locale, chars)).own : null;

  return pageMetadata({
    locale,
    path: `/programmes/${encodeURIComponent(key)}${slug ? `/${slug}` : ""}`,
    title: copy.title,
    description: own ? fitDescription(own) : copy.description,
    image: ogPath(locale, "programme", key, slug),
    translated: status.translated,
    index: !status.empty,
  });
}

/** JSON-LD for a programme tab: the programme node and this tab's breadcrumb. */
export async function programmeJsonLd(
  locale: Locale,
  key: string,
  specialty: Programme,
  slug: ProgrammeSection,
  extra?: { subjects?: { subject_key: string; subject_code: string; subject_name: string }[] }
) {
  const [chars, facts] = await Promise.all([
    orFallback(fetchSpecialtyCharacteristics(key, locale), null),
    programmeFacts(key, locale),
  ]);
  const path = programmePath(locale, key);
  const { own } = await programmeDescription(key, locale, chars);
  const description = (own && fitDescription(own, 300)) || tabCopy(locale, "", specialty, null).description;
  const crumbs = [
    { name: SITE_NAME[locale], path: `/${locale}` },
    { name: degreeLabel(specialty.degree, locale), path: degreeListPath(locale, specialty.degree) },
    { name: specialty.specialty_name, path },
  ];
  if (slug) crumbs.push({ name: sectionLabel(PROGRAMME_SECTIONS, slug, locale), path: programmePath(locale, key, slug) });

  return graph(
    programmeSchema({
      locale,
      name: specialty.specialty_name,
      code: specialty.specialty_code,
      path,
      degree: specialty.degree,
      description,
      department: facts.cafedra,
      courses: extra?.subjects?.map((s) => ({
        name: s.subject_name,
        code: s.subject_code,
        path: subjectPath(locale, key, s.subject_key),
      })),
    }),
    breadcrumbSchema(crumbs)
  );
}
