"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { t } from "@/lib/i18n";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export type Locale = "az" | "en";

export default function page() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
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
    "Qida məhsulları mühəndisliyi"
  ];
  return (
    <>
      <Header />
      <main className="px-[30px] py-[20px]">
        <h1 className="font-bold text-[20px] text-[#182f79] mb-[20px]">{t("home", "master", locale)}</h1>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[100px]">
          {majors.map((major, index) => {
            return (
              <div
                key={index}
                className="border border-[rgba(0,0,0,0.2)] hover:bg-[#182f79] transition-colors duration-300 p-4 rounded cursor-pointer group"
              >
                <h2 aria-label={major} className="text-lg font-semibold group-hover:text-white text-[#182f79]">{major}</h2>
              </div>
            )
          })}
        </section>
      </main>
      <Footer />
    </>
  )
}
