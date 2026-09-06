import apiClient from "../../util/apiClient";

/** competency_type: 1 = Peşə (job), 2 = İxtisas (specialty/general). */
export interface Competency {
    id: number;
    specialty_code: string;
    competency_code: string;
    competency_type: number;
    language_code: string;
    competency_content: string;
}

export const getCompetencyBySpecialty = async (
    specialtyCode: string,
    lang_code: string,
): Promise<Competency[]> => {
    try {
        const response = await apiClient.get(
            `/api/competency/${encodeURIComponent(specialtyCode)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.competencies)) {
            return response.data.competencies as Competency[];
        }
        return [];
    } catch {
        return [];
    }
};
