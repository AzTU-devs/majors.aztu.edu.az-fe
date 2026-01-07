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
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        getLiteratures(subjectCode ? subjectCode : "")
            .then((res) => {
                if (typeof res === "object") {
                    setLiteratures(res.literatures);
                    setTotal(res.total);
                } else {
                    setLiteratures([]);
                    setTotal(0);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
    ];

    console.log(subjectCode);

    return (
        <>
            <Head>
                <title>{`${specialtyName} (${subjectCode}) - ${locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}`}</title>
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
                            href={`/${locale}/bachelor/specialty-details/${subjectCode}/${item.href}`}
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
                    {/* <div className="flex justify-center items-center text-[#182f79] text-[20px] font-bold mt-[40px]">
                        {loading ? <Skeleton width={200} /> : `${specialtyName} (${specialtyCode})`}
                    </div> */}
                    <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                        {locale === "az" ? "Ədəbiyyatlar" : "Literatures"}
                    </h2>
                    {loading ? (
                        <div className="mt-4 w-full flex flex-wrap justify-between">
                            {[...Array(4)].map((_, index) => (
                                <div
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md border-t-4 text-[#182f79] p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="rectangular" width="100%" height={20} className="mt-2" />
                                </div>
                            ))}
                        </div>
                    ) : literatures && literatures.length > 0 ? (
                        <ol className="mt-4 flex flex-wrap justify-between list-decimal list-inside w-full">
                            {literatures.map((literature, index) => (
                                <li
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <div className="flex-1 font-bold flex justify-center items-center text-center">
                                        <a href={literature.url} target="_blank">
                                            {literature.literature_name}
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <div className="text-gray-500 mt-6 text-center w-full">
                            {locale === "az" ? "Məzmun tapılmadı" : "No content available"}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
 