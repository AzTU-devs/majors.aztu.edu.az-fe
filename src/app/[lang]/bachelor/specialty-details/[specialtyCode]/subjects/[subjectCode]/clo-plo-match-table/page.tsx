"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getSubjectDetails } from "@/services/curricula/curricula";
import CloPloMatchTable from "@/components/CloPloMatchTable/CloPloMatchTable";

export type Locale = "az" | "en";

export default function page() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const subjectCodeParam = params.subjectCode;
    const [subjectName, setSubjectName] = useState("");
    const subjectCode: string = Array.isArray(subjectCodeParam)
        ? subjectCodeParam[0]
        : subjectCodeParam || "";
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        setLoading(true);
        getSubjectDetails(subjectCode, locale)
            .then((details) => {
                if (details && typeof details === "object" && details.subject_name) {
                    setSubjectName(details.subject_name);
                } else {
                    setSubjectName(subjectCode);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [locale, subjectCode]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="bg-white shadow-lg rounded-2xl p-8 w-full">
                <header className="mb-6 flex justify-center items-center">
                    {loading ? (
                        <Skeleton variant="text" width={400} height={40} />
                    ) : (
                        <h1 className="text-3xl text-[#182f79] font-semibold">
                            {subjectName} ({subjectCode})
                        </h1>
                    )}
                </header>
                <CloPloMatchTable />
            </main>
            <Footer />
        </div>
    );
}
