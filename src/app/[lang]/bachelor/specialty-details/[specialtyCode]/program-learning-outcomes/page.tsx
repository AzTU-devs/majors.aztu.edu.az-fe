"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Plo, { Locale } from "@/components/plo/Plo";
import { getPloBySpecialty } from "@/services/plo/ploService";
import type { PloInterface } from "@/services/plo/ploService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export default function Page() {
    const params = useParams();
    const specialtyCodeParam = params.specialtyCode;
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const [plos, setPlos] = useState<PloInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        setLoading(true);
        getSpecialtyDetails(specialtyCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false)
            });
        getPloBySpecialty(specialtyCode ? specialtyCode : "", locale)
            .then(setPlos)
            .finally(() => {
                setLoading(false);
            });
    }, [locale]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <section className="flex-grow mx-auto p-8 w-full">
                <header className="mb-6 flex justify-center items-center">
                    {loading ? (
                        <Skeleton variant="text" width={400} height={40} />
                    ) : (
                        <h1 className="text-3xl text-[#182f79] font-semibold">
                            {specialtyName} ({specialtyCode})
                        </h1>
                    )}
                </header>
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
                    <Plo
                        specialtyCode={specialtyCode}
                        specialtyName={specialtyName}
                        plos={plos}
                        locale={locale}
                    />
                </div>
            </section>
            <Footer />
        </div>
    );
}