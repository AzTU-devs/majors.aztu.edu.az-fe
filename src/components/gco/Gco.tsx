"use client";

import Link from "next/link";
import Head from "next/head";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import RemoveIcon from '@mui/icons-material/Remove';
import type { Gco } from "@/services/gco/gcoService";
import { useParams, usePathname } from "next/navigation";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { getGcosBySpecailty } from "@/services/gco/gcoService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export default function Gco({ specialtyCode }: { specialtyCode: string }) {
    const pathname = usePathname();
    const [gcos, setGcos] = useState<Gco[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    const [expandedIndex, setExpandedIndex] = useState<number | false>(0);
    const handleAccordionChange = (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedIndex(isExpanded ? index : false);
    };

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
        { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
    ];

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getSpecialtyDetails(specialtyCode, locale).then(setSpecialtyName),
            getGcosBySpecailty(specialtyCode ? specialtyCode : "", locale).then(setGcos)
        ]).finally(() => {
            setLoading(false);
        });
    }, [locale, specialtyCode]);

    return (
        <><Head>
            <title>{`${specialtyName} (${specialtyCode}) - ${locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}`}</title>
            <meta
                name="description"
                content={`${locale === "az" ? "Tələbələr üçün proqram təlim məqsədləri" : "Program learning outcomes for students"}: ${specialtyName}`}
            />
        </Head>
            <nav className="flex flex-wrap justify-center gap-3 mb-[20px]">
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
            <section className="py-8 px-4 flex justify-center w-full">
                <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {loading
                        ? [...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col bg-gray-100 rounded-xl animate-pulse border-t-4 border-[#182f79] p-6"
                            >
                                <Skeleton variant="rectangular" height={24} className="mb-4" />
                                <Skeleton variant="rectangular" height={16} />
                                <Skeleton variant="rectangular" height={16} className="mt-2" />
                            </div>
                        ))
                        : gcos.map((gco, index) => (
                            <div
                                key={index}
                                className="flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#182f79] p-6"
                            >
                                {/* Card Header */}
                                <h3 className="text-lg font-semibold text-[#182f79] mb-3">
                                    {gco.career_title}
                                </h3>

                                {/* Card Content */}
                                <p className="text-gray-700 flex-1">{gco.career_content}</p>
                            </div>
                        ))}
                </div>
            </section>
        </>
    )
}
