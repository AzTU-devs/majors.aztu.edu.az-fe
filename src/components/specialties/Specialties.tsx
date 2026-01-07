import Link from "next/link";
import { Locale } from "../header/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getAllSpecialties, Specialty } from "@/services/specialty/specialtyService";

export default function Specialties({ search }: { search: string }) {
    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([] as Specialty[]);
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getAllSpecialties(locale, search);
                setSpecialties(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error("Error fetching specialties:", err);
                setSpecialties([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, locale]);

    console.log(specialties);

    return (
        <div className="min-h-[200px] w-full flex justify-center items-center">
            {loading ? (
                <ol className="flex flex-col w-full list-decimal list-inside divide-y divide-gray-300">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <li key={index} className="flex justify-start items-center py-2 border-t border-b border-gray-300 p-4 rounded h-[100px]">
                            <div className="h-6 w-full bg-gray-300 rounded animate-pulse" />
                        </li>
                    ))}
                </ol>
            ) : specialties.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[#182f79]">Mövcud deyil</div>
            ) : (
                <ol className="flex flex-wrap justify-between w-[100%] list-decimal list-inside divide-y divide-gray-300">
                    {(specialties || []).map((specialty) => (
                        <li
                            key={specialty.specialty_code}
                            className="flex justify-center items-center border-1 border-gray-200 shadow-md hover:shadow-lg transition-shadow text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] h-[70px] mb-4 w-[50%]"
                        >
                            <Link href={`/${locale}/bachelor/specialty-details/${specialty.specialty_code}`} className="font-bold">
                                {specialty.specialty_name} ({specialty.specialty_code})
                            </Link>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}
