import apiClient from "../../util/apiClient";

export interface Specialty {
    cafedra_name: string;
    specialty_name: string;
    specialty_code: string;
}

export interface SpecialtyPayload {
    cafedra_code: string;
    specialty_name: string;
    specialty_code: string;
}

export const getSpecialtiesByCafedra = async (cafedraCode: string, token: string, start: number, end: number, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/specialties/${cafedraCode}?lang=${lang_code}&start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.statusCode === 200) {
            return {
                "specialties": response.data.specialties,
                "total_specialties": response.data.total
            };
        } else if (response.data.statusCode === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
}

export const getSpecialtiesByCafedraPublic = async (
    cafedraCode: string,
    lang_code: string,
    start: number = 0,
    end: number = 100,
) => {
    try {
        const response = await apiClient.get(
            `/api/specialties/${cafedraCode}?lang=${lang_code}&start=${start}&end=${end}`
        );

        if (response.data.statusCode === 200) {
            return response.data.specialties as Specialty[];
        }
        return [] as Specialty[];
    } catch (err) {
        return [] as Specialty[];
    }
};

export const getAllSpecialties = async (lang_code: string, search: string) => {
    try {
        const response = await apiClient.get(`/api/specialties?lang_code=${lang_code}&search=${search}`);
        if (response.data.statusCode === 200) {
            return response.data.specialties;
        } else if (response.data.statusCode === 204) {
            return "NO CONTENT";
        } else {
            return "ERROR";
        }
    } catch (err) {
        return "ERROR";
    }
};

export const getSpecialtyDetails = async (specialtyode: string | undefined, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/specialty/${specialtyode}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.specialty_name;
        } else {
            return "ERROR";
        }
    } catch (e: any) {
        if (e.response) {
            if (e.response.status === 404) {
                return "NOT FOUND";
            } else if (e.response.status === 409) {
                return "CONFLICT";
            }
        }
    }
}