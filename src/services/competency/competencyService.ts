import { apiGet } from "../../util/apiClient";

/** competency_type: 1 = Peşə (job), 2 = İxtisas (specialty/general). */
export interface Competency {
    id: number;
    specialty_key: string;
    competency_code: string;
    competency_type: number;
    language_code: string;
    competency_content: string;
}

export const getCompetencyBySpecialty = async (
    specialtyKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Competency[]> => {
    if (!specialtyKey) return [];
    const body = await apiGet<{ competencies?: Competency[] }>(
        `/api/competency/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`,
        signal,
    );
    return Array.isArray(body?.competencies) ? body.competencies : [];
};
