import apiClient from "../../util/apiClient";

export interface Faculty {
    faculty_code: string;
    faculty_name: string;
}

/**
 * All faculties for a language.
 *
 * Always resolves to an array — the previous version returned `undefined` for
 * any non-200 body and had no catch, so a failed request rejected inside the
 * caller's `.then()` chain.
 */
export const getFaculties = async (lang_code: string): Promise<Faculty[]> => {
    try {
        const response = await apiClient.get(`/api/faculties?lang=${lang_code}`);
        // The faculties endpoint reports its status as `status` (not `statusCode`).
        if (response.data?.status === 200 && Array.isArray(response.data.faculties)) {
            return response.data.faculties as Faculty[];
        }
        return [];
    } catch {
        return [];
    }
};
