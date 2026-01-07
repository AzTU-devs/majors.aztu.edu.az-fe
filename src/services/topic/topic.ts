import apiClient from "../../util/apiClient";

export interface Topic {
    topic_code: string;
    topic_name: string;
    topic_url: string;
    topic_desc: string;
    topic_result: string;
    topic_type: number;
    created_at: string;
}

export const getTopics = async (subjectCode: string, start: number, end: number, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/topic/${subjectCode}?start=${start}&end=${end}&lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return {
                topics: response.data.topics,
                total: response.data.total
            };
        }

        if (response.status === 204) {
            return {
                topics: [],
                total: 0
            };
        }

    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return "NOT_FOUND";
            }
            if (error.response.status === 204) {
                return {
                    topics: [],
                    total: 0
                };
            }
        }
        return "ERROR";
    }
};