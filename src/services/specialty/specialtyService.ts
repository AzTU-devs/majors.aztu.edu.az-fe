import { apiGet, apiGetAllPages, uniqueBy } from "../../util/apiClient";

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

/**
 * Every programme of a department. [] when it has none; rejects on API failure.
 *
 * Reads all pages using the reported total (the old fixed 0–200 window would
 * silently drop the rest).
 */
export const getSpecialtiesByCafedraPublic = async (
    cafedraCode: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Specialty[]> => {
    if (!cafedraCode) return [];
    const items = await apiGetAllPages<Specialty>(
        (start, end) =>
            `/api/specialties/${encodeURIComponent(cafedraCode)}?lang=${lang_code}&start=${start}&end=${end}`,
        (body) => ({
            items: Array.isArray(body.specialties) ? (body.specialties as Specialty[]) : [],
            total: typeof body.total === "number" ? body.total : undefined,
        }),
        signal,
    );
    return uniqueBy(items, (s) => s.specialty_key);
};

/**
 * Catalogue listing. [] when nothing matches; rejects on API failure.
 *
 * `facultyCode` is forwarded to the API so the faculty filter narrows the
 * result set server-side instead of being a decorative chip row.
 */
export const getAllSpecialties = async (
    lang_code: string,
    search: string,
    degree?: number,
    facultyCode?: string,
    signal?: AbortSignal,
): Promise<Specialty[]> => {
    const params = new URLSearchParams({ lang: lang_code });
    if (search) params.set("search", search);
    if (degree) params.set("degree", String(degree));
    if (facultyCode) params.set("faculty_code", facultyCode);

    // 204 => no specialties matched; an empty list is the correct answer.
    const body = await apiGet<{ specialties?: Specialty[] }>(
        `/api/specialties?${params.toString()}`,
        signal,
    );
    const list = Array.isArray(body?.specialties) ? body.specialties : [];
    return uniqueBy(list, (s) => s.specialty_key);
};

/**
 * A single programme's display code, name and degree level.
 *
 * Null when the key is unknown; rejects on API failure.
 */
export const getSpecialtyDetails = async (
    specialtyKey: string | undefined,
    lang_code: string,
    signal?: AbortSignal,
): Promise<SpecialtyDetails | null> => {
    if (!specialtyKey) return null;
    const body = await apiGet<{ specialty_code?: string; specialty_name?: string; degree?: number }>(
        `/api/specialty/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`,
        signal,
    );
    if (!body?.specialty_name) return null;
    return {
        specialty_code: body.specialty_code ?? "",
        specialty_name: body.specialty_name,
        degree: body.degree === 2 ? 2 : 1,
    };
};
