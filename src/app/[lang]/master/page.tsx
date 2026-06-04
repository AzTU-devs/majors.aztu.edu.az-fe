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
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="mb-5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
            {majors.length} {locale === "az" ? "ixtisas mövcuddur" : "specialties available"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {majors.map((major, index) => (
              <div
                key={index}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
              >
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-[#182f79]/8 text-[12px] font-bold text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-[15px] font-bold leading-snug text-[#0E205B] dark:text-white">
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
