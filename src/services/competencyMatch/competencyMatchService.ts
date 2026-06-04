import apiClient from "../../util/apiClient";

export interface SubjectCompetencyMatch {
    subject_code: string;
    competency_code: string;
}

// Returns the subjects matched to a given competency.
export const getMatchedSubjectsByCompetency = async (
    competencyCode: string
): Promise<SubjectCompetencyMatch[]> => {
    try {
        const response = await apiClient.get(`/api/competency-match/competency/${competencyCode}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch {
        return [];
    }
};
