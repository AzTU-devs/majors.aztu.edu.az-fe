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
                <p className="mb-4 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    {specialties.length}{" "}
                    {locale === "az" ? "ixtisas tapıldı" : "specialties found"}
                </p>
            )}

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[140px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                        />
                    ))}
                </div>
            ) : specialties.length === 0 ? (
                <div className="flex h-52 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="text-4xl">🔍</span>
                    <p className="text-[15px] font-medium">
                        {locale === "az" ? "Nəticə tapılmadı" : "No results found"}
                    </p>
                    <p className="text-[13px] text-slate-400">
                        {locale === "az" ? "Axtarış sorğunuzu dəyişin" : "Try a different search term"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {specialties.map((specialty, idx) => (
                        <Link
                            key={specialty.specialty_code}
                            href={`/${locale}/bachelor/specialty-details/${specialty.specialty_code}`}
                            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#182f79]/8 text-[12px] font-bold text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                    {specialty.specialty_code}
                                </span>
                            </div>

                            <h3 className="flex-1 text-[15px] font-bold leading-snug text-[#0E205B] dark:text-white">
                                {specialty.specialty_name}
                            </h3>

                            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#182f79] transition-all group-hover:gap-2.5 dark:text-blue-400">
                                {locale === "az" ? "Ətraflı bax" : "View details"}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
