import apiClient from "@/util/apiClient";

export interface Tlo {
    id: number;
    topic_code: string;
    tlo_code: string;
    language_code: string;
    tlo_content: string;
}

export const getTloByTopicCode = async (tloCode: string, locale: string) => {
    try {
        const response = await apiClient.get(`/api/tlo/${tloCode}?lang=${locale}`);

        if (response.data.statusCode === 200) {
            return response.data.tlos;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        }
    } catch (err) {
        return "ERROR";
    }
};