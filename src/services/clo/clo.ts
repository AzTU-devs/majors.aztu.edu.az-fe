import apiClient from "../../util/apiClient";

export interface CloPayload {
    subject_code: string;
    clo_content: string;
};

export interface Clo {
    clo_content: string;
}

export const createClo = async (cloPayload: CloPayload) => {
    try {
        const response = await apiClient.post('/api/clo/create', cloPayload);
        if (response.data.status_code === 201) {
            return "SUCCESS";
        }
    } catch (error: any) {
        const status = error.response?.status;
        if (status === 404) {
            return "NOT_FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const getCloBySubjectCode = async (
    subjectCode: string,
    lang_code: string = "az"
): Promise<Clo[]> => {
    try {
        const response = await apiClient.get(
            `/api/clo/${encodeURIComponent(subjectCode)}?lang=${lang_code}`
        );

        if (response.data.status_code === 200 && Array.isArray(response.data.clos)) {
            return response.data.clos;
        }
        return [];
    } catch {
        return [];
    }
};
