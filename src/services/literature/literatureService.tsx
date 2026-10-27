import { apiGetAllPages } from "../../util/apiClient";

export interface Literature {
    id: number;
    literature_code: string;
    subject_key?: string;
    /** Null when the entry has no title in the requested language. */
    literature_name: string | null;
    url: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Reading list for a subject. [] when none; rejects on API failure.
 *
 * The endpoint defaults to the first 10 rows and to Azerbaijani, so without
 * paging and `lang` long reading lists were cut off and English pages showed
 * Azerbaijani titles.
 */
export const getLiteratures = async (
    subjectKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Literature[]> => {
    if (!subjectKey) return [];
    return apiGetAllPages<Literature>(
        (start, end) =>
            `/api/literature/subject/${encodeURIComponent(subjectKey)}?start=${start}&end=${end}&lang=${lang_code}`,
        (body) => ({
            items: Array.isArray(body.literatures) ? (body.literatures as Literature[]) : [],
            total: typeof body.total === "number" ? body.total : undefined,
        }),
        signal,
    );
};
