"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams, usePathname } from "next/navigation";
import Aztu from "@/../public/assets/aztu_logo.png";
import LanguageToggler from "../languageToggler/LanguageToggler";
import ThemeToggler from "../themeToggler/ThemeToggler";
import { motion } from "framer-motion";

export type Locale = "az" | "en";

const Header = () => {
  const { lang } = useParams();
  const pathname = usePathname();
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const theme = useSelector((state: RootState) => state.theme.value);
  const [scrolled, setScrolled] = useState(false);

  // Detect if we're on the home page (hero image behind header)
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  const navBg = scrolled
    ? isDark
      ? "bg-slate-900/95 backdrop-blur-md shadow-md border border-slate-700/60"
      : "bg-white/95 backdrop-blur-md shadow-md border border-[#e2e8f0]/60"
    : isHomePage
    ? "bg-white/15 backdrop-blur-md border border-white/20"
    : isDark
    ? "bg-slate-900/90 backdrop-blur-md shadow-sm border border-slate-700/60"
    : "bg-white/90 backdrop-blur-md shadow-sm border border-[#e2e8f0]/60";

  const linkColor =
    scrolled || !isHomePage
      ? isDark
        ? "text-slate-100"
        : "text-[#1e293b]"
      : "text-white";

  const linkHover =
    scrolled || !isHomePage
      ? isDark
        ? "hover:text-blue-400"
        : "hover:text-[#182f79]"
      : "hover:text-white/80";

  const dropdownItemColor = isDark
    ? "text-slate-100 hover:text-blue-400 hover:bg-slate-700"
    : "text-[#1e293b] hover:text-[#182f79] hover:bg-blue-50";

  const dropdownBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-[#e2e8f0]";

  const dividerColor = isDark ? "border-slate-700" : "border-[#f1f5f9]";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${scrolled ? "fixed top-0 left-0" : "absolute top-0 left-0"} z-[999] w-full`}
    >
      <motion.nav
        animate={{ width: scrolled ? "70%" : "92%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={{ width: scrolled ? "70%" : "92%" }}
        className={`mx-auto mt-3 flex justify-between items-center py-3 px-6 rounded-2xl ${navBg} h-[68px] transition-colors duration-300`}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={`/${lang}`}>
            <Image
              src={Aztu}
              alt="Azərbaycan Texniki Universiteti"
              width={88}
              height={88}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <ul className="flex items-center gap-1">
          {/* Specialties dropdown */}
          <li className="relative group">
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[14px] font-semibold ${linkColor} ${linkHover} transition-colors duration-200`}
            >
              {t("header", "specialties", locale)}
              <svg
                className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className={`absolute left-0 mt-1 w-52 ${dropdownBg} rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden`}>
              <Link
                href={`/${lang}/bachelor`}
                className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium ${dropdownItemColor} transition-colors duration-150`}
              >
                <span className="text-lg">🎓</span>
                <span>{t("header", "bachelor", locale)}</span>
              </Link>
              <div className={`mx-4 border-t ${dividerColor}`} />
              <Link
                href={`/${lang}/master`}
                className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium ${dropdownItemColor} transition-colors duration-150`}
              >
                <span className="text-lg">📚</span>
                <span>{t("header", "master", locale)}</span>
              </Link>
            </div>
          </li>

          {/* Faculties */}
          <li>
            <Link
              href={`/${lang}/faculties`}
              className={`px-4 py-2 rounded-xl text-[14px] font-semibold ${linkColor} ${linkHover} transition-colors duration-200`}
            >
              {t("header", "faculties", locale)}
            </Link>
          </li>
        </ul>

        {/* Controls */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <ThemeToggler />
          <LanguageToggler />
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Header;
