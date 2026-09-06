import apiClient from "../../util/apiClient";

export interface SpecialtyChar {
    id?: number;
    specialty_code: string;
    program_desc: string;
    degree_requirements: string;
}

/** Returns null when the programme has no characteristics recorded. */
export const getSpecialtyChar = async (
    specialtyCode: string,
    lang_code: string,
): Promise<SpecialtyChar | null> => {
    try {
        const response = await apiClient.get(
            `/api/specialty-characteristics/${encodeURIComponent(specialtyCode)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.characteristics)) {
            return (response.data.characteristics[0] as SpecialtyChar) ?? null;
        }
        return null;
    } catch {
        return null;
    }
};
