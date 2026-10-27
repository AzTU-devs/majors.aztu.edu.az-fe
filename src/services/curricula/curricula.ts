import { apiGet, apiGetAllPages, uniqueBy } from "../../util/apiClient";

export interface Subject {
    /** Immutable identity: use for URLs, React keys and cross-endpoint joins. */
    subject_key: string;
    /** Display code; not unique. */
    subject_code: string;
    subject_name: string;
    semester: number;
    hours_per_week: number;
    status: number;
    year: string;
    credit: number;
}

export interface AssessmentRow {
    form: string;
    description: string;
    score: string;
    ftn: string;
}

export interface SubjectDetails {
    subject_key: string;
    subject_code: string;
    subject_name: string;
    subject_description: string;
    semester: number;
    status: number;
    credit?: number;
    year: string;
    hours_per_week?: number;
    form_of_education?: number | null;
    language_of_instruction?: number | null;
    in_class_hours?: string | null;
    out_of_class_hours?: string;
    teaching_methods?: string | null;
    assessment?: AssessmentRow[];
}

/**
 * Every subject of a programme. [] when the programme has none; rejects with
 * ApiError when the API fails.
 *
 * Reads all pages using the reported total, so no curriculum is truncated by
 * a fixed window.
 */
export const getCurriculaBySpecialtyKey = async (
    specialtyKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Subject[]> => {
    if (!specialtyKey) return [];
    const subjects = await apiGetAllPages<Subject>(
        (start, end) =>
            `/api/curricula/${encodeURIComponent(specialtyKey)}/subjects?start=${start}&end=${end}&lang=${lang_code}`,
        (body) => ({
            items: Array.isArray(body.subjects) ? (body.subjects as Subject[]) : [],
            total: typeof body.total_subjects === "number" ? body.total_subjects : undefined,
        }),
        signal,
    );
    // Keyed by subject_key in lists and joins; a subject assigned twice to the
    // same programme would otherwise collide.
    return uniqueBy(subjects, (s) => s.subject_key);
};

/** One subject's full record, or null when the key is unknown; rejects on API failure. */
export const getSubjectDetails = async (
    subjectKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<SubjectDetails | null> => {
    if (!subjectKey) return null;
    const body = await apiGet<{ subject_details?: SubjectDetails }>(
        `/api/curricula/${encodeURIComponent(subjectKey)}?lang=${lang_code}`,
        signal,
    );
    return body?.subject_details ?? null;
};
