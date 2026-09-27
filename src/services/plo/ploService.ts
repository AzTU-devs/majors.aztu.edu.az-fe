import apiClient from "../../util/apiClient";

export interface PloInterface {
    id: number;
    specialty_key: string;
    plo_code: string;
    language_code: string;
    plo_content: string;
}

export const getPloBySpecialty = async (
    specialtyKey: string,
    locale: string,
): Promise<PloInterface[]> => {
    try {
        const response = await apiClient.get(
            `/api/plo/${encodeURIComponent(specialtyKey)}?lang=${locale}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.plos)) {
            return response.data.plos as PloInterface[];
        }
        return [];
    } catch {
        return [];
    }
};
