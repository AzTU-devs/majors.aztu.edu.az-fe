"use client";

import Slo from "@/components/slo/Slo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/pageTitle/PageTitle";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export default function page() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const specialtyCodeParam = params.specialtyCode;
    const [specialtyName, setSpecialtyName] = useState("");
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
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
            <PageTitle title={`${locale === "az" ? "Tələbələrin təlim məqsədləri" : "Student learning outcomes"}`} />
            <main className="bg-white shadow-lg rounded-2xl p-8 w-full">
                <header className="mb-6 flex justify-center items-center">
                    {loading ? (
                        <Skeleton variant="text" width={400} height={40} />
                    ) : (
                        <h1 className="text-3xl text-[#182f79] font-semibold">
                            {specialtyName} ({specialtyCode})
                        </h1>
                    )}
                </header>
                <Slo specialtyCode={specialtyCode} />
            </main>
            <Footer />
        </div>
    )
}
