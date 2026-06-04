"use client";

import Head from "next/head";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Literature } from "@/services/literature/literatureService";
import { getLiteratures } from "@/services/literature/literatureService";

export type Locale = "az" | "en";

export default function Literatures({ subjectCode }: { subjectCode: string }) {
    const pathname = usePathname();
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [literatures, setLiteratures] = useState<Literature[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getLiteratures(subjectCode ? subjectCode : "")
            .then((res) => {
                if (typeof res === "object") {
                    setLiteratures(res.literatures);
                } else {
                    setLiteratures([]);
                }
            })
            .finally(() => setLoading(false));
    }, []);

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
                <title>{`${subjectCode} - ${locale === "az" ? "Ədəbiyyatlar" : "Literatures"}`}</title>
            </Head>

            {/* Tab navigation */}
            <nav className="flex flex-wrap justify-center gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.endsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`/${locale}/bachelor/specialty-details/${subjectCode}/${item.href}`}
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
                <p className="text-center text-[#182f79] dark:text-blue-300 font-bold text-[18px] mb-6">
                    {locale === "az" ? "Ədəbiyyatlar" : "Literatures"}
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 animate-pulse flex items-start gap-3.5"
                            >
                                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 flex-shrink-0" />
                                <div className="flex-1">
                                    <Skeleton variant="text" width="80%" height={20} sx={{ bgcolor: "rgba(148,163,184,.2)" }} />
                                    <Skeleton variant="text" width="50%" height={16} style={{ marginTop: 6 }} sx={{ bgcolor: "rgba(148,163,184,.2)" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : literatures && literatures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {literatures.map((literature, index) => (
                            <a
                                key={index}
                                href={literature.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/25 dark:hover:border-blue-400/25 hover:shadow-md hover:bg-blue-50/20 dark:hover:bg-slate-700/20 transition-all duration-200 flex items-start gap-3.5"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#182f79]/8 dark:bg-blue-400/10 flex items-center justify-center text-[#182f79] dark:text-blue-300 text-[11px] font-bold flex-shrink-0 group-hover:bg-[#182f79] group-hover:text-white transition-colors duration-200">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#1e293b] dark:text-slate-100 text-[14px] font-semibold leading-snug group-hover:text-[#182f79] dark:group-hover:text-blue-400 transition-colors duration-200">
                                        {literature.literature_name}
                                    </p>
                                    {literature.url && (
                                        <p className="text-[#2563eb] text-[12px] mt-1 truncate">
                                            {literature.url}
                                        </p>
                                    )}
                                </div>
                                <svg
                                    className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#182f79] flex-shrink-0 mt-0.5 transition-colors duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[#64748b] dark:text-slate-400 py-10 font-medium">
                        {locale === "az" ? "Məzmun tapılmadı" : "No content available"}
                    </div>
                )}
            </section>
        </>
    );
}
