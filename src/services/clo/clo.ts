import apiClient from "../../util/apiClient";

export interface Clo {
    subject_key?: string;
    clo_code?: string;
    clo_content: string;
}

/** Course learning outcomes for a subject. Always resolves to an array. */
export const getCloBySubjectKey = async (
    subjectKey: string,
    lang_code: string = "az",
): Promise<Clo[]> => {
    if (!subjectKey) return [];
    try {
        const response = await apiClient.get(
            `/api/clo/${encodeURIComponent(subjectKey)}?lang=${lang_code}`
        );
        if (response.data.status_code === 200 && Array.isArray(response.data.clos)) {
            return response.data.clos as Clo[];
        }
        return [];
    } catch {
        return [];
    }
};
