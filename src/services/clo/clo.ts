import apiClient from "../../util/apiClient";

export interface Clo {
    clo_code?: string;
    clo_content: string;
}

/** Course learning outcomes for a subject. Always resolves to an array. */
export const getCloBySubjectCode = async (
    subjectCode: string,
    lang_code: string = "az",
): Promise<Clo[]> => {
    if (!subjectCode) return [];
    try {
        const response = await apiClient.get(
            `/api/clo/${encodeURIComponent(subjectCode)}?lang=${lang_code}`
        );
        if (response.data.status_code === 200 && Array.isArray(response.data.clos)) {
            return response.data.clos as Clo[];
        }
        return [];
    } catch {
        return [];
    }
};
