/**
 * Server-side API access.
 *
 * The client components use axios (`src/util/apiClient.ts`); this module exists
 * so server components, `generateMetadata` and the sitemap can read the same
 * data with Next's fetch cache. Every helper degrades to an empty result rather
 * than throwing, so a slow or unreachable API can never turn a page into a 500.
 */

import { API_BASE_URL } from "@/util/apiClient";
import type { Locale } from "./site";

/** Cache window for catalogue data, which changes rarely. */
const REVALIDATE_SECONDS = 60 * 30;

async function getJson<T>(path: string, fallback: T, revalidate = REVALIDATE_SECONDS): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export interface SpecialtySummary {
  /** Immutable identity: use for URLs, React keys and de-duplication. */
  specialty_key: string;
  /** Display code; not unique. */
  specialty_code: string;
  specialty_name: string;
  cafedra_name?: string;
  degree?: number;
}

export interface FacultySummary {
  faculty_code: string;
  faculty_name: string;
}

export interface SubjectSummary {
  /** Immutable identity: use for URLs and React keys. */
  subject_key: string;
  /** Display code; not unique. */
  subject_code: string;
  subject_name: string;
  semester?: number;
  credit?: number;
  status?: number;
  year?: string;
}

export async function fetchSpecialties(
  locale: Locale,
  degree?: 1 | 2
): Promise<SpecialtySummary[]> {
  const degreeQuery = degree ? `&degree=${degree}` : "";
  const data = await getJson<{ statusCode?: number; specialties?: SpecialtySummary[] }>(
    `/api/specialties?lang=${locale}&search=${degreeQuery}`,
    {}
  );
  return Array.isArray(data.specialties) ? data.specialties : [];
}

export async function fetchFaculties(locale: Locale): Promise<FacultySummary[]> {
  const data = await getJson<{ status?: number; faculties?: FacultySummary[] }>(
    `/api/faculties?lang=${locale}`,
    {}
  );
  return Array.isArray(data.faculties) ? data.faculties : [];
}

export async function fetchSpecialty(
  key: string,
  locale: Locale
): Promise<{ specialty_code: string; specialty_name: string; degree: 1 | 2 } | null> {
  const data = await getJson<{
    statusCode?: number;
    specialty_code?: string;
    specialty_name?: string;
    degree?: number;
  }>(`/api/specialty/${encodeURIComponent(key)}?lang=${locale}`, {});
  if (!data.specialty_name) return null;
  return {
    specialty_code: data.specialty_code ?? "",
    specialty_name: data.specialty_name,
    degree: data.degree === 2 ? 2 : 1,
  };
}

export async function fetchSubject(
  key: string,
  locale: Locale
): Promise<{ subject_code: string; subject_name: string; subject_description?: string } | null> {
  const data = await getJson<{
    statusCode?: number;
    subject_details?: { subject_code?: string; subject_name?: string; subject_description?: string };
  }>(`/api/curricula/${encodeURIComponent(key)}?lang=${locale}`, {});
  const details = data.subject_details;
  if (!details?.subject_name) return null;
  return {
    subject_code: details.subject_code ?? "",
    subject_name: details.subject_name,
    subject_description: details.subject_description,
  };
}

export async function fetchCurriculum(
  specialtyKey: string,
  locale: Locale
): Promise<SubjectSummary[]> {
  const data = await getJson<{ statusCode?: number; subjects?: SubjectSummary[] }>(
    `/api/curricula/${encodeURIComponent(specialtyKey)}/subjects?start=0&end=400&lang=${locale}`,
    {}
  );
  return Array.isArray(data.subjects) ? data.subjects : [];
}
