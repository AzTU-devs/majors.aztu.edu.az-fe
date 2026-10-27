import { apiGet } from "../../util/apiClient";

export interface SubjectPloMatch {
    subject_key: string;
    plo_code: string;
}

// Returns the list of PLO codes matched to a given subject.
export const getMatchedPlosBySubject = async (
    subjectKey: string,
    signal?: AbortSignal,
): Promise<SubjectPloMatch[]> => {
    if (!subjectKey) return [];
    const body = await apiGet<{ data?: SubjectPloMatch[] }>(
        `/api/match/subject/${encodeURIComponent(subjectKey)}`,
        signal,
    );
    return Array.isArray(body?.data) ? body.data : [];
};
