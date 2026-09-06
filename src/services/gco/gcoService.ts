import apiClient from "../../util/apiClient";

export interface Gco {
    id: number;
    specialty_code: string;
    career_code: string;
    career_title: string;
    language_code: string;
    career_content: string;
}

export const getGcosBySpecailty = async (
    specialtyCode: string,
    lang_code: string,
): Promise<Gco[]> => {
    try {
        const response = await apiClient.get(
            `/api/gco/${encodeURIComponent(specialtyCode)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.gcos)) {
            return response.data.gcos as Gco[];
        }
        return [];
    } catch {
        return [];
    }
};
