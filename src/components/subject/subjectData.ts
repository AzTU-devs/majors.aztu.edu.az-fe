/**
 * Shared server logic for a subject's pages: loading (with the "is it still
 * part of this programme?" check), per-tab metadata and JSON-LD.
 */
import type { Metadata } from "next";

import { fetchSpecialty, fetchSubject } from "@/lib/api";
import { ownText, subjectInAz, subjectTabStatus } from "@/lib/content";
import { courseSchema, breadcrumbSchema, graph } from "@/lib/jsonld";
import { localeParam } from "@/lib/params";
import { degreeListPath, ogPath, programmePath, safeDecode, subjectPath } from "@/lib/routes";
import { SUBJECT_SECTIONS, degreeLabel, sectionLabel, type SubjectSection } from "@/lib/sections";
import { fitDescription, notFoundMetadata, pageMetadata, unavailableMetadata } from "@/lib/seo";
import { SITE_NAME, type Locale } from "@/lib/site";
import type { SubjectDetails } from "@/services/curricula/curricula";

export { subjectTranslated } from "@/lib/content";

export type SubjectParams = Promise<{ lang: string; specialtyKey: string; subjectKey: string }>;

export async function readSubjectParams(params: SubjectParams) {
  const p = await params;
  return {
    locale: localeParam(p.lang),
    specialtyKey: safeDecode(p.specialtyKey),
    subjectKey: safeDecode(p.subjectKey),
  };
}

/**
 * The subject and its programme, or null when either does not exist — or the
 * subject is no longer part of this programme. Subject keys are shared across
 * programmes (general subjects), so a subject removed from programme A but
 * still taught in B used to keep rendering under /programmes/A/subjects/...
 * The record is this programme's row (its semester, credits and year).
 *
 * Both keys are checked against the cached programme list and curriculum
 * before any per-key read (see fetchSpecialty / fetchSubject). Callers read
 * the subject's other data only after this resolved. Throws when the API is
 * down.
 */
export async function loadSubject(specialtyKey: string, subjectKey: string, locale: Locale) {
  const [specialty, subject] = await Promise.all([
    fetchSpecialty(specialtyKey, locale),
    fetchSubject(subjectKey, locale, specialtyKey),
  ]);
  if (!specialty || !subject) return null;
  return { specialty, subject };
}

/**
 * The subject's description as this page's own text: null when there is
 * none, or when an English page would show the Azerbaijani fallback (then
 * `lang` is "az" for the block that shows it).
 */
export async function subjectDescription(locale: Locale, specialtyKey: string, subjectKey: string, subject: SubjectDetails) {
  const az = locale === "en" ? await subjectInAz(specialtyKey, subjectKey) : null;
  const own = ownText(locale, subject.subject_description, az ? az.subject_description ?? "" : undefined);
  const shown = Boolean(subject.subject_description?.trim());
  return { own, lang: shown && !own ? ("az" as const) : undefined };
}

function describe(locale: Locale, s: SubjectDetails, programme: string | null) {
  const code = s.subject_code ? ` (${s.subject_code})` : "";
  return locale === "az"
    ? `${s.subject_name}${code} fənni${programme ? ` — ${programme} ixtisası` : ""}: sillabus, kredit, mövzu planı, təlim nəticələri və ədəbiyyat siyahısı.`
    : `The ${s.subject_name}${code} course${programme ? ` in the ${programme} programme` : ""}: syllabus, credits, topic plan, learning outcomes and reading list.`;
}

function tabTitle(locale: Locale, slug: SubjectSection, name: string, programme: string | null) {
  const az = locale === "az";
  const of = programme ? ` (${programme})` : "";
  switch (slug) {
    case "":
      return az ? `${name} — fənn haqqında${of}` : `${name} — course overview${of}`;
    case "syllabus":
      return az ? `${name} — sillabus${of}` : `${name} — syllabus${of}`;
    case "topics":
      return az ? `${name} — mövzu planı${of}` : `${name} — topic plan${of}`;
    case "clo-plo-match-table":
      return az ? `${name} — CLO↔PLO uyğunluq matrisi${of}` : `${name} — CLO↔PLO matrix${of}`;
  }
}

function tabDescription(locale: Locale, slug: SubjectSection, s: SubjectDetails, programme: string | null, own: string | null) {
  const az = locale === "az";
  switch (slug) {
    case "":
      return own ? fitDescription(own) : describe(locale, s, programme);
    case "syllabus":
      return az
        ? `${s.subject_name} fənninin tam sillabusu: ümumi məlumat, tədris metodları, təlim nəticələri, mövzu planı, ədəbiyyat və qiymətləndirmə.`
        : `The full syllabus of ${s.subject_name}: general information, teaching methods, learning outcomes, topic plan, reading list and assessment.`;
    case "topics":
      return az
        ? `${s.subject_name} fənninin mövzu planı və hər mövzunun təlim nəticələri.`
        : `The topic plan of ${s.subject_name} and the learning outcomes of each topic.`;
    case "clo-plo-match-table":
      return az
        ? `${s.subject_name} fənninin təlim nəticələrinin${programme ? ` ${programme}` : ""} proqramının təlim məqsədlərinə uyğunluğu.`
        : `How the course outcomes of ${s.subject_name} map onto the${programme ? ` ${programme}` : ""} programme learning outcomes.`;
  }
}

/**
 * generateMetadata for a subject tab: noindex when the tab's main content is
 * empty; canonical to the Azerbaijani page when the English one only shows
 * the Azerbaijani fallback (src/lib/content.ts).
 */
export async function subjectMetadata(params: SubjectParams, slug: SubjectSection): Promise<Metadata> {
  const { locale, specialtyKey, subjectKey } = await readSubjectParams(params);
  const az = locale === "az";
  const loaded = await loadSubject(specialtyKey, subjectKey, locale).catch(() => undefined);
  if (loaded === undefined) return unavailableMetadata(az ? "Fənn" : "Subject");
  if (!loaded) return notFoundMetadata(az ? "Fənn tapılmadı" : "Subject not found");
  const { subject, specialty } = loaded;

  const [status, description] = await Promise.all([
    subjectTabStatus(specialtyKey, subjectKey, slug),
    subjectDescription(locale, specialtyKey, subjectKey, subject),
  ]);
  const programme = specialty.specialty_name;
  return pageMetadata({
    locale,
    path: `/programmes/${encodeURIComponent(specialtyKey)}/subjects/${encodeURIComponent(subjectKey)}${slug ? `/${slug}` : ""}`,
    title: tabTitle(locale, slug, subject.subject_name, programme),
    description: tabDescription(locale, slug, subject, programme, description.own),
    image: ogPath(locale, "subject", specialtyKey, subjectKey, slug),
    translated: status.translated,
    index: !status.empty,
  });
}

/** Course node + this tab's breadcrumb. */
export async function subjectJsonLd(
  locale: Locale,
  specialtyKey: string,
  subjectKey: string,
  subject: SubjectDetails,
  specialty: { specialty_name: string; degree: 1 | 2 },
  slug: SubjectSection
) {
  const programmeName = specialty.specialty_name;
  const path = subjectPath(locale, specialtyKey, subjectKey);
  const crumbs = [
    { name: SITE_NAME[locale], path: `/${locale}` },
    { name: degreeLabel(specialty.degree, locale), path: degreeListPath(locale, specialty.degree) },
    { name: programmeName, path: programmePath(locale, specialtyKey) },
    { name: locale === "az" ? "Tədris planı" : "Curriculum", path: programmePath(locale, specialtyKey, "subjects") },
    { name: subject.subject_name, path },
  ];
  if (slug) crumbs.push({ name: sectionLabel(SUBJECT_SECTIONS, slug, locale), path: subjectPath(locale, specialtyKey, subjectKey, slug) });
  const { own } = await subjectDescription(locale, specialtyKey, subjectKey, subject);

  return graph(
    courseSchema({
      locale,
      name: subject.subject_name,
      code: subject.subject_code,
      path,
      description: own ? fitDescription(own, 300) : describe(locale, subject, programmeName),
      credits: typeof subject.credit === "number" ? subject.credit : null,
      programme: { name: programmeName, path: programmePath(locale, specialtyKey) },
    }),
    breadcrumbSchema(crumbs)
  );
}
