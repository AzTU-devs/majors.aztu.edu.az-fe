"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getTopics } from "@/services/topic/topic";
import { useParams } from "next/navigation";
import { getSpecialtyChar, SpecialtyChar } from "@/services/specialtCharacteristics/specialtyChar";
import { Topic } from "@/services/topic/topic";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export type Locale = "az" | "en";

export default function Specialties({ specialtyCode }: { specialtyCode: string }) {
    const [topics, setTopics] = useState<Topic[]>([] as Topic[]);
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [specialtyName, setSpecialtyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [specialtyChar, setSpecialtyChar] = useState<SpecialtyChar>();
    const { subjectCode } = useParams<{ subjectCode: string }>();
    const decodedSubjectCode = decodeURIComponent(subjectCode);
    useEffect(() => {
        setLoading(true);
        getTopics(decodedSubjectCode, 0, 10, locale)
            .then((res) => {
                if (typeof res === "object") {
                    setTopics(res.topics)
                } else {
                    setTopics([]);
                }
            })
            .finally(() => {
                setLoading(false)
            });
        getSpecialtyChar(specialtyCode, locale)
            .then(setSpecialtyChar)
    }, [locale]);
    console.log(decodedSubjectCode);
    return (
        <>
            <Header />
            <main className="p-[30px]">
                <div className="min-h-[200px] w-full flex justify-center items-center">
                    {loading ? (
                        <ol className="flex flex-col">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <li key={index} className="mb-[10px] border border-[rgba(0,0,0,0.2)] p-4 rounded">
                                    <div className="h-6 w-2/3 bg-gray-300 rounded animate-pulse" />
                                </li>
                            ))}
                        </ol>
                    ) : topics.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[#182f79]">Mövcud deyil</div>
                    ) : (
                        <ol className="flex flex-col w-full gap-4 list-decimal list-inside flex flex-col items-center justify-center">
                            {(topics || []).map((topic, index) => (
                                <li
                                    key={index}
                                    className="flex flex-col gap-2 border border-[rgba(0,0,0,0.2)] p-4 rounded"
                                >
                                    <div>Ad: {topic.topic_name}</div>
                                    <div>Dərs tipi: {topic.topic_type === 1 ? "Mühazirə" : topic.topic_type === 2 ? "Məşğələ" : topic.topic_type === 3 ? "Laboratoriya" : topic.topic_type === 4 ? "Sərbəst iş" : "Movcud deyil"}</div>
                                    <div>Link: <a target="_blank" href={`${topic.topic_url}`}>Prezentasiya</a></div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
