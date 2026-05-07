import apiClient from "../../util/apiClient";
const lang_code = "az";

export interface Cafedra {
    faculty_code: string;
    cafedra_code: string;
    cafedra_name: string;
}

// get all cafedras for language az

export const getCafedras = async () => {
    try {
        const response = await apiClient.get(`/api/cafedras?lang_code=${lang_code}`);

        const statusCode = response.data.statusCode;

        if (statusCode === 200) {
            return response.data.cafedras;
        } else if (response.status === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (e) {
        return "ERROR";
    }
}

export const getCafedrasByFaculty = async (
    faculty_code: string,
    lang: string = lang_code,
) => {
    try {
        const response = await apiClient.get(`/api/cafedras/${faculty_code}?lang=${lang}`);

        if (response.data.status_code === 200) {
            return response.data.cafedras;
        } else {
            return "NOT FOUND";
        }
    } catch (e) {
        return "ERROR";
    }
};