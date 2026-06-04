"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import PageTitle from "@/components/pageTitle/PageTitle";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";
import { motion, type Variants } from "framer-motion";

export type Locale = "az" | "en";

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function Page() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    setLoading(true);
    getFaculties(locale)
      .then((res) => setFaculties(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
        <PageTitle
          category={locale === "az" ? "Struktur" : "Structure"}
          title={locale === "az" ? "Fakültələr" : "Faculties"}
          subtitle={
            locale === "az"
              ? "Azərbaycan Texniki Universitetinin fakültələri və onlara aid kafedralar"
              : "Faculties of Azerbaijan Technical University and their departments"
          }
        />

        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {!loading && faculties.length > 0 && (
            <p className="text-[13px] text-[#64748b] dark:text-slate-400 mb-5 font-medium">
              {faculties.length} {locale === "az" ? "fakültə" : "faculties"}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : faculties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3 text-[#64748b] dark:text-slate-400">
              <span className="text-5xl">🏛️</span>
              <p className="font-medium text-[15px]">
                {locale === "az" ? "Fakültə tapılmadı" : "No faculties found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {faculties.map((faculty, i) => (
                <motion.div
                  key={faculty.faculty_code}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={cardEnter}
                >
                  <Link
                    href={`/${locale}/faculties/${faculty.faculty_code}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#182f79]/8 text-[22px] dark:bg-blue-400/10">
                        🏛️
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        {faculty.faculty_code}
                      </span>
                    </div>

                    <h2 className="flex-1 text-[16px] font-bold leading-snug text-[#0E205B] dark:text-white">
                      {faculty.faculty_name}
                    </h2>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#182f79] transition-all group-hover:gap-2.5 dark:text-blue-400">
                      {locale === "az" ? "Kafedralara bax" : "View departments"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
