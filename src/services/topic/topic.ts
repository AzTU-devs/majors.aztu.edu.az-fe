import apiClient from "../../util/apiClient";

export interface Topic {
    topic_code: string;
    topic_name: string;
    topic_url: string;
    topic_desc: string;
    topic_result: string;
    topic_type: number;
    created_at?: string;
}

/** Topics of a subject. Always resolves to an array. */
export const getTopics = async (
    subjectCode: string,
    start: number,
    end: number,
    lang_code: string,
): Promise<Topic[]> => {
    if (!subjectCode) return [];
    try {
        const response = await apiClient.get(
            `/api/topic/${encodeURIComponent(subjectCode)}?start=${start}&end=${end}&lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.topics)) {
            return response.data.topics as Topic[];
        }
        return [];
    } catch {
        return [];
    }
};
