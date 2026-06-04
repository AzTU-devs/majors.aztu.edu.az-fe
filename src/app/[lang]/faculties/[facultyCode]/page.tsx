"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import PageTitle from "@/components/pageTitle/PageTitle";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "@/services/cafedra/cafedraService";
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
        const match = (res as Faculty[]).find((f) => f.faculty_code === facultyCode);
        if (match) setFacultyName(match.faculty_name);
      }
    });

    getCafedrasByFaculty(facultyCode, locale)
      .then((res) => setCafedras(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, [facultyCode, locale]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
        <PageTitle
          category={locale === "az" ? "Fakültə" : "Faculty"}
          title={facultyName || (locale === "az" ? "Kafedralar" : "Departments")}
          subtitle={locale === "az" ? "Fakültənin kafedraları" : "Departments of the faculty"}
        />

        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#64748b] dark:text-slate-400">
            <Link href={`/${locale}/faculties`} className="hover:text-[#182f79] dark:hover:text-blue-400 transition-colors">
              {locale === "az" ? "Fakültələr" : "Faculties"}
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-[#1e293b] dark:text-slate-100 font-medium">{facultyName || facultyCode}</span>
          </nav>

          {!loading && cafedras.length > 0 && (
            <p className="text-[13px] text-[#64748b] dark:text-slate-400 font-medium -mb-2">
              {cafedras.length} {locale === "az" ? "kafedra" : "departments"}
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
          ) : cafedras.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3 text-[#64748b] dark:text-slate-400">
              <span className="text-5xl">📭</span>
              <p className="font-medium text-[15px]">
                {locale === "az" ? "Bu fakültədə kafedra tapılmadı" : "No departments found for this faculty"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cafedras.map((cafedra, i) => (
                <motion.div
                  key={cafedra.cafedra_code}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={cardEnter}
                >
                  <Link
                    href={`/${locale}/faculties/${facultyCode}/${cafedra.cafedra_code}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#182f79]/8 text-[22px] dark:bg-blue-400/10">
                        🏢
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        {cafedra.cafedra_code}
                      </span>
                    </div>

                    <h2 className="flex-1 text-[16px] font-bold leading-snug text-[#0E205B] dark:text-white">
                      {cafedra.cafedra_name}
                    </h2>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#182f79] transition-all group-hover:gap-2.5 dark:text-blue-400">
                      {locale === "az" ? "İxtisaslara bax" : "View specialties"}
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
