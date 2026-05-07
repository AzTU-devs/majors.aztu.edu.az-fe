"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "@/services/cafedra/cafedraService";

export type Locale = "az" | "en";

export default function Page() {
    const params = useParams();
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    const facultyCodeParam = params.facultyCode;
    const facultyCode: string = Array.isArray(facultyCodeParam)
        ? facultyCodeParam[0]
        : facultyCodeParam || "";

    const [loading, setLoading] = useState(false);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [facultyName, setFacultyName] = useState("");

    useEffect(() => {
        if (!facultyCode) return;
        setLoading(true);

        getFaculties(locale).then((res) => {
            if (Array.isArray(res)) {
                const match = (res as Faculty[]).find(
                    (f) => f.faculty_code === facultyCode
                );
                if (match) setFacultyName(match.faculty_name);
            }
        });

        getCafedrasByFaculty(facultyCode, locale)
            .then((res) => setCafedras(Array.isArray(res) ? res : []))
            .finally(() => setLoading(false));
    }, [facultyCode, locale]);

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="bg-[#182f79] py-[30px] px-[40px]">
                    <nav className="text-white/70 text-[13px] mb-2">
                        <Link href={`/${locale}/faculties`} className="hover:text-white">
                            {locale === "az" ? "Fakültələr" : "Faculties"}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">
                            {facultyName || facultyCode}
                        </span>
                    </nav>
                    <h1 className="text-[#fff] text-[25px]">
                        {facultyName ||
                            (locale === "az" ? "Kafedralar" : "Departments")}
                    </h1>
                    <p className="text-white/70 text-[13px] mt-1">
                        {locale === "az"
                            ? "Fakültənin kafedraları"
                            : "Departments of the faculty"}
                    </p>
                </section>
                <section className="px-[30px] py-[20px] max-w-6xl mx-auto w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : cafedras.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-[#64748b]">
                            <span className="text-4xl">📭</span>
                            <p className="font-medium text-[15px]">
                                {locale === "az"
                                    ? "Bu fakültədə kafedra tapılmadı"
                                    : "No departments found for this faculty"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cafedras.map((cafedra) => (
                                <Link
                                    key={cafedra.cafedra_code}
                                    href={`/${locale}/faculties/${facultyCode}/${cafedra.cafedra_code}`}
                                    className="group flex items-center justify-between gap-3 border border-[rgba(0,0,0,0.15)] hover:border-[#182f79] hover:bg-[#182f79] transition-colors duration-200 p-4 rounded-xl bg-white"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-[#182f79] group-hover:text-white truncate">
                                            {cafedra.cafedra_name}
                                        </p>
                                        <span className="inline-block mt-1 text-[11px] font-semibold text-[#182f79] border border-[#182f79]/25 bg-[#182f79]/5 px-2 py-0.5 rounded-full group-hover:text-white group-hover:border-white/40 group-hover:bg-white/10">
                                            {cafedra.cafedra_code}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-[#cbd5e1] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
