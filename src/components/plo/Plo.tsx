import Link from "next/link";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { usePathname } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import type { PloInterface } from "@/services/plo/ploService";
import { getPloBySpecialty } from "@/services/plo/ploService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

interface PloPageProps {
    plos: PloInterface[];
    specialtyName: string;
    specialtyCode: string;
    locale: Locale;
}

export default function Plo({ plos, specialtyName, specialtyCode, locale }: PloPageProps) {
    const pathname = usePathname();
    const isLoading = !plos || plos.length === 0 || !specialtyName;

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

                <div className="w-[100%] flex flex-col items-center justify-center">
                    {isLoading ? (
                        <>
                            <Skeleton variant="text" width="50%" height={32} sx={{ bgcolor: 'rgb(0,0,0,0.2)', borderRadius: 1, mb: 2 }} />
                            <div className="w-full">
                                {[...Array(3)].map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" height={60} sx={{ bgcolor: 'rgb(0,0,0,0.2)', mb: 2, borderRadius: 1 }} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mt-6 text-[#182f79] text-[20px] font-semibold w-full flex justify-center items-center">
                                {locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}
                            </h2>
                            <ol className="mt-4 flex flex-wrap gap-4 list-decimal list-inside w-full">
                                {plos.map((plo, index) => (
                                    <li
                                        key={index}
                                        className="border border-[rgba(0,0,0,0.2)] border-t-[#182f79] shadow-md hover:shadow-lg transition-shadow border-t-4 text-[#182f79] transition-colors duration-300 p-4 rounded-xl flex flex-col w-[calc(50%-8px)] mb-4"
                                    >
                                        <div className="flex-1 text-[#182f79] flex justify-center items-center font-bold">{plo.plo_content}</div>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const locale = (context.params?.locale as Locale) || "az";
    const specialtyCode = Array.isArray(context.params?.specialtyCode)
        ? context.params?.specialtyCode[0]
        : context.params?.specialtyCode || "";

    const [specialtyName, plos] = await Promise.all([
        getSpecialtyDetails(specialtyCode, locale),
        getPloBySpecialty(specialtyCode, locale),
    ]);

    return {
        props: {
            specialtyName,
            plos,
            specialtyCode,
            locale,
        },
    };
};
