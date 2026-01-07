import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";

export type Locale = "az" | "en";

export default function FacultyCategory() {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        getFaculties(locale)
            .then(setFaculties)
            .finally(() => {
                setLoading(false);
            });
    }, [locale]);
    return (
        <div className="flex justify-start items-center mt-[20px]">
            {faculties.map((faculty, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => setSelectedFaculty(index)}
                        className={`rounded-[20px] py-[5px] px-[10px] mr-[10px] cursor-pointer ${
                            selectedFaculty === index ? "bg-blue-500 text-white" : "bg-white"
                        }`}
                    >
                        {faculty.faculty_code}
                    </div>
                )
            })}
        </div>
    )
}
