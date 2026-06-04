import apiClient from "../../util/apiClient";

export interface SubjectPloMatch {
    subject_code: string;
    plo_code: string;
}

// Returns the list of PLO codes matched to a given subject.
export const getMatchedPlosBySubject = async (
    subjectCode: string
): Promise<SubjectPloMatch[]> => {
    try {
        const response = await apiClient.get(`/api/match/subject/${subjectCode}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch {
        return [];
    }
};
