"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { t, tr } from "@/lib/i18n";
import { SITE_TAGLINE, UNIVERSITY, type Locale } from "@/lib/site";
import { useLocale } from "@/hooks/useLocale";
import { useTheme } from "@/hooks/useTheme";
import LanguageToggler from "../languageToggler/LanguageToggler";
import ThemeToggler from "../themeToggler/ThemeToggler";
import { cx } from "../ui/primitives";

import AztuDark from "@/../public/assets/aztu-logo-dark-320.png";
import AztuLight from "@/../public/assets/aztu-logo-light-320.png";

interface NavItem {
  href: string;
  label: string;
  /** Present when the item opens a panel instead of navigating. */
  children?: { href: string; label: string; description: string; icon: React.ReactNode }[];
}

const GradIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <path d="M12 4L2 9l10 5 10-5-10-5z" strokeLinejoin="round" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" />
  </svg>
);

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z" strokeLinejoin="round" />
    <path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z" strokeLinejoin="round" />
  </svg>
);

const BuildingIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <path d="M3 21h18M5 21V6l7-3 7 3v15" strokeLinejoin="round" />
    <path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" strokeLinecap="round" />
  </svg>
);

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function buildNav(lang: string, locale: Locale): NavItem[] {
  return [
    {
      href: `/${lang}/bachelor`,
      label: t("header", "specialties", locale),
      children: [
        {
          href: `/${lang}/bachelor`,
          label: t("header", "bachelor", locale),
          description: tr(locale, "4 illik bakalavr proqramları", "Four-year undergraduate programmes"),
          icon: GradIcon,
        },
        {
          href: `/${lang}/master`,
          label: t("header", "master", locale),
          description: tr(locale, "2 illik magistr proqramları", "Two-year graduate programmes"),
          icon: BookIcon,
        },
      ],
    },
    { href: `/${lang}/faculties`, label: t("header", "faculties", locale) },
    { href: `/${lang}/contact`, label: tr(locale, "Əlaqə", "Contact") },
  ];
}

export default function Header() {
  const { locale, lang } = useLocale();
  const { isDark } = useTheme();
  const pathname = usePathname() ?? "";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const nav = buildNav(lang, locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Route changes must dismiss both menus.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes whatever is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openWithDelay = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  // A short grace period stops the panel flickering shut as the pointer
  // travels from the trigger down into it.
  const closeWithDelay = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  /** Programme list pages should also light up the "Programmes" trigger. */
  const programmesActive =
    isActive(`/${lang}/bachelor`) ||
    isActive(`/${lang}/master`) ||
    pathname.startsWith(`/${lang}/programmes`);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 no-print",
        scrolled
          ? "border-[var(--border-subtle)] bg-[var(--surface-card)]/85 shadow-[var(--shadow-header)] backdrop-blur-xl"
          : "border-transparent bg-[var(--surface-card)]"
      )}
    >
      {/* Thin brand rule — the sky-blue from the AzTU wordmark. */}
      <div aria-hidden className="h-[3px] w-full bg-gradient-to-r from-navy-700 via-sky-brand-400 to-navy-700" />

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo + wordmark */}
        <Link
          href={`/${lang}`}
          className="flex shrink-0 items-center gap-3 rounded-lg transition-opacity hover:opacity-80"
        >
          <Image
            src={isDark ? AztuLight : AztuDark}
            alt={locale === "az" ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}
            width={160}
            height={219}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="hidden border-l border-[var(--border-subtle)] pl-3 sm:block">
            <span className="block text-[13.5px] font-extrabold leading-tight text-[var(--text-strong)]">
              {UNIVERSITY.shortName}
            </span>
            <span className="block text-[11px] font-medium leading-tight text-[var(--text-muted)]">
              {SITE_TAGLINE[locale]}
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.children ? programmesActive : isActive(item.href);

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "relative rounded-lg px-3.5 py-2 text-[14px] font-semibold transition-colors",
                    active
                      ? "text-[var(--brand-accent)]"
                      : "text-[var(--text-body)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-strong)]"
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--brand-accent)]"
                    />
                  )}
                </Link>
              );
            }

            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openWithDelay(item.label)}
                onMouseLeave={closeWithDelay}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${menuId}-${item.label}`}
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  className={cx(
                    "relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[14px] font-semibold transition-colors",
                    active || open
                      ? "text-[var(--brand-accent)]"
                      : "text-[var(--text-body)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-strong)]"
                  )}
                >
                  {item.label}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className={cx("h-3.5 w-3.5 opacity-60 transition-transform duration-200", open && "rotate-180")}
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[var(--brand-accent)]"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      id={`${menuId}-${item.label}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute left-0 top-full w-[340px] pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-[var(--shadow-card-hover)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-[var(--surface-sunken)]"
                          >
                            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                              {child.icon}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[14px] font-bold text-[var(--text-strong)]">
                                {child.label}
                              </span>
                              <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--text-muted)]">
                                {child.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggler />
          <div className="hidden sm:block">
            <LanguageToggler />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? tr(locale, "Menyunu bağla", "Close menu") : tr(locale, "Menyunu aç", "Open menu")}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-body)] transition-colors hover:bg-[var(--surface-sunken)] active:scale-90 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-[71px] z-40 bg-navy-950/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              aria-label="Mobile"
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full overflow-y-auto border-b border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 shadow-xl"
            >
              {[
                { href: `/${lang}/bachelor`, label: t("header", "bachelor", locale), icon: GradIcon },
                { href: `/${lang}/master`, label: t("header", "master", locale), icon: BookIcon },
                { href: `/${lang}/faculties`, label: t("header", "faculties", locale), icon: BuildingIcon },
                { href: `/${lang}/contact`, label: tr(locale, "Əlaqə", "Contact"), icon: MailIcon },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "flex items-center gap-3.5 rounded-xl px-3 py-3.5 text-[15px] font-semibold transition-colors",
                    isActive(item.href)
                      ? "bg-[var(--brand-tint)] text-[var(--brand-accent)]"
                      : "text-[var(--text-body)] hover:bg-[var(--surface-sunken)]"
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 flex justify-center border-t border-[var(--border-subtle)] pt-4 sm:hidden">
                <LanguageToggler />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
