import apiClient from "../../util/apiClient";

export interface Cafedra {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

/** Departments belonging to a faculty. Always resolves to an array. */
export const getCafedrasByFaculty = async (
    facultyCode: string,
    lang: string = "az",
): Promise<Cafedra[]> => {
    if (!facultyCode) return [];
    try {
        const response = await apiClient.get(
            `/api/cafedras/${encodeURIComponent(facultyCode)}?lang=${lang}`
        );
        // This endpoint reports its status as `status_code`.
        const body = response.data;
        const ok = body?.status_code === 200 || body?.statusCode === 200;
        if (ok && Array.isArray(body.cafedras)) {
            return body.cafedras as Cafedra[];
        }
        return [];
    } catch {
        return [];
    }
};
