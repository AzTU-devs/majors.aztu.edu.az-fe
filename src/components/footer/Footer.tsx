"use client";

import Link from "next/link";
import Image from "next/image";
import { t, tr } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import { SITE_TAGLINE, UNIVERSITY } from "@/lib/site";
import { Container } from "../ui/primitives";

import AztuLogoLight from "@/../public/assets/aztu-logo-light-320.png";

/** "+994125383383" -> "(+994 12) 538-33-83" */
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const national = digits.startsWith("994") ? digits.slice(3) : digits;
  const m = national.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `(+994 ${m[1]}) ${m[2]}-${m[3]}-${m[4]}` : raw;
}

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
    <path
      d="M5 3h3.5l1.5 4.5-2 1.4a12.5 12.5 0 006.1 6.1l1.4-2L20 14.5V18a2 2 0 01-2.2 2A16.5 16.5 0 013 6.2 2 2 0 015 3z"
      strokeLinejoin="round"
    />
  </svg>
);

const PinIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function Footer() {
  const { locale, lang } = useLocale();
  const az = locale === "az";

  const columns = [
    {
      title: tr(locale, "Təhsil proqramları", "Programmes"),
      links: [
        { href: `/${lang}/bachelor`, label: t("header", "bachelor", locale) },
        { href: `/${lang}/master`, label: t("header", "master", locale) },
        { href: `/${lang}/faculties`, label: t("header", "faculties", locale) },
      ],
    },
    {
      title: tr(locale, "Universitet", "University"),
      links: [
        { href: `/${lang}/contact`, label: tr(locale, "Əlaqə", "Contact") },
        { href: UNIVERSITY.url, label: "aztu.edu.az", external: true },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-navy-700 text-white no-print">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_110%_at_10%_-20%,#2f4184_0%,transparent_55%)]"
      />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 text-white opacity-[0.05]" />

      <Container className="relative py-14 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href={`/${lang}`} className="inline-flex items-center gap-3.5">
              <Image
                src={AztuLogoLight}
                alt={az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}
                width={160}
                height={219}
                className="h-14 w-auto object-contain"
              />
              <span className="border-l border-white/20 pl-3.5">
                <span className="block text-[15px] font-extrabold leading-tight">{UNIVERSITY.shortName}</span>
                <span className="block text-[11.5px] leading-tight text-white/55">{SITE_TAGLINE[locale]}</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-white/55">
              {tr(
                locale,
                "Azərbaycan Texniki Universiteti — 1920-ci ildən texniki elmlər sahəsində aparıcı ali təhsil müəssisəsi.",
                "Azerbaijan Technical University — a leading institution of higher technical education since 1920."
              )}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <h2 className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/40">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13.5px] text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-[13.5px] text-white/60 transition-colors hover:text-white"
                      >
                        <span
                          aria-hidden
                          className="h-px w-0 overflow-hidden bg-sky-brand-400 transition-all duration-200 group-hover:w-3"
                        />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-3">
            <h2 className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/40">
              {tr(locale, "Əlaqə", "Contact")}
            </h2>
            <ul className="flex flex-col gap-2.5 text-[13.5px]">
              <li>
                <a
                  href={`mailto:${UNIVERSITY.email}`}
                  className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                >
                  <span className="opacity-60">{MailIcon}</span>
                  {UNIVERSITY.email}
                </a>
              </li>
              {UNIVERSITY.phones.map((num) => (
                <li key={num}>
                  <a
                    href={`tel:${num}`}
                    className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                  >
                    <span className="opacity-60">{PhoneIcon}</span>
                    {formatPhone(num)}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2 text-white/60">
                <span className="mt-0.5 opacity-60">{PinIcon}</span>
                <address className="not-italic leading-relaxed">
                  {az ? UNIVERSITY.address.streetAz : UNIVERSITY.address.streetEn},{" "}
                  {az ? UNIVERSITY.address.cityAz : UNIVERSITY.address.cityEn}
                </address>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright bar */}
      <div className="relative border-t border-white/10 bg-navy-800/60">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-center text-[12px] text-white/40">
            © {new Date().getFullYear()}{" "}
            {tr(
              locale,
              "Azərbaycan Texniki Universiteti. Bütün hüquqlar qorunur.",
              "Azerbaijan Technical University. All rights reserved."
            )}
          </p>
          <a
            href={UNIVERSITY.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-white/40 transition-colors hover:text-white/70"
          >
            aztu.edu.az
          </a>
        </Container>
      </div>
    </footer>
  );
}
