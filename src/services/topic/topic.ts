import apiClient from "../../util/apiClient";

export interface Topic {
    topic_key: string;
    /** Optional free-text display code; may repeat. */
    topic_code: string | null;
    topic_name: string;
    topic_url: string;
    topic_desc: string;
    topic_result: string;
    topic_type: number;
    created_at?: string;
}

/** Topics of a subject. Always resolves to an array. */
export const getTopics = async (
    subjectKey: string,
    start: number,
    end: number,
    lang_code: string,
): Promise<Topic[]> => {
    if (!subjectKey) return [];
    try {
        const response = await apiClient.get(
            `/api/topic/${encodeURIComponent(subjectKey)}?start=${start}&end=${end}&lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.topics)) {
            return response.data.topics as Topic[];
        }
        return [];
    } catch {
        return [];
    }
};
