"use client";

import Link from "next/link";
import Head from "next/head";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";
import { Competency, getCompetencyBySpecialty } from "@/services/competency/competencyService";

export type Locale = "az" | "en";

export default function Compentency({ specialtyCode }: { specialtyCode: string }) {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getSpecialtyDetails(specialtyCode, locale).then(setSpecialtyName),
            getCompetencyBySpecialty(specialtyCode ? specialtyCode : "", locale).then(setCompetencies),
        ]).finally(() => setLoading(false));
    }, [locale, specialtyCode]);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
    ];

    return (
        <>
            <Head>
                <title>{`${specialtyName} (${specialtyCode}) - ${locale === "az" ? "Səriştələr" : "Competencies"}`}</title>
            </Head>

            {/* Tab navigation */}
            <nav className="flex flex-wrap justify-center gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.endsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/${item.href}`}
                            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border ${
                                isActive
                                    ? "bg-[#182f79] text-white border-[#182f79] shadow-sm"
                                    : "bg-white dark:bg-slate-800 text-[#64748b] dark:text-slate-400 border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/30 dark:hover:border-blue-400/30 hover:text-[#182f79] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-700/50"
                            }`}
                        >
                            {locale === "az" ? item.az : item.en}
                        </Link>
                    );
                })}
            </nav>

            <section className="py-6 px-4 md:px-8 w-full">
                <p className="text-center text-[#182f79] font-bold text-[18px] mb-6">
                    {locale === "az" ? "Səriştələr" : "Competencies"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 animate-pulse flex items-start gap-3.5"
                            >
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="flex-1">
                                    <Skeleton variant="text" width="90%" height={20} />
                                    <Skeleton variant="text" width="70%" height={20} style={{ marginTop: 4 }} />
                                </div>
                            </div>
                        ))
                    ) : competencies.length === 0 ? (
                        <div className="col-span-2 text-center text-[#64748b] dark:text-slate-400 py-10 font-medium">
                            {locale === "az" ? "Mövcud deyil" : "Not available"}
                        </div>
                    ) : (
                        competencies.map((competency, index) => (
                            <div
                                key={index}
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/25 dark:hover:border-blue-400/25 hover:shadow-md hover:bg-blue-50/20 dark:hover:bg-slate-700/20 transition-all duration-200 flex items-start gap-3.5"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#182f79]/8 flex items-center justify-center text-[#182f79] text-[11px] font-bold flex-shrink-0 group-hover:bg-[#182f79] group-hover:text-white transition-colors duration-200">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <p className="text-[#1e293b] dark:text-slate-100 text-[14px] leading-relaxed font-medium flex-1">
                                    {competency.competency_content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
