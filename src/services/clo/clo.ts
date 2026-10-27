import { apiGet } from "../../util/apiClient";

export interface Clo {
    subject_key?: string;
    clo_code?: string;
    clo_content: string;
}

/** Course learning outcomes for a subject. [] when none; rejects on API failure. */
export const getCloBySubjectKey = async (
    subjectKey: string,
    lang_code: string = "az",
    signal?: AbortSignal,
): Promise<Clo[]> => {
    if (!subjectKey) return [];
    const body = await apiGet<{ clos?: Clo[] }>(
        `/api/clo/${encodeURIComponent(subjectKey)}?lang=${lang_code}`,
        signal,
    );
    return Array.isArray(body?.clos) ? body.clos : [];
};
