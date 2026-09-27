import apiClient from "../../util/apiClient";

export interface Literature {
    id: number;
    literature_code: string;
    subject_key?: string;
    literature_name: string;
    url: string;
    created_at?: string;
    updated_at?: string;
}

/** Reading list for a subject. Always resolves to an array. */
export const getLiteratures = async (subjectKey: string): Promise<Literature[]> => {
    if (!subjectKey) return [];
    try {
        const response = await apiClient.get(
            `/api/literature/subject/${encodeURIComponent(subjectKey)}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.literatures)) {
            return response.data.literatures as Literature[];
        }
        return [];
    } catch {
        return [];
    }
};
