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

    return (
        <div className="min-h-[200px] w-full">
            {/* Results count */}
            {!loading && specialties.length > 0 && (
                <p className="text-[13px] text-[#64748b] mb-4 font-medium">
                    {specialties.length}{" "}
                    {locale === "az" ? "ixtisas tapıldı" : "specialties found"}
                </p>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 animate-pulse"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </div>
                            <div className="h-3 bg-gray-100 rounded w-1/4 ml-12" />
                        </div>
                    ))}
                </div>
            ) : specialties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-[#64748b] dark:text-slate-400">
                    <span className="text-4xl">🔍</span>
                    <p className="font-medium text-[15px]">
                        {locale === "az" ? "Nəticə tapılmadı" : "No results found"}
                    </p>
                    <p className="text-[13px] text-[#94a3b8]">
                        {locale === "az" ? "Axtarış sorğunuzu dəyişin" : "Try a different search term"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specialties.map((specialty, idx) => (
                        <Link
                            key={specialty.specialty_code}
                            href={`/${locale}/bachelor/specialty-details/${specialty.specialty_code}`}
                            className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/25 dark:hover:border-blue-400/25 hover:shadow-md hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-all duration-200 flex items-center gap-3.5"
                        >
                            {/* Index circle */}
                            <div className="w-10 h-10 rounded-full bg-[#182f79]/8 flex items-center justify-center text-[#182f79] text-[12px] font-bold flex-shrink-0 group-hover:bg-[#182f79] group-hover:text-white transition-colors duration-200">
                                {String(idx + 1).padStart(2, "0")}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#1e293b] dark:text-slate-100 text-[14px] leading-snug group-hover:text-[#182f79] dark:group-hover:text-blue-400 transition-colors duration-200">
                                    {specialty.specialty_name}
                                </p>
                                <span className="inline-block mt-1 text-[11px] font-semibold text-[#182f79] border border-[#182f79]/25 bg-[#182f79]/5 px-2 py-0.5 rounded-full">
                                    {specialty.specialty_code}
                                </span>
                            </div>

                            {/* Arrow */}
                            <svg
                                className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#182f79] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
