import apiClient from "../../util/apiClient";

export interface SpecialtyCharPayload {
    specialty_code: string;
    program_desc: string;
    degree_requirements: string;
}

export interface SpecialtyChar {
    id: number;
    specialty_code: string;
    program_desc: string;
    degree_requirements: string;
}

export const getSpecialtyChar = async (specialtyCode: string, lang_code: string) => {
    try {
        const response = await apiClient.get(
            `/api/specialty-characteristics/${specialtyCode}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.characteristics[0];
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            return "NOT FOUND";
        }
        return "ERROR";
    }
};