"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Specialties from "@/components/specialties/Specialties";
import PageTitle from "@/components/pageTitle/PageTitle";
import Search from "@/components/search/Search";
import FacultyCategory from "@/components/facultyCategory/FacultyCategoty";

export type Locale = "az" | "en";

export default function page() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
        <PageTitle
          category={locale === "az" ? "Bakalavr" : "Bachelor"}
          title={locale === "az" ? "Bakalavr ixtisasları (Təhsil proqramları)" : "Bachelor Specialties"}
          subtitle={locale === "az" ? "Azərbaycan Texniki Universitetinin bakalavr proqramları" : "Undergraduate programs at Azerbaijan Technical University"}
        />
        <section className="max-w-6xl mx-auto w-full flex flex-col gap-5 px-4 md:px-8 py-8 md:py-10">
          {/* Search & Filter Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-slate-700 p-5">
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#64748b] dark:text-slate-400 font-semibold mb-2">
              {locale === "az" ? "İxtisas axtar" : "Search specialties"}
            </label>
            <Search onSearch={handleSearch} />
            <div className="mt-4 pt-4 border-t border-[#f1f5f9] dark:border-slate-700">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#64748b] dark:text-slate-400 font-semibold mb-3">
                {locale === "az" ? "Fakültəyə görə filtr" : "Filter by faculty"}
              </label>
              <FacultyCategory />
            </div>
          </div>

          {/* Results */}
          <Specialties search={search} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
