import { apiGet } from "../../util/apiClient";

export interface SubjectCompetencyMatch {
    subject_key: string;
    competency_code: string;
}

// Returns the subjects matched to a given competency.
export const getMatchedSubjectsByCompetency = async (
    competencyCode: string,
    signal?: AbortSignal,
): Promise<SubjectCompetencyMatch[]> => {
    if (!competencyCode) return [];
    // Encoded: a code containing "/", "#", "?" or a space otherwise hit a
    // different (or no) route.
    const body = await apiGet<{ data?: SubjectCompetencyMatch[] }>(
        `/api/competency-match/competency/${encodeURIComponent(competencyCode)}`,
        signal,
    );
    return Array.isArray(body?.data) ? body.data : [];
};
