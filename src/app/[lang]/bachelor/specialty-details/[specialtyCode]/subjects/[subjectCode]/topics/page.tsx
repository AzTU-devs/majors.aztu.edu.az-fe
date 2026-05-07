"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Topics from "@/components/Topics/Topics";
import { getTopics, Topic } from "@/services/topic/topic";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export default function Page() {
    const params = useParams();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topicsLoading, setTopicsLoading] = useState(true);
    const rawSubjectCode = params.subjectCode;
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const subjectCode = rawSubjectCode
        ? decodeURIComponent(Array.isArray(rawSubjectCode) ? rawSubjectCode[0] : rawSubjectCode)
        : "";

    useEffect(() => {
        setTopicsLoading(true);
        getTopics(subjectCode, 0, 10, locale)
            .then((res) => {
                if (res === "NOT_FOUND" || res === "ERROR") {
                    setTopics([]);
                } else if (res && typeof res === "object") {
                    setTopics(Array.isArray(res.topics) ? res.topics : []);
                } else {
                    setTopics([]);
                }
            })
            .finally(() => setTopicsLoading(false));
    }, [locale, subjectCode]);

    const [loading, setLoading] = useState(false);
    const specialtyCodeParam = params.specialtyCode;
    const [specialtyName, setSpecialtyName] = useState("");
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    useEffect(() => {
        setLoading(true);
        getSpecialtyDetails(specialtyCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false);
            });
    }, [locale, specialtyCode]);

    return (
        <div className="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-slate-900">
            <Header />
            <main className="flex-grow flex flex-col items-center w-full p-8 pt-32">
                <header className="mb-6 flex justify-center items-center">
                    {loading ? (
                        <Skeleton variant="text" width={400} height={40} />
                    ) : (
                        <h1 className="text-3xl text-[#182f79] dark:text-blue-300 font-semibold">
                            {specialtyName} ({specialtyCode})
                        </h1>
                    )}
                </header>
                <Topics
                    subjectCode={subjectCode}
                    topics={topics}
                    locale={locale}
                    specialtyCode={specialtyCode}
                    loading={topicsLoading}
                />
            </main>
            <Footer />
        </div>
    );
}