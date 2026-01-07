"use client";

import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Skeleton from "@mui/material/Skeleton";
import { Topic } from "@/services/topic/topic";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import RemoveIcon from '@mui/icons-material/Remove';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { usePathname } from "next/navigation";

export interface TopicPropInterface {
    topics: Topic[];
    subjectCode: string;
    locale: string;
    specialtyCode: string;
}

export type Locale = "az" | "en";

export default function Topics({ topics, subjectCode, locale, specialtyCode }: TopicPropInterface) {
    const pathname = usePathname();
    const loading = !topics || topics.length === 0 || !specialtyCode;
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
    ];

    return (
        <>
            <Head>
                <title>{`${subjectCode} (${subjectCode}) - ${locale === "az" ? "Proqram Təlim Məqsədləri" : "Program Learning Outcomes"}`}</title>
                <meta
                    name="description"
                    content={`${locale === "az" ? "Tələbələr üçün proqram təlim məqsədləri" : "Program learning outcomes for students"}`}
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
            <section className="py-[10px] px-[30px] flex flex-col justify-between items-center w-full">
                <div className="mt-6 w-full flex flex-col grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading
                        ? [...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col h-32 bg-gray-200 rounded-xl animate-pulse" />
                        ))
                        : topics.map((topic, index) => (
                            <div
                                key={index}
                                className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#182f79] p-6"
                            >
                                {/* Card Header */}
                                <h3 className="text-lg font-semibold text-[#182f79] mb-3">
                                    {topic.topic_name}
                                </h3>

                                {/* Card Content */}
                                <p className="text-gray-700 flex-1 mb-2">
                                    <span className="font-bold">{locale === "az" ? "Mövzu tipi: " : "Topic type: "}</span>
                                    {topic.topic_type === 1
                                        ? "Mühazirə"
                                        : topic.topic_type === 2
                                            ? "Məşğələ"
                                            : topic.topic_type === 3
                                                ? "Laboratoriya"
                                                : topic.topic_type === 4
                                                    ? "Sərbəst iş"
                                                    : "Mövcud deyil"}
                                </p>

                                <p className="text-gray-700 mb-2">
                                    <span className="font-bold">{locale === "az" ? "Mövzu deskripsiyası: " : "Topic description: "}</span>
                                    {topic.topic_desc}
                                </p>

                                <p className="text-gray-700 mb-2">
                                    <span className="font-bold">{locale === "az" ? "Mövzunun təlim nəticəsi: " : "Topic result: "}</span>
                                    {topic.topic_result}
                                </p>

                                <p className="text-gray-700">
                                    <span className="font-bold">{locale === "az" ? "Mövzu təlim nəticələri: " : "Topic learning outcomes: "}</span>
                                    <Link className="underline"
                                    href={{
                                        pathname: `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subjectCode}/topics/topicTlos`,
                                        query: { topicCode: topic.topic_code },
                                    }}>
                                        {locale === "az" ? "Keçid" : "Go"}
                                    </Link>
                                </p>

                                {topic.topic_url && (
                                    <p className="text-gray-700">
                                        <span className="font-bold">{locale === "az" ? "Mövzu linki: " : "Topic url: "}</span>
                                        <a className="underline" href={topic.topic_url} target="_blank">
                                            {locale === "az" ? "Keçid" : "Go"}
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))}
                </div>
            </section>
        </>
    )
}
