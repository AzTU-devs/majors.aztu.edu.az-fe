"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { BrandLockup } from "@/components/brand/AztuMark";
import { TileArt } from "@/components/art/TileArt";
import LanguageToggler from "@/components/languageToggler/LanguageToggler";
import ThemeToggler from "@/components/themeToggler/ThemeToggler";
import { IconArrowRight, IconChevronDown, IconClose, IconMenu, IconSearch } from "@/components/ui/icons";
import { cx } from "@/components/ui/primitives";
import { t, tr } from "@/lib/i18n";
import type { ArtName, Hue } from "@/lib/hues";
import { facultyPath } from "@/lib/routes";
import { BRAND_WORDMARK, UNIVERSITY, type Locale } from "@/lib/site";

export interface NavFaculty {
  code: string;
  name: string;
  hue: Hue;
  art: ArtName;
}

function SearchForm({ locale, id, className }: { locale: Locale; id: string; className?: string }) {
  const label = tr(locale, "İxtisas axtarın", "Search programmes");
  return (
    <form role="search" action={`/${locale}/programmes`} method="get" className={className}>
      <IconSearch />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} name="q" type="search" placeholder={`${label}…`} autoComplete="off" enterKeyHint="search" />
    </form>
  );
}

/**
 * Site header: sticky, transparent over the page until it scrolls, then a
 * frosted surface. Brand block, main navigation (with a faculties panel),
 * programme search, language and theme switches; a disclosure menu below lg.
 */
export default function Header({ locale, faculties }: { locale: Locale; faculties: NavFaculty[] }) {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();
  const mobileId = useId();
  const panelWrap = useRef<HTMLDivElement>(null);
  const panelButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // A navigation closes whatever is open.
  useEffect(() => {
    setMobileOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  // While the mobile menu is open it behaves like a modal: page scroll is
  // locked, focus moves into the menu and stays within the header (Tab and
  // Shift+Tab wrap around), and the rest of the page is inert — keyboard and
  // screen-reader users cannot wander behind the menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const header = headerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobilePanel.current?.querySelector<HTMLElement>("input, a, button")?.focus();

    const outside = [document.getElementById("main"), document.querySelector<HTMLElement>("footer.site-footer"), document.querySelector<HTMLElement>(".skip-link")];
    for (const el of outside) el?.setAttribute("inert", "");

    const focusables = () =>
      Array.from(
        header?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []
      ).filter((el) => el.getClientRects().length > 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !header) return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && header.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (header && e.target instanceof Node && !header.contains(e.target)) focusables()[0]?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.body.style.overflow = previous;
      for (const el of outside) el?.removeAttribute("inert");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [mobileOpen]);

  // The menu exists below lg only: widening the window closes it (otherwise
  // the page would stay inert behind a menu that is no longer shown).
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (wide.matches) setMobileOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  const open = useRef({ panel: false, mobile: false });
  useEffect(() => {
    open.current = { panel: panelOpen, mobile: mobileOpen };
  }, [panelOpen, mobileOpen]);

  // Escape closes (focus returns to the control that opened it); a click
  // outside the faculties panel closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open.current.panel) {
        setPanelOpen(false);
        panelButton.current?.focus();
      }
      if (open.current.mobile) {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (panelWrap.current && !panelWrap.current.contains(e.target as Node)) setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  // Tabbing out of the faculties panel closes it.
  const onPanelBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPanelOpen(false);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const nav = [
    { href: `/${locale}/bachelor`, label: t("header", "bachelor", locale) },
    { href: `/${locale}/master`, label: t("header", "master", locale) },
  ];
  const contact = { href: `/${locale}/contact`, label: tr(locale, "Əlaqə", "Contact") };
  const facultiesHref = `/${locale}/faculties`;
  const facultiesLabel = t("header", "faculties", locale);

  return (
    <header ref={headerRef} className={cx("site-header no-print", (scrolled || mobileOpen) && "is-scrolled", mobileOpen && "is-open")}>
      <div className="wrap bar flex items-center gap-4 lg:gap-8">
        <Link
          href={`/${locale}`}
          className="brand shrink-0"
          aria-label={`${UNIVERSITY.shortName} ${BRAND_WORDMARK[locale]} — ${t("header", "home", locale)}`}
        >
          <BrandLockup locale={locale} />
        </Link>

        <nav aria-label={tr(locale, "Əsas menyu", "Main")} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div ref={panelWrap} className="relative" onBlur={onPanelBlur}>
            <button
              ref={panelButton}
              type="button"
              className={cx("nav-link", isActive(facultiesHref) && "is-active")}
              aria-expanded={panelOpen}
              aria-controls={panelId}
              onClick={() => setPanelOpen((v) => !v)}
            >
              {facultiesLabel}
              <IconChevronDown
                size={16}
                className={cx("transition-transform duration-200", panelOpen && "rotate-180")}
              />
            </button>
            <div
              id={panelId}
              hidden={!panelOpen}
              className="absolute left-1/2 top-full z-10 mt-3 w-[min(560px,calc(100vw-48px))] -translate-x-1/2 rounded-[26px] bg-surface p-3 elev-3 ring-line"
            >
              <ul className="grid gap-1 sm:grid-cols-2">
                {faculties.map((f) => (
                  <li key={f.code}>
                    <Link
                      href={facultyPath(locale, f.code)}
                      className={cx(f.hue, "flex items-center gap-3 rounded-[16px] p-2.5 transition-colors hover:bg-k-50")}
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[12px] bg-k-100">
                        <TileArt name={f.art} className="absolute inset-0 h-full w-full" />
                      </span>
                      <span className="text-[14px] font-semibold leading-snug text-ink">{f.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={facultiesHref}
                className="mt-2 flex items-center justify-between rounded-[16px] bg-paper-2 px-4 py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-2"
              >
                {tr(locale, "Bütün fakültələr və kafedralar", "All faculties and departments")}
                <IconArrowRight size={18} />
              </Link>
            </div>
          </div>

          <Link href={contact.href} className="nav-link" aria-current={isActive(contact.href) ? "page" : undefined}>
            {contact.label}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <SearchForm locale={locale} id="site-search" className="search-trigger hidden w-[250px] xl:flex" />
          <Link
            href={`/${locale}/programmes`}
            className="btn-icon hidden sm:inline-grid xl:hidden"
            aria-label={tr(locale, "İxtisas axtarın", "Search programmes")}
          >
            <IconSearch />
          </Link>
          <LanguageToggler locale={locale} className="hidden sm:inline-flex" />
          <ThemeToggler locale={locale} />
          <Link href={`/${locale}/programmes`} className="btn btn-primary btn-sm hidden xl:inline-flex">
            {tr(locale, "Bütün ixtisaslar", "All programmes")}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="btn-icon line lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? tr(locale, "Menyunu bağla", "Close menu") : tr(locale, "Menyunu aç", "Open menu")}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div
        id={mobileId}
        ref={mobilePanel}
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line bg-surface lg:hidden"
      >
        <div className="wrap flex flex-col gap-6 py-6">
          <SearchForm locale={locale} id="mobile-search" className="field-search" />

          <nav aria-label={tr(locale, "Mobil menyu", "Mobile")}>
            <ul className="flex flex-col">
              {[
                ...nav,
                { href: `/${locale}/programmes`, label: tr(locale, "Bütün ixtisaslar", "All programmes") },
                { href: facultiesHref, label: facultiesLabel },
                contact,
              ].map((item) => (
                <li key={item.href} className="border-b border-line last:border-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-center justify-between py-4 font-display text-[19px] font-bold tracking-[-0.01em] text-ink aria-[current=page]:text-navy"
                  >
                    {item.label}
                    <IconArrowRight size={18} className="text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {faculties.length > 0 && (
            <div>
              <p className="kicker">{facultiesLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {faculties.map((f) => (
                  <li key={f.code}>
                    <Link href={facultyPath(locale, f.code)} className={cx(f.hue, "chip sm with-sw")}>
                      <span className="sw">
                        <TileArt name={f.art} />
                      </span>
                      <span className="max-w-[16rem] truncate">{f.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between rounded-[18px] bg-paper-2 px-3 py-2 sm:hidden">
            <LanguageToggler locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
