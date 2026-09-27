import apiClient from "../../util/apiClient";

export interface Specialty {
    cafedra_name?: string;
    specialty_name: string;
    /** Immutable identity: use for URLs and React keys. */
    specialty_key: string;
    /** Display code; not unique. */
    specialty_code: string;
    degree?: number;
}

export interface SpecialtyPayload {
    cafedra_code: string;
    specialty_name: string;
    specialty_code: string;
}

export interface SpecialtyDetails {
    specialty_code: string;
    specialty_name: string;
    /** 1 = bachelor, 2 = master. */
    degree: 1 | 2;
}

export const getSpecialtiesByCafedraPublic = async (
    cafedraCode: string,
    lang_code: string,
    start: number = 0,
    end: number = 100,
): Promise<Specialty[]> => {
    try {
        const response = await apiClient.get(
            `/api/specialties/${encodeURIComponent(cafedraCode)}?lang=${lang_code}&start=${start}&end=${end}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.specialties)) {
            return response.data.specialties as Specialty[];
        }
        return [];
    } catch {
        return [];
    }
};

/**
 * Catalogue listing.
 *
 * `facultyCode` is forwarded to the API so the faculty filter narrows the
 * result set server-side instead of being a decorative chip row.
 */
export const getAllSpecialties = async (
    lang_code: string,
    search: string,
    degree?: number,
    facultyCode?: string,
): Promise<Specialty[]> => {
    try {
        const params = new URLSearchParams({ lang: lang_code });
        if (search) params.set("search", search);
        if (degree) params.set("degree", String(degree));
        if (facultyCode) params.set("faculty_code", facultyCode);

        const response = await apiClient.get(`/api/specialties?${params.toString()}`);
        if (response.data.statusCode === 200 && Array.isArray(response.data.specialties)) {
            return response.data.specialties as Specialty[];
        }
        // 204 => no specialties matched; an empty list is the correct answer.
        return [];
    } catch {
        return [];
    }
};

/**
 * A single programme's display code, name and degree level.
 *
 * Returns null when the key is unknown. The previous version returned the
 * sentinel strings "ERROR" / "NOT FOUND", which callers then rendered as the
 * page's <h1>.
 */
export const getSpecialtyDetails = async (
    specialtyKey: string | undefined,
    lang_code: string,
): Promise<SpecialtyDetails | null> => {
    if (!specialtyKey) return null;
    try {
        const response = await apiClient.get(
            `/api/specialty/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && response.data.specialty_name) {
            return {
                specialty_code: response.data.specialty_code ?? "",
                specialty_name: response.data.specialty_name,
                degree: response.data.degree === 2 ? 2 : 1,
            };
        }
        return null;
    } catch {
        return null;
    }
};
