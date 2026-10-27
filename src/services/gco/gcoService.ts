import { apiGet } from "../../util/apiClient";

export interface Gco {
    id: number;
    specialty_key: string;
    career_code: string;
    career_title: string;
    language_code: string;
    career_content: string;
}

export const getGcosBySpecailty = async (
    specialtyKey: string,
    lang_code: string,
    signal?: AbortSignal,
): Promise<Gco[]> => {
    if (!specialtyKey) return [];
    const body = await apiGet<{ gcos?: Gco[] }>(
        `/api/gco/${encodeURIComponent(specialtyKey)}?lang=${lang_code}`,
        signal,
    );
    return Array.isArray(body?.gcos) ? body.gcos : [];
};
