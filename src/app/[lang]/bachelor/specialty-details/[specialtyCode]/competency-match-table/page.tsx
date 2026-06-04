"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SpecialtyShell from "@/components/specialtyDetails/SpecialtyShell";
import CompetencyMatchTable from "@/components/CompetencyMatchTable/CompetencyMatchTable";

type Locale = "az" | "en";

export default function Page() {
  const params = useParams();
  const raw = params.specialtyCode;
  const specialtyCode = Array.isArray(raw) ? raw[0] : raw || "";
  const locale: Locale = useSelector((s: RootState) => s.locale.value);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SpecialtyShell
          specialtyCode={specialtyCode}
          active="competency-match-table"
          subtitle={locale === "az" ? "Səriştə uyğunluq cədvəli" : "Competency matching table"}
        >
          <CompetencyMatchTable />
        </SpecialtyShell>
      </main>
      <Footer />
    </div>
  );
}
