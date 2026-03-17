"use client";

import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { Slo } from "@/services/slo/sloService";
import { useParams, usePathname } from "next/navigation";
import { getSloBySpecialty } from "@/services/slo/sloService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

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

export default function SubjectLo({ specialtyCode }: { specialtyCode: string }) {
    const pathname = usePathname();
    const [slos, setSlos] = useState<Slo[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [subLos, setSubLos] = useState(defaultSubLos);

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
        setSubLos(defaultSubLos);
    }, [locale]);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
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
                <title>{`${specialtyName} (${specialtyCode}) - ${locale === "az" ? "Fənnin Təlim Nəticələri" : "Subject Learning Outcomes"}`}</title>
                <meta
                    name="description"
                    content={`${locale === "az" ? "Fənnin təlim nəticələri" : "Subject learning outcomes"}: ${specialtyName}`}
                />
            </Head>

            {/* Tab navigation */}
            <nav className="flex flex-wrap justify-center gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.endsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/PR001/${item.href}`}
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
                    {locale === "az" ? "Fənnin təlim nəticələri" : "Subject learning outcomes"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subLos.map((slo, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/25 dark:hover:border-blue-400/25 hover:shadow-md hover:bg-blue-50/20 dark:hover:bg-slate-700/20 transition-all duration-200 flex items-start gap-3.5"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#182f79]/8 flex items-center justify-center text-[#182f79] text-[11px] font-bold flex-shrink-0 group-hover:bg-[#182f79] group-hover:text-white transition-colors duration-200">
                                {String(index + 1).padStart(2, "0")}
                            </div>
                            <p className="text-[#1e293b] dark:text-slate-100 text-[14px] leading-relaxed font-medium flex-1">
                                {slo[locale]}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
