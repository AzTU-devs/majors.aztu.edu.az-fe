import { apiGet } from "../../util/apiClient";

export interface CloPloMatch {
    clo_code: string;
    plo_code: string;
}

// Returns the list of CLO→PLO matches for the CLOs that belong to a subject.
export const getCloPloMatchesBySubject = async (
    subjectKey: string,
    signal?: AbortSignal,
): Promise<CloPloMatch[]> => {
    if (!subjectKey) return [];
    const body = await apiGet<{ data?: CloPloMatch[] }>(
        `/api/clo-plo-match/subject/${encodeURIComponent(subjectKey)}`,
        signal,
    );
    return Array.isArray(body?.data) ? body.data : [];
};
