import apiClient from "../../util/apiClient";

export interface Gco {
    id: number;
    specialty_code: string;
    career_code: string;
    career_title: string;
    language_code: string;
    career_content: string;
}

export interface GcoPayload {
    specialty_code: string;
    career_title: string;
    career_content: string;
}

export const getGcosBySpecailty = async (specialty_code: string, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/gco/${specialty_code}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.gcos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            if (status === 404) {
                return "NOT FOUND";
            } else if (status === 409) {
                return "CONFLICT";
            } else {
                return `ERROR: ${status}`;
            }
        } else {
            return "NETWORK ERROR";
        }
    }
};