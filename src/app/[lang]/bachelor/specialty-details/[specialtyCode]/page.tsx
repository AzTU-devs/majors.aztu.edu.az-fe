"use client";

import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import SpecialtyDetails from "@/components/specialtyDetails/SpecialtyDetails";
import PageTitle from "@/components/pageTitle/PageTitle";

export type Locale = "az" | "en";

export default function page() {
  const params = useParams();
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const { specialtyCode } = useParams<{ specialtyCode: string }>();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PageTitle title={`${locale === "az" ? "Fənn məlumatları" : "Specialty details"}`}/>
        <SpecialtyDetails specialtyCode={specialtyCode} />
      </main>
      <Footer />
    </div>
  );
}