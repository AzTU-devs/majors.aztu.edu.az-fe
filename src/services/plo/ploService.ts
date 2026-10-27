import { apiGet } from "../../util/apiClient";

export interface PloInterface {
    id: number;
    specialty_key: string;
    plo_code: string;
    language_code: string;
    plo_content: string;
}

export const getPloBySpecialty = async (
    specialtyKey: string,
    locale: string,
    signal?: AbortSignal,
): Promise<PloInterface[]> => {
    if (!specialtyKey) return [];
    const body = await apiGet<{ plos?: PloInterface[] }>(
        `/api/plo/${encodeURIComponent(specialtyKey)}?lang=${locale}`,
        signal,
    );
    return Array.isArray(body?.plos) ? body.plos : [];
};
