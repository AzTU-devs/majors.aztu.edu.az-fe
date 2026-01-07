"use client";

import { t } from "@/lib/i18n";
import Image from "next/image";
import AzTU from "@/../public/aztu.jpg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export type Locale = "en" | "az";

export default function Home() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="relative">
          <Image
            src={AzTU}
            alt="Azərbaycan Texniki Universiteti"
            sizes="100vw"
            className="w-full h-[700px] object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#182f79]/40 backdrop-blur-s" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="font-bold text-[30px] mb-4">{t("home", "header", locale)}</h1>
            <p className="max-w-2xl font-medium text-[25px]">{t("home", "desc", locale)}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}; 