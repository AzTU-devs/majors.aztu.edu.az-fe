import { apiGet } from "../../util/apiClient";

export interface SpecialtyChar {
    id?: number;
    specialty_key: string;
    program_desc: string;
    degree_requirements: string;
}

/** Null when the programme has no characteristics recorded; rejects on API failure. */
export const getSpecialtyChar = async (
    specialtyKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<SpecialtyChar | null> => {
    if (!specialtyKey) return null;
    const body = await apiGet<{ characteristics?: SpecialtyChar[] }>(
        `/api/specialty-characteristics/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`,
        signal,
    );
    return Array.isArray(body?.characteristics) ? (body.characteristics[0] ?? null) : null;
};
