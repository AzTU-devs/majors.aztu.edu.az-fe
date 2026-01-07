"use client";

import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faculties from "@/components/faculties/Faculties";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";

export type Locale = "az" | "en";

export default function Home() {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const token = useSelector((state: RootState) => state)

    useEffect(() => {
        const getAllFaculties = async () => {
            setLoading(true);
            getFaculties(locale)
                .then(setFaculties)
                .finally(() => {
                    setLoading(false);
                })
        }
        getAllFaculties();
    }, [locale]);

    console.log(faculties);

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="bg-[#182f79] py-[30px] px-[40px]">
                    <h1 className="text-[#fff] text-[25px]">
                        {locale === "az" ? "Fakültələr" : "Faculties"}
                    </h1>
                </section>
                <section className="px-[30px] py-[20px]">
                    {loading ? (
                        <div className="grid grid-cols-2 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-gray-300 rounded animate-pulse"
                                ></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {faculties.map((faculty, index) => {
                                return (
                                    <div 
                                        className="mb-[10px] border border-[rgba(0,0,0,0.2)] hover:bg-[#182f79] hover:text-white transition-colors duration-300 p-4 rounded cursor-pointer group"
                                        key={index}
                                    >
                                        {faculty.faculty_name}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
