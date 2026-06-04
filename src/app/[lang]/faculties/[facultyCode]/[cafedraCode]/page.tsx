"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import PageTitle from "@/components/pageTitle/PageTitle";
import { Cafedra, getCafedrasByFaculty } from "@/services/cafedra/cafedraService";
import {
    Specialty,
    getSpecialtiesByCafedraPublic,
} from "@/services/specialty/specialtyService";

export type Locale = "az" | "en";

export default function Page() {
    const params = useParams();
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    const facultyCodeParam = params.facultyCode;
    const cafedraCodeParam = params.cafedraCode;
    const facultyCode: string = Array.isArray(facultyCodeParam)
        ? facultyCodeParam[0]
        : facultyCodeParam || "";
    const cafedraCode: string = Array.isArray(cafedraCodeParam)
        ? cafedraCodeParam[0]
        : cafedraCodeParam || "";

    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [cafedraName, setCafedraName] = useState("");

    useEffect(() => {
        if (!cafedraCode) return;
        setLoading(true);

        if (facultyCode) {
            getCafedrasByFaculty(facultyCode, locale).then((res) => {
                if (Array.isArray(res)) {
                    const match = (res as Cafedra[]).find(
                        (c) => c.cafedra_code === cafedraCode
                    );
                    if (match) setCafedraName(match.cafedra_name);
                }
            });
        }

        getSpecialtiesByCafedraPublic(cafedraCode, locale)
            .then((res) => setSpecialties(Array.isArray(res) ? res : []))
            .finally(() => setLoading(false));
    }, [facultyCode, cafedraCode, locale]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
                <PageTitle
                    category={
                        cafedraName ||
                        (locale === "az" ? "Kafedra" : "Department")
                    }
                    title={
                        locale === "az"
                            ? "Kafedranın ixtisasları"
                            : "Specialties of the department"
                    }
                    subtitle={
                        locale === "az"
                            ? "Bu kafedraya aid bütün ixtisaslar"
                            : "All specialties under this department"
                    }
                />
                <section className="max-w-7xl mx-auto w-full flex flex-col gap-5 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <nav className="text-[13px] text-[#64748b] dark:text-slate-400">
                        <Link
                            href={`/${locale}/faculties`}
                            className="hover:text-[#182f79] dark:hover:text-blue-400"
                        >
                            {locale === "az" ? "Fakültələr" : "Faculties"}
                        </Link>
                        <span className="mx-2">/</span>
                        <Link
                            href={`/${locale}/faculties/${facultyCode}`}
                            className="hover:text-[#182f79] dark:hover:text-blue-400"
                        >
                            {locale === "az" ? "Kafedralar" : "Departments"}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#1e293b] dark:text-slate-100 font-medium">
                            {cafedraName || cafedraCode}
                        </span>
                    </nav>

                    <div className="min-h-[200px] w-full">
                        {!loading && specialties.length > 0 && (
                            <p className="text-[13px] text-[#64748b] dark:text-slate-400 mb-4 font-medium">
                                {specialties.length}{" "}
                                {locale === "az"
                                    ? "ixtisas tapıldı"
                                    : "specialties found"}
                            </p>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-[140px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                                    />
                                ))}
                            </div>
                        ) : specialties.length === 0 ? (
                            <div className="flex h-52 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                                <span className="text-4xl">🔍</span>
                                <p className="text-[15px] font-medium">
                                    {locale === "az"
                                        ? "Nəticə tapılmadı"
                                        : "No results found"}
                                </p>
                                <p className="text-[13px] text-slate-400">
                                    {locale === "az"
                                        ? "Bu kafedrada ixtisas yoxdur"
                                        : "This department has no specialties"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {specialties.map((specialty, idx) => (
                                    <Link
                                        key={specialty.specialty_code}
                                        href={`/${locale}/bachelor/specialty-details/${specialty.specialty_code}`}
                                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#182f79]/8 text-[12px] font-bold text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                                {specialty.specialty_code}
                                            </span>
                                        </div>

                                        <h3 className="flex-1 text-[15px] font-bold leading-snug text-[#0E205B] dark:text-white">
                                            {specialty.specialty_name}
                                        </h3>

                                        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#182f79] transition-all group-hover:gap-2.5 dark:text-blue-400">
                                            {locale === "az" ? "Ətraflı bax" : "View details"}
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
