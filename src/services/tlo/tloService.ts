import { apiGet } from "@/util/apiClient";

export interface Tlo {
    id?: number;
    topic_key: string;
    tlo_code: string;
    language_code?: string;
    /** Null when the outcome has no text in the requested language. */
    tlo_content: string | null;
}

/** Topic learning outcomes. [] when none; rejects on API failure. */
export const getTloByTopicKey = async (
    topicKey: string,
    locale: string,
    signal?: AbortSignal,
): Promise<Tlo[]> => {
    if (!topicKey) return [];
    const body = await apiGet<{ tlos?: Tlo[] }>(
        `/api/tlo/topic/${encodeURIComponent(topicKey)}?lang=${locale}`,
        signal,
    );
    // An outcome without a translation would render as an empty bullet.
    return Array.isArray(body?.tlos) ? body.tlos.filter((t) => t.tlo_content?.trim()) : [];
};
