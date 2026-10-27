import { apiGet, uniqueBy } from "../../util/apiClient";

export interface Faculty {
    faculty_code: string;
    faculty_name: string;
}

/**
 * All faculties for a language. [] when there are none; rejects with ApiError
 * when the API fails.
 */
export const getFaculties = async (lang_code: string, signal?: AbortSignal): Promise<Faculty[]> => {
    const body = await apiGet<{ faculties?: Faculty[] }>(`/api/faculties?lang=${lang_code}`, signal);
    const list = Array.isArray(body?.faculties) ? body.faculties : [];
    // Translations are not unique per (faculty, language); a duplicate row
    // would otherwise produce two chips with the same React key.
    return uniqueBy(list, (f) => f.faculty_code);
};
