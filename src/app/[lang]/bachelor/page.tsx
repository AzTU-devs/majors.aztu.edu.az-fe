"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Specialties from "@/components/specialties/Specialties";
import PageTitle from "@/components/pageTitle/PageTitle";
import Search from "@/components/search/Search";
// import Filter from "@/components/filter/Filter";
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
      <main className="flex-grow bg-[#F6F7F8]">
        <PageTitle title={`${locale === "az" ? "Bakalavr ixtisasları (Təhsil proqramları)" : "Bachelor specialties"}`} />
        <section className="w-[100%] mx-auto flex flex-col md:flex-col gap-8 px-4 md:px-[30px] py-10 md:py-[50px]">
          <div className="w-full mt-6 mr-[20px] md:mt-0">
            {/* <Filter /> */}
            <Search onSearch={handleSearch} />
            <FacultyCategory />
          </div>
          <div className="flex-1 w-full">
            <Specialties search={search} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
