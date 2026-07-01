"use client";

import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getTloByTopicCode, Tlo } from "@/services/tlo/tloService";

export type Locale = "az" | "en";

const defaultSubLos = [
    {
        "az": "Kompüter arxitekturasının əsasları",
        "en": "Fundamentals of Computer Architecture"
    }, {
        "az": "Onlar müxtəlif dillərdə proqramlaşdırmanın əsasları, həmçinin məlumat strukturları və alqoritmləri başa düşəcəklər.",
        "en": "They will have knowledge of programming basics in various languages, as well as understanding data structures and algorithms."
    }, {
        "az": "Tələbələr əməliyyat sistemləri ilə işləməyi öyrənəcək və proqram və aparatla qarşılıqlı əlaqə prinsiplərini başa düşəcəklər.",
        "en": "Students will learn to work with operating systems and understand the principles of program and hardware interaction."
    }, {
        "az": "Kompüter şəbəkələri",
        "en": "Computer Networks"
    }, {
        "az": "Rəqəmsal Elektronika",
        "en": "Digital Electronics"
    }, {
        "az": "Tələbələr əldə etdikləri bilikləri sadə kompüter sistemləri və proqram təminatının layihələndirilməsi və inkişaf etdirilməsi üçün tətbiq edə biləcəklər.",
        "en": "Students will be able to apply their knowledge to design and develop simple computer systems and software applications."
    }, {
        "az": "Problem həll etmə və analitik bacarıqlar",
        "en": "Problem-solving and Analytical Skills"
    }, {
        "az": "İnformasiyanı tənqidi qiymətləndirmək və təhlil etmək, həmçinin kompüter mühəndisliyi sahəsində əsaslı qərarlar qəbul etməyi bacaracaq",
        "en": "Will be able to critically evaluate and analyze information, as well as make well-founded decisions in the field of computer engineering"
    }
];

export default function Tlos({ specialtyCode, topicCode }: { specialtyCode: string, topicCode: string }) {
    const pathname = usePathname();
    const [tlos, setTlos] = useState<Tlo[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [subLos, setSubLos] = useState(defaultSubLos);

    useEffect(() => {
        setLoading(true);
        getTloByTopicCode(topicCode, locale)
            .then((res) => setTlos(Array.isArray(res) ? res : []))
            .finally(() => {
                setLoading(false);
            });
        setSubLos(defaultSubLos);
    }, [locale, topicCode]);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
        { href: "subject-match-table", az: "Fənnin uyğunluq cədvəli", en: "Subjects' matching table" },
    ];

    return (
        <>
            <Head>
                <title>{`${specialtyName} (${topicCode}) - ${locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}`}</title>
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
                            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/PR001/${item.href}`}
                            className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 transition dark:border-slate-700 dark:text-slate-300 ${isActive ? "bg-[#182f79] text-white" : "hover:bg-[#182f79] hover:text-white"
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
                    <h2 className="mt-6 text-[#182f79] dark:text-blue-300 text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                        {locale === "az" ? "Fənnin təlim nəticələri" : "Subject learning outcomes"}
                    </h2>
                    {loading ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : !Array.isArray(tlos) || tlos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#64748b] dark:text-slate-400">
                            <span className="text-4xl">📭</span>
                            <p className="font-medium text-[15px]">
                                {locale === "az" ? "Təlim nəticəsi tapılmadı" : "No learning outcomes found"}
                            </p>
                        </div>
                    ) : (
                        <ol className="mt-4 flex flex-wrap justify-between list-decimal list-inside w-full">
                            {tlos.map((tlo, index) => (
                                <li
                                    key={index}
                                    className="border border-[rgba(0,0,0,0.2)] dark:border-slate-700 border-t-[#182f79] dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] dark:text-blue-300 transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                >
                                    <div className="flex-1 font-bold flex justify-center items-center text-center">
                                        {index + 1}.{tlo.tlo_content}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>
        </>
    )
}
