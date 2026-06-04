"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import SpecialtyDetails from "@/components/specialtyDetails/SpecialtyDetails";
import { useParams } from "next/navigation";

export type Locale = "az" | "en";

export default function page() {
  const { specialtyCode } = useParams<{ specialtyCode: string }>();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SpecialtyDetails specialtyCode={specialtyCode} />
      </main>
      <Footer />
    </div>
  );
}