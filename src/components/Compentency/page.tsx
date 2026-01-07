"use client";

import Link from "next/link";
import Head from "next/head";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
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
            getCompetencyBySpecialty(specialtyCode ? specialtyCode : "", locale).then(setCompetencies)
        ]).finally(() => {
            setLoading(false);
        });
    }, [locale, specialtyCode]);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
    ];

    console.log(competencies);

    return (
        <>
            <Head>
                <title>{`${specialtyName} (${specialtyCode}) - ${locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}`}</title>
                <meta
                    name="description"
                    content={`${locale === "az" ? "Tələbələr üçün proqram təlim məqsədləri" : "Program learning outcomes for students"}: ${specialtyName}`}
                />
            </Head>
            <nav className="flex flex-wrap justify-center gap-3">
                {navItems.map((item) => {
                    const isActive = pathname.endsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/${item.href}`}
                            className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 transition ${isActive ? "bg-[#182f79] text-white" : "hover:bg-[#182f79] hover:text-white"
                                }`}
                        >
                            {locale === "az" ? item.az : item.en}
                        </Link>
                    );
                })}
            </nav>
            <section className="py-[10px] px-[30px] flex justify-between items-center w-full">
                <main className="w-[100%] flex flex-col justify-center items-center">
                    <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                        {locale === "az" ? "Səriştələr" : "Competencies"}
                    </h2>
                    <ol className="mt-4 flex flex-wrap list-decimal justify-between list-inside w-full">
                        {loading ? (
                            // Show 4 skeleton items as placeholders
                            Array.from({ length: 4 }).map((_, idx) => (
                                <li
                                    key={idx}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <div className="flex-1 font-bold flex flex-col justify-center items-center text-center">
                                        <Skeleton variant="text" width="80%" height={28} />
                                        <Skeleton variant="text" width="60%" height={18} style={{ marginTop: 8 }} />
                                    </div>
                                </li>
                            ))
                        ) : competencies.length === 0 ? (
                            <li className="w-full text-center text-[#182f79] font-semibold py-6">
                                {locale === "az" ? "Mövcud deyil" : "Not available"}
                            </li>
                        ) : (
                            competencies.map((competencty, index) => (
                                <li
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <div className="flex-1 font-bold flex justify-center items-center text-center">
                                        {competencty.competency_content}
                                    </div>
                                </li>
                            ))
                        )}
                    </ol>
                </main>
            </section>
        </>
    )
}
