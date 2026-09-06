import apiClient from "../../util/apiClient";

export interface Literature {
    id: number;
    literature_code: string;
    specialty_code?: string;
    literature_name: string;
    url: string;
    created_at?: string;
    updated_at?: string;
}

/** Reading list for a subject. Always resolves to an array. */
export const getLiteratures = async (subjectCode: string): Promise<Literature[]> => {
    if (!subjectCode) return [];
    try {
        const response = await apiClient.get(
            `/api/literature/subject/${encodeURIComponent(subjectCode)}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.literatures)) {
            return response.data.literatures as Literature[];
        }
        return [];
    } catch {
        return [];
    }
};
