"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CompetencyPage from "@/components/Compentency/page";

export default function Page() {
  const params = useParams();
  const raw = params.specialtyCode;
  const specialtyCode = Array.isArray(raw) ? raw[0] : raw || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <CompetencyPage specialtyCode={specialtyCode} />
      </main>
      <Footer />
    </div>
  );
}
