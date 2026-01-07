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
    const rawSubjectCode = params.subjectCode;
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const subjectCode = rawSubjectCode
        ? decodeURIComponent(Array.isArray(rawSubjectCode) ? rawSubjectCode[0] : rawSubjectCode)
        : "";

    useEffect(() => {
        getTopics(subjectCode, 0, 10, locale)
            .then((res) => {
                if (res === "NOT_FOUND") {
                    setTopics([]);
                } else if (res === "ERROR") {
                    setTopics([]);
                } else if (typeof res === "object") {
                    setTopics(res.topics);
                }
            })
    }, [locale])
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
    }, [locale]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center w-full p-8">
                <header className="mb-6 flex justify-center items-center">
                    {loading ? (
                        <Skeleton variant="text" width={400} height={40} />
                    ) : (
                        <h1 className="text-3xl text-[#182f79] font-semibold">
                            {specialtyName} ({specialtyCode})
                        </h1>
                    )}
                </header>
                <Topics subjectCode={subjectCode} topics={topics} locale={locale} specialtyCode={specialtyCode} />
            </main>
            <Footer />
        </div>
    );
}