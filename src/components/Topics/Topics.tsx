"use client";

import Link from "next/link";
import Head from "next/head";
import Skeleton from "@mui/material/Skeleton";
import { Topic } from "@/services/topic/topic";
import { usePathname } from "next/navigation";

export interface TopicPropInterface {
    topics: Topic[];
    subjectCode: string;
    locale: string;
    specialtyCode: string;
    loading?: boolean;
}

export type Locale = "az" | "en";

const topicTypeBadge = (type: number, locale: string) => {
    const map: Record<number, { label: string; color: string; bg: string }> = {
        1: { label: locale === "az" ? "Mühazirə" : "Lecture",     color: "#1e40af", bg: "#dbeafe" },
        2: { label: locale === "az" ? "Məşğələ" : "Practice",     color: "#065f46", bg: "#d1fae5" },
        3: { label: locale === "az" ? "Laboratoriya" : "Lab",     color: "#7c3aed", bg: "#ede9fe" },
        4: { label: locale === "az" ? "Sərbəst iş" : "Self-study", color: "#b45309", bg: "#fef3c7" },
    };
    const entry = map[type] ?? { label: locale === "az" ? "Mövcud deyil" : "N/A", color: "#64748b", bg: "#f1f5f9" };
    return (
        <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ color: entry.color, backgroundColor: entry.bg }}
        >
            {entry.label}
        </span>
    );
};

export default function Topics({ topics, subjectCode, locale, specialtyCode, loading = false }: TopicPropInterface) {
    const pathname = usePathname();
    const isEmpty = !loading && (!topics || topics.length === 0);

    const navItems = [
        { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
        { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
        { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
        { href: "competency", az: "Səriştələr", en: "Competencies" },
        { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
    ];

    return (
        <>
            <Head>
                <title>{`${subjectCode} - ${locale === "az" ? "Mövzular" : "Topics"}`}</title>
                <meta
                    name="description"
                    content={`${locale === "az" ? "Fənn mövzuları" : "Subject topics"}`}
                />
            </Head>

            {/* Tab navigation */}
            <nav className="flex flex-wrap justify-center gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.endsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/${item.href}`}
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
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#64748b] dark:text-slate-400">
                        <span className="text-5xl">📭</span>
                        <p className="font-semibold text-[16px] text-[#1e293b] dark:text-slate-100">
                            {locale === "az" ? "Mövzu tapılmadı" : "No topics found"}
                        </p>
                        <p className="text-[13px] text-[#94a3b8]">
                            {locale === "az"
                                ? "Bu fənn üçün hələ mövzu əlavə edilməyib"
                                : "No topics have been added for this subject yet"}
                        </p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading
                        ? [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-[#e2e8f0] dark:border-slate-700 animate-pulse h-36" />
                        ))
                        : topics.map((topic, index) => (
                            <div
                                key={index}
                                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:shadow-md hover:border-[#182f79]/20 dark:hover:border-blue-400/20 transition-all duration-200 overflow-hidden"
                            >
                                {/* Card header */}
                                <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-[#f1f5f9] dark:border-slate-700">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-[#182f79]/8 flex items-center justify-center text-[#182f79] text-[11px] font-bold flex-shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-[#1e293b] dark:text-slate-100 font-semibold text-[14px] leading-snug">
                                            {topic.topic_name}
                                        </h3>
                                    </div>
                                    {topicTypeBadge(topic.topic_type, locale)}
                                </div>

                                {/* Card body */}
                                <div className="px-5 py-3 flex flex-col gap-2">
                                    {topic.topic_desc && (
                                        <p className="text-[#64748b] dark:text-slate-400 text-[13px]">
                                            <span className="font-semibold text-[#1e293b] dark:text-slate-100">
                                                {locale === "az" ? "Deskripsiya: " : "Description: "}
                                            </span>
                                            {topic.topic_desc}
                                        </p>
                                    )}
                                    {topic.topic_result && (
                                        <p className="text-[#64748b] dark:text-slate-400 text-[13px]">
                                            <span className="font-semibold text-[#1e293b] dark:text-slate-100">
                                                {locale === "az" ? "Nəticə: " : "Result: "}
                                            </span>
                                            {topic.topic_result}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 mt-1 pt-2 border-t border-[#f1f5f9] dark:border-slate-700">
                                        <Link
                                            className="text-[#2563eb] text-[12px] font-semibold hover:underline"
                                            href={{
                                                pathname: `/${locale}/bachelor/specialty-details/${specialtyCode}/subjects/${subjectCode}/topics/topicTlos`,
                                                query: { topicCode: topic.topic_code },
                                            }}
                                        >
                                            {locale === "az" ? "Təlim nəticələri →" : "Learning outcomes →"}
                                        </Link>
                                        {topic.topic_url && (
                                            <a
                                                className="text-[#2563eb] text-[12px] font-semibold hover:underline"
                                                href={topic.topic_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {locale === "az" ? "Mövzu linki →" : "Topic link →"}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                )}
            </section>
        </>
    );
}
