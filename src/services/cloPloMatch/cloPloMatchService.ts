import apiClient from "../../util/apiClient";

export interface CloPloMatch {
    clo_code: string;
    plo_code: string;
}

// Returns the list of CLO→PLO matches for the CLOs that belong to a subject.
export const getCloPloMatchesBySubject = async (
    subjectCode: string
): Promise<CloPloMatch[]> => {
    try {
        const response = await apiClient.get(
            `/api/clo-plo-match/subject/${encodeURIComponent(subjectCode)}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch {
        return [];
    }
};
