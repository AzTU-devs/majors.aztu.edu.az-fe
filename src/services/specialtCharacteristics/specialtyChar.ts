import apiClient from "../../util/apiClient";

export interface SpecialtyChar {
    id?: number;
    specialty_key: string;
    program_desc: string;
    degree_requirements: string;
}

/** Returns null when the programme has no characteristics recorded. */
export const getSpecialtyChar = async (
    specialtyKey: string,
    lang_code: string,
): Promise<SpecialtyChar | null> => {
    try {
        const response = await apiClient.get(
            `/api/specialty-characteristics/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.characteristics)) {
            return (response.data.characteristics[0] as SpecialtyChar) ?? null;
        }
        return null;
    } catch {
        return null;
    }
};
