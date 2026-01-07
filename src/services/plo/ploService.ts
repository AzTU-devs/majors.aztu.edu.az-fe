import apiClient from "../../util/apiClient";

export interface PloInterface {
    id: number;
    specialty_code: string;
    plo_code: string;
    language_code: string;
    plo_content: string;
}

export interface PloPayload {
    specialty_code: string;
    plo_content: string;
}

export const getPloBySpecialty = async (specialty_code: string, locale: string) => {
    try {
        const response = await apiClient.get(`/api/plo/${specialty_code}?lang=${locale}`);

        if (response.data.statusCode === 200) {
            return response.data.plos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            return "NOT FOUND";
        }
        throw error;
    }
}