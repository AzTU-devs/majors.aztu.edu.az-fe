import apiClient from "../../util/apiClient";

export interface Subject {
    subject_code: string;
    subject_name: string;
    semester: number;
    hours_per_week: number;
    status: number;
    year: string;
    credit: number
};

export interface SubjectPayload {
    specialty_code: string;
    subject_code: string;
    subject_name: string;
    semester: number;
    status: number;
    credit?: number;
    year: string;
    hours_per_week?: number;
};

export interface AssessmentRow {
    form: string;
    description: string;
    score: string;
    ftn: string;
}

export interface SubjectDetails {
    subject_code: string;
    subject_name: string;
    subject_description: string;
    semester: number;
    status: number;
    credit?: number;
    year: string;
    hours_per_week?: number;
    form_of_education?: number | null;
    language_of_instruction?: number | null;
    in_class_hours?: string | null;
    out_of_class_hours?: string;
    teaching_methods?: string | null;
    assessment?: AssessmentRow[];
};

export const getCurriculaBySpecialtyCode = async (specialtyCode: string, start: number, end: number, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/curricula/${specialtyCode}/subjects?start=${start}&end=${end}&lang=${lang_code}`);
        if (response.data.statusCode === 200) {
            return {
                "subjects": response.data.subjects,
                "total_subjects": response.data.total
            }
        } else {
            return "ERROR";
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}

export const getSubjectDetails = async (subjectCode: string, lang_code: string) => {
    try {
        const response = await apiClient.get(`/api/curricula/${subjectCode}?lang=${lang_code}`);

        if (response.data.statusCode === 200) {
            return response.data.subject_details;
        }
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            return "NOT FOUND";
        } else {
            return "ERROR";
        }
    }
}