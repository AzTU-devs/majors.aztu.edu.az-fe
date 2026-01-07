import apiClient from "../../util/apiClient";

const lang_code = "az";

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

export const getCloBySubjectCode = async (subjectCode: string) => {
    try {
        const response = await apiClient.get(`/api/clo/${subjectCode}?lang=${lang_code}`);

        console.log(response, subjectCode);

        if (response.data.status_code === 200) {
            return response.data.clos;
        } else if (response.data.status_code === 204) {
            return "NO CONTENT";
        }
    } catch (err: any) {
        const status = err.response?.status;
        if (status === 404) {
            return "NOT_FOUND";
        } else {
            return "ERROR";
        }
    }
}