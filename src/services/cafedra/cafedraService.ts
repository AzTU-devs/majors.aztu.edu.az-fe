import { apiGet, uniqueBy } from "../../util/apiClient";

export interface Cafedra {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

/**
 * Departments belonging to a faculty. Resolves to [] when the faculty has none
 * (or is unknown); rejects with ApiError when the API fails, so callers can
 * tell an outage from an empty faculty.
 */
export const getCafedrasByFaculty = async (
    facultyCode: string,
    lang: string = "az",
    signal?: AbortSignal,
): Promise<Cafedra[]> => {
    if (!facultyCode) return [];
    const body = await apiGet<{ cafedras?: Cafedra[] }>(
        `/api/cafedras/${encodeURIComponent(facultyCode)}?lang=${lang}`,
        signal,
    );
    const list = Array.isArray(body?.cafedras) ? body.cafedras : [];
    return uniqueBy(list, (c) => c.cafedra_code);
};
