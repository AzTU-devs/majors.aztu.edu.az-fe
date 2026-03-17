"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import PageTitle from "@/components/pageTitle/PageTitle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export type Locale = "az" | "en";

const majors = [
  "Menecment",
  "Biznesin idarə edilməsi",
  "Kompüter elmləri",
  "Materialşünaslıq mühəndisliyi",
  "Dağ-mədən mühəndisliyi",
  "Elektroenergetika mühəndisliyi",
  "İstilik energetikası mühəndisliyi",
  "Enerji maşınqayırma mühəndisliyi",
  "Metallurgiya mühəndisliyi",
  "Maşın mühəndisliyi",
  "Dəmir yolu nəqliyyatı və təsərrüfatı mühəndisliyi",
  "Yerüstü nəqliyyat vasitələrinin mühəndisliyi",
  "Nəqliyyatda daşımaların və idarəetmənin təşkili mühəndisliyi",
  "Cihazqayırma mühəndisliyi",
  "Texnoloji maşın və avadanlıqlar",
  "Elektrik mühəndisliyi",
  "Elektronika, telekommunikasiya və radiotexnika mühəndisliyi",
  "Proseslərin avtomatlaşdırılması mühəndisliyi",
  "Mexatronika və robototexnika mühəndisliyi",
  "Mexanika mühəndisliyi",
  "Kompüter mühəndisliyi",
  "İnformasiya texnologiyaları və sistemləri mühəndisliyi",
  "Qida məhsulları mühəndisliyi",
];

export default function page() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
        <PageTitle
          category={locale === "az" ? "Magistr" : "Master"}
          title={locale === "az" ? "Magistr ixtisasları (Təhsil proqramları)" : "Master Specialties"}
          subtitle={locale === "az" ? "Azərbaycan Texniki Universitetinin magistr proqramları" : "Graduate programs at Azerbaijan Technical University"}
        />
        <section className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-10">
          <p className="text-[13px] text-[#64748b] dark:text-slate-400 mb-5 font-medium">
            {majors.length} {locale === "az" ? "ixtisas mövcuddur" : "specialties available"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {majors.map((major, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/25 dark:hover:border-blue-400/25 hover:shadow-md hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-all duration-200 flex items-center gap-3.5 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#182f79]/8 flex items-center justify-center text-[#182f79] text-[12px] font-bold flex-shrink-0 group-hover:bg-[#182f79] group-hover:text-white transition-colors duration-200">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p className="font-semibold text-[#1e293b] dark:text-slate-100 text-[14px] leading-snug group-hover:text-[#182f79] dark:group-hover:text-blue-400 transition-colors duration-200 flex-1">
                  {major}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
