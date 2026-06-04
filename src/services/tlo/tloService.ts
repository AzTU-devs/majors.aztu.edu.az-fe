import apiClient from "@/util/apiClient";

export interface Tlo {
    id: number;
    topic_code: string;
    tlo_code: string;
    language_code: string;
    tlo_content: string;
}

export const getTloByTopicCode = async (topicCode: string, locale: string): Promise<Tlo[]> => {
    try {
        const response = await apiClient.get(`/api/tlo/topic/${topicCode}?lang=${locale}`);

        if (response.data.statusCode === 200 && Array.isArray(response.data.tlos)) {
            return response.data.tlos;
        }
        return [];
    } catch (err) {
        return [];
    }
};