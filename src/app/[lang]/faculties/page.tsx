"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";

export type Locale = "az" | "en";

export default function Page() {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState<Faculty[]>([]);

    useEffect(() => {
        setLoading(true);
        getFaculties(locale)
            .then((res) => setFaculties(Array.isArray(res) ? res : []))
            .finally(() => setLoading(false));
    }, [locale]);

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="bg-[#182f79] py-[30px] px-[40px]">
                    <h1 className="text-[#fff] text-[25px]">
                        {locale === "az" ? "Fakültələr" : "Faculties"}
                    </h1>
                </section>
                <section className="px-[30px] py-[20px] max-w-6xl mx-auto w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : faculties.length === 0 ? (
                        <p className="text-center text-[#64748b] py-10">
                            {locale === "az" ? "Fakültə tapılmadı" : "No faculties found"}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {faculties.map((faculty) => (
                                <Link
                                    key={faculty.faculty_code}
                                    href={`/${locale}/faculties/${faculty.faculty_code}`}
                                    className="group flex items-center justify-between gap-3 border border-[rgba(0,0,0,0.15)] hover:border-[#182f79] hover:bg-[#182f79] transition-colors duration-200 p-4 rounded-xl bg-white"
                                >
                                    <span className="font-semibold text-[#182f79] group-hover:text-white">
                                        {faculty.faculty_name}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-[#cbd5e1] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
