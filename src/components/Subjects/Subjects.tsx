"use client";

import Link from "next/link";
import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Locale } from "../header/Header";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";
import { getCurriculaBySpecialtyCode, Subject } from "@/services/curricula/curricula";
import { getSpecialtyChar, SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";

export default function Specialties({ specialtyCode }: { specialtyCode: string }) {
    const pathname = usePathname();
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [specialtyName, setSpecialtyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [specialtyChar, setSpecialtyChar] = useState<SpecialtyChar>();

    useEffect(() => {
        setLoading(true);
        getCurriculaBySpecialtyCode(specialtyCode, 0, 10, locale)
            .then((res) => {
                if (typeof res === "object") {
                    setSubjects(res.subjects)
                } else {
                    setSubjects([]);
                }
            })
            .finally(() => {
                setLoading(false)
            });
        getSpecialtyChar(specialtyCode, locale)
            .then(setSpecialtyChar)
        getSpecialtyDetails(specialtyCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false)
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
            <section className="py-[10px] px-[30px] flex justify-center items-start w-full">
                <main className="min-h-[200px] w-[100%]">
                    <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center mb-[10px]">
                        {locale === "az" ? "Kurrikulum" : "Curriculum"}
                    </h2>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="border border-[rgba(0,0,0,0.2)] rounded-[20px] p-4 animate-pulse space-y-4">
                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : subjects.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[#182f79]" role="alert" aria-live="polite">{locale === "az" ? "Mövcud deyil" : "Not available"}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {subjects.map((subject, index) => {
                                return (
                                    <div key={index} className="border border-[rgba(0,0,0,0.2)] rounded-[20px] p-6 flex flex-col gap-2 bg-white shadow-sm">
                                        <h3 className="text-[#182f79] font-semibold text-lg">{subject.subject_name}</h3>
                                        <p><strong>{locale === "az" ? "İl" : "Year"}:</strong> {subject.year} {locale === "az" ? "ci il" : "st year"}</p>
                                        <p><strong>{locale === "az" ? "Semestr" : "Semester"}:</strong> {subject.semester === 1 ? (locale === "az" ? "Payız semesteri" : "Fall semester") : (locale === "az" ? "Yaz semesteri" : "Spring semester")}</p>
                                        <p><strong>{locale === "az" ? "Kredit" : "Credit"}:</strong> {subject.credit}</p>
                                        <p><strong>{locale === "az" ? "Həftə başı saat" : "Hours per Week"}:</strong> {subject.hours_per_week} {locale === "az" ? "saat" : "hours"}</p>
                                        <p><strong>{locale === "az" ? "Fənn tipi" : "Subject Type"}:</strong> {subject.status === 2 ? (locale === "az" ? "Məcburi" : "Compulsory") : subject.status ? (locale === "az" ? "Seçmə" : "Elective") : (locale === "az" ? "Digər" : "Other")}</p>
                                        <p>
                                            <strong>{locale === "az" ? "Mövzular" : "Topics"}: </strong>
                                            <Link
                                                href={{
                                                    pathname: `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subject.subject_code}/topics`,
                                                    query: { subjectName: subject.subject_name },
                                                }}
                                                className="underline text-blue-600 hover:text-blue-800"
                                            >
                                                {locale === "az" ? "Keçid edin" : "Go ahead"}
                                            </Link>
                                        </p>
                                        <p>
                                            <strong>{locale === "az" ? "Sillabus" : "Sillabus"}: </strong>
                                            <Link
                                                href={{
                                                    pathname: `/${locale}/bachelor/specialty-details/${subject.subject_code}/sillabus`,
                                                    query: { subjectCode: subject.subject_code },
                                                }}
                                                className="underline text-blue-600 hover:text-blue-800"
                                            >
                                                {locale === "az" ? "Keçid edin" : "Go ahead"}
                                            </Link>
                                        </p>
                                        <p>
                                            <strong>{locale === "az" ? "Ədəbiyyat" : "Literature"}: </strong>
                                            <Link
                                                href={{
                                                    pathname: `/${locale}/bachelor/specialty-details/${subject.subject_code}/literatures`,
                                                    query: { subjectCode: subject.subject_code },
                                                }}
                                                className="underline text-blue-600 hover:text-blue-800"
                                            >
                                                {locale === "az" ? "Keçid edin" : "Go ahead"}
                                            </Link>
                                        </p>
                                        <p>
                                            <strong>{locale === "az" ? "Fənnin təlim nəticələri" : "Subjects' learning outcomes"}: </strong>
                                            <Link
                                                href={{
                                                    pathname: `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subject.subject_code}/subject-learning-outcomes`
                                                }}
                                                className="underline text-blue-600 hover:text-blue-800"
                                            >
                                                {locale === "az" ? "Keçid edin" : "Go ahead"}
                                            </Link>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </section>
        </>
    )
}
