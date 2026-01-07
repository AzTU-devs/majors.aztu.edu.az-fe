"use client";

import Head from "next/head";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { Slo } from "@/services/slo/sloService";
import { getSloBySpecialty } from "@/services/slo/sloService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export default function Plo({ specialtyCode }: { specialtyCode: string }) {
    const pathname = usePathname();
    const [slos, setSlos] = useState<Slo[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    console.log(pathname);

    useEffect(() => {
        setLoading(true);
        getSpecialtyDetails(specialtyCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false)
            });
        getSloBySpecialty(specialtyCode ? specialtyCode : "", locale)
            .then(setSlos)
            .finally(() => {
                setLoading(false);
            });
    }, [locale]);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
    ];

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
                    const isActive = pathname.endsWith(item.href); // check if current path matches
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
            <section className="py-[10px] px-[30px] flex flex-col justify-between items-center w-full">
                <div className="w-[100%] flex flex-col items-center ju">
                    <div className="flex justify-center items-center text-[#182f79] text-[20px] font-bold mt-[40px]">
                        {loading ? <Skeleton width={250} height={32} /> : `${specialtyName} (${specialtyCode})`}
                    </div>
                    {loading ? (
                        <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                            <Skeleton width={300} height={28} />
                        </h2>
                    ) : (
                        <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                            {locale === "az" ? "Tələbərin təlim nəticələri" : "Student learning outcomes"}
                        </h2>
                    )}
                    <ol className="mt-4 flex flex-wrap justify-between list-decimal list-inside w-full">
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <li
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md border-t-4 text-[#182f79] p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <Skeleton variant="text" width="90%" height={32} />
                                    <Skeleton variant="text" width="60%" height={22} style={{ marginTop: 8 }} />
                                </li>
                            ))
                            : slos.map((slo, index) => (
                                <li
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <div className="flex-1 font-bold flex justify-center items-center text-center">
                                        {slo.slo_content}
                                    </div>
                                </li>
                            ))}
                    </ol>
                </div>
            </section>
        </>
    )
}
