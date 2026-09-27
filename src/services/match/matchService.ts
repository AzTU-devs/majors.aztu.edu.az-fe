import apiClient from "../../util/apiClient";

export interface SubjectPloMatch {
    subject_key: string;
    plo_code: string;
}

// Returns the list of PLO codes matched to a given subject.
export const getMatchedPlosBySubject = async (
    subjectKey: string
): Promise<SubjectPloMatch[]> => {
    try {
        const response = await apiClient.get(`/api/match/subject/${encodeURIComponent(subjectKey)}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch {
        return [];
    }
};
