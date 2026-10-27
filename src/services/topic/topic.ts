import { apiGetAllPages, uniqueBy } from "../../util/apiClient";

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

/**
 * Every topic of a subject. [] when none; rejects on API failure.
 *
 * Reads all pages: a single 0–200 window silently dropped the rest.
 */
export const getTopics = async (
    subjectKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Topic[]> => {
    if (!subjectKey) return [];
    const topics = await apiGetAllPages<Topic>(
        (start, end) =>
            `/api/topic/${encodeURIComponent(subjectKey)}?start=${start}&end=${end}&lang=${lang_code}`,
        (body) => ({
            items: Array.isArray(body.topics) ? (body.topics as Topic[]) : [],
            total: typeof body.total === "number" ? body.total : undefined,
        }),
        signal,
    );
    return uniqueBy(topics, (t) => t.topic_key);
};
