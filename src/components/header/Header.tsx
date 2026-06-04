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
import { AnimatePresence, motion } from "framer-motion";

export type Locale = "az" | "en";

const Header = () => {
  const { lang } = useParams();
  const pathname = usePathname();
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname?.startsWith(`/${lang}/${href}`);

  const navLink =
    "px-3.5 py-2 rounded-lg text-[14px] font-medium text-slate-600 hover:text-[#182f79] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-200";
  const navLinkActive =
    "text-[#182f79] bg-slate-100 dark:text-white dark:bg-slate-800";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-shadow duration-300 ${
        scrolled
          ? "border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
          : "border-transparent bg-white dark:bg-slate-900"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src={Aztu} alt="Azərbaycan Texniki Universiteti" width={72} height={72} className="h-11 w-auto object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="relative group">
            <button className={navLink + " flex items-center gap-1"}>
              {t("header", "specialties", locale)}
              <svg className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full w-56 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <Link href={`/${lang}/bachelor`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#182f79] dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#182f79]/10 text-base dark:bg-blue-400/10">🎓</span>
                  {t("header", "bachelor", locale)}
                </Link>
                <Link href={`/${lang}/master`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#182f79] dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#182f79]/10 text-base dark:bg-blue-400/10">📚</span>
                  {t("header", "master", locale)}
                </Link>
              </div>
            </div>
          </div>

          <Link href={`/${lang}/faculties`} className={`${navLink} ${isActive("faculties") ? navLinkActive : ""}`}>
            {t("header", "faculties", locale)}
          </Link>
          <Link href={`/${lang}/contact`} className={`${navLink} ${isActive("contact") ? navLinkActive : ""}`}>
            {locale === "az" ? "Əlaqə" : "Contact"}
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggler onDark={isDark} />
          <div className="hidden sm:block">
            <LanguageToggler onDark={isDark} />
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 active:scale-90 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-slate-950/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="border-b border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              {[
                { href: `/${lang}/bachelor`, label: t("header", "bachelor", locale), icon: "🎓" },
                { href: `/${lang}/master`, label: t("header", "master", locale), icon: "📚" },
                { href: `/${lang}/faculties`, label: t("header", "faculties", locale), icon: "🏛️" },
                { href: `/${lang}/contact`, label: locale === "az" ? "Əlaqə" : "Contact", icon: "✉️" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#182f79]/10 text-lg dark:bg-blue-400/10">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex justify-center border-t border-slate-100 pt-3 dark:border-slate-800 sm:hidden">
                <LanguageToggler onDark={isDark} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
