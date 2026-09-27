import apiClient from "@/util/apiClient";

export interface Tlo {
    id: number;
    topic_key: string;
    tlo_code: string;
    language_code: string;
    tlo_content: string;
}

/** Topic learning outcomes. Always resolves to an array. */
export const getTloByTopicKey = async (
    topicKey: string,
    locale: string,
): Promise<Tlo[]> => {
    if (!topicKey) return [];
    try {
        const response = await apiClient.get(
            `/api/tlo/topic/${encodeURIComponent(topicKey)}?lang=${locale}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.tlos)) {
            return response.data.tlos as Tlo[];
        }
        return [];
    } catch {
        return [];
    }
};
