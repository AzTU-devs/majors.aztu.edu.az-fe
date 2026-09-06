import apiClient from "../../util/apiClient";

export interface Subject {
    subject_code: string;
    subject_name: string;
    semester: number;
    hours_per_week: number;
    status: number;
    year: string;
    credit: number;
}

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
}

/** All subjects of a programme. Always resolves to an array. */
export const getCurriculaBySpecialtyCode = async (
    specialtyCode: string,
    start: number,
    end: number,
    lang_code: string,
): Promise<Subject[]> => {
    try {
        const response = await apiClient.get(
            `/api/curricula/${encodeURIComponent(specialtyCode)}/subjects?start=${start}&end=${end}&lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && Array.isArray(response.data.subjects)) {
            return response.data.subjects as Subject[];
        }
        return [];
    } catch {
        return [];
    }
};

/** One subject's full record, or null when the code is unknown. */
export const getSubjectDetails = async (
    subjectCode: string,
    lang_code: string,
): Promise<SubjectDetails | null> => {
    if (!subjectCode) return null;
    try {
        const response = await apiClient.get(
            `/api/curricula/${encodeURIComponent(subjectCode)}?lang=${lang_code}`
        );
        if (response.data.statusCode === 200 && response.data.subject_details) {
            return response.data.subject_details as SubjectDetails;
        }
        return null;
    } catch {
        return null;
    }
};
