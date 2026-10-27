import Link from "next/link";

import { BrandLockup } from "@/components/brand/AztuMark";
import { IconExternal, IconMail, IconPhone, IconPin } from "@/components/ui/icons";
import { t, tr } from "@/lib/i18n";
import { facultyPath } from "@/lib/routes";
import { BRAND_WORDMARK, UNIVERSITY, type Locale } from "@/lib/site";

/** "+994125383383" -> "(+994 12) 538-33-83" */
export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const national = digits.startsWith("994") ? digits.slice(3) : digits;
  const m = national.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `(+994 ${m[1]}) ${m[2]}-${m[3]}-${m[4]}` : raw;
}

export default function Footer({
  locale,
  faculties,
}: {
  locale: Locale;
  faculties: { code: string; name: string }[];
}) {
  const az = locale === "az";
  const address = az
    ? `${UNIVERSITY.nameAz}, ${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz}`
    : `${UNIVERSITY.nameEn}, ${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn}`;

  const programmes = [
    { href: `/${locale}/programmes`, label: tr(locale, "Bütün ixtisaslar", "All programmes") },
    { href: `/${locale}/bachelor`, label: tr(locale, "Bakalavr ixtisasları", "Bachelor's programmes") },
    { href: `/${locale}/master`, label: tr(locale, "Magistr ixtisasları", "Master's programmes") },
    { href: `/${locale}/faculties`, label: tr(locale, "Fakültələr və kafedralar", "Faculties and departments") },
  ];

  return (
    <footer className="site-footer no-print">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-12 lg:col-span-4">
          <Link href={`/${locale}`} className="brand" aria-label={`${UNIVERSITY.shortName} ${BRAND_WORDMARK[locale]} — ${t("header", "home", locale)}`}>
            <BrandLockup locale={locale} size="lg" />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-2">
            {tr(
              locale,
              "Azərbaycan Texniki Universitetinin bütün bakalavr və magistr ixtisasları — tədris planları, sillabuslar, təlim nəticələri, səriştələr və karyera imkanları ilə bir yerdə.",
              "Every bachelor's and master's programme at Azerbaijan Technical University — with curricula, syllabi, learning outcomes, competencies and career paths, in one place."
            )}
          </p>
        </div>

        <nav aria-label={tr(locale, "Proqramlar", "Programmes")} className="md:col-span-4 lg:col-span-2">
          <h2 className="font-display text-[15px] font-bold text-ink">{tr(locale, "Proqramlar", "Programmes")}</h2>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            {programmes.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="fl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("header", "faculties", locale)} className="md:col-span-4 lg:col-span-3">
          <h2 className="font-display text-[15px] font-bold text-ink">{t("header", "faculties", locale)}</h2>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            {faculties.slice(0, 8).map((f) => (
              <li key={f.code}>
                <Link href={facultyPath(locale, f.code)} className="fl">
                  {f.name}
                </Link>
              </li>
            ))}
            {faculties.length === 0 && (
              <li>
                <Link href={`/${locale}/faculties`} className="fl">
                  {tr(locale, "Bütün fakültələr", "All faculties")}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="md:col-span-4 lg:col-span-3">
          <h2 className="font-display text-[15px] font-bold text-ink">{tr(locale, "Əlaqə", "Contact")}</h2>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            <li>
              <a href={`mailto:${UNIVERSITY.email}`} className="fl inline-flex items-center gap-2.5">
                <IconMail size={17} className="text-ink-3" />
                {UNIVERSITY.email}
              </a>
            </li>
            {UNIVERSITY.phones.map((num) => (
              <li key={num}>
                <a href={`tel:${num}`} className="fl inline-flex items-center gap-2.5">
                  <IconPhone size={17} className="text-ink-3" />
                  {formatPhone(num)}
                </a>
              </li>
            ))}
            <li>
              <Link href={`/${locale}/contact`} className="fl inline-flex items-center gap-2.5">
                <IconPin size={17} className="text-ink-3" />
                {tr(locale, "Ünvan və xəritə", "Address and map")}
              </Link>
            </li>
            <li>
              <a href={UNIVERSITY.url} target="_blank" rel="noopener noreferrer" className="fl inline-flex items-center gap-2.5">
                <IconExternal size={17} className="text-ink-3" />
                aztu.edu.az
                <span className="sr-only">{tr(locale, "(yeni pəncərədə açılır)", "(opens in a new tab)")}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 text-[13.5px] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}.{" "}
            {tr(locale, "Bütün hüquqlar qorunur.", "All rights reserved.")}
          </p>
          <address className="not-italic">{address}</address>
        </div>
      </div>
    </footer>
  );
}
