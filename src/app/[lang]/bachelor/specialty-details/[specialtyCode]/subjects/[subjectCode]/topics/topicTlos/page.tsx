"use client";

import { useState } from "react";
import { Locale } from "../page";
import { Skeleton } from "@mui/material";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Tlos from "@/components/tlos/Tlos";
import { useParams, useSearchParams } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const specialtyCodeParam = params.specialtyCode;
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const topicCodeParam = searchParams.get("topicCode");
    const topicCode: string = topicCodeParam || "";

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
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
                    <Tlos specialtyCode={specialtyCode} topicCode={topicCode} />
                </main>
                <Footer />
            </div>
        </>
    )
}
