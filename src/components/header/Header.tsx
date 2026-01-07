"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import Aztu from "@/../public/assets/aztu_logo.png";
import LanguageToggler from "../languageToggler/LanguageToggler";
import { motion } from "framer-motion";

export type Locale = "az" | "en";

const Header = () => {
  const { lang } = useParams();
  const locale: Locale = useSelector((state: RootState) => state.locale.value);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${scrolled ? "fixed top-0 left-0" : "absolute top-0 left-0"} z-[999] w-full bg-transparent`}
    >
      <motion.nav
        initial={{ width: "90%" }}
        animate={{ width: scrolled ? "60%" : "90%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ width: scrolled ? "60%" : "90%" }}
        className="mx-auto mt-3 flex justify-between items-center py-[15px] px-[25px] rounded-full bg-white/40 backdrop-blur-lg shadow-lg h-[80px]"
      >
        <div style={{ width: "calc(100% / 3)" }}>
          <Link href={`/${lang}`}>
            <Image
              src={Aztu}
              alt="Azərbaycan Texniki Universiteti"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div style={{ width: "calc(100% / 3)" }}>
          <ul className="flex justify-center items-center w-full">
            <li className="font-semibold text-[#182f79] relative group mx-[50px]">
              <span className="cursor-pointer text-[17px] text-[#fff]">
                {t("header", "specialties", locale)}
              </span>
              <ul className="absolute left-0 mt-2 w-52 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <li>
                  <Link
                    href={`/${lang}/bachelor`}
                    className="block text-[18px] px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {t("header", "bachelor", locale)}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${lang}/master`}
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {t("header", "master", locale)}
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className="font-semibold text-[#182f79] text-[20px]">
              <Link href={`/${lang}/faculties`}>
                {t("header", "faculties", locale)}
              </Link>
            </li> */}
          </ul>
        </div>
        <div
          style={{ width: "calc(100% / 3)" }}
          className="flex justify-end items-end"
        >
          <LanguageToggler />
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Header;