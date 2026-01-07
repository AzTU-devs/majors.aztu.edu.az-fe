import apiClient from "../../util/apiClient";

export interface Literature {
    id: number;
    literature_code: string;
    specialty_code: string;
    literature_name: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface LiteraturePayload {
    subject_code: string;
    url: string;
    literature_name: string;
}

export const getLiteratures = async (subjectCode: string) => {
    try {
        const response = await apiClient.get(`/api/literature/specialty/${subjectCode}`);

        if (response.data.statusCode === 200) {
            return {
                "literatures": response.data.literatures,
                "total": response.data.total
            };
        } else if (response.data.statusCode == 204) {
            return "NO CONTENT";
        }
    } catch (err: any) {
        return "ERROR";
    }
}

export const addLiterature = async (literaturePayload: LiteraturePayload) => {
    try {
        const response = await apiClient.post("/api/literature/create", literaturePayload);

        if (response.data.statusCode === 201) {
            return "SUCCESS";
        }
    } catch (err: any) {
        return "ERROR";
    }
}