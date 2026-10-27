import Link from "next/link";

import { TileArt } from "@/components/art/TileArt";
import { IconArrowRight, IconSearch } from "@/components/ui/icons";
import { ButtonLink, Kicker, cx } from "@/components/ui/primitives";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/lib/site";

/** The 404 page body (rendered inside the site header and footer). */
export default function NotFoundContent({ locale }: { locale: Locale }) {
  const links = [
    { href: `/${locale}/bachelor`, label: tr(locale, "Bakalavr ixtisasları", "Bachelor's programmes"), hue: "k-navy", art: "blocks" as const },
    { href: `/${locale}/master`, label: tr(locale, "Magistr ixtisasları", "Master's programmes"), hue: "k-gold", art: "book" as const },
    { href: `/${locale}/faculties`, label: tr(locale, "Fakültələr", "Faculties"), hue: "k-build", art: "arch" as const },
    { href: `/${locale}/contact`, label: tr(locale, "Əlaqə", "Contact"), hue: "k-data", art: "route" as const },
  ];
  return (
    <section className="wrap grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12" aria-labelledby="nf-title">
      <div className="lg:col-span-7">
        <Kicker>{tr(locale, "Xəta 404", "Error 404")}</Kicker>
        <h1 id="nf-title" className="d-xl mt-5">
          {tr(locale, "Səhifə tapılmadı", "Page not found")}
        </h1>
        <p className="lead mt-6 max-w-[36rem]">
          {tr(
            locale,
            "Axtardığınız səhifə mövcud deyil, silinib və ya ünvanı dəyişib. İxtisası adı ilə axtarın və ya aşağıdakı bölmələrdən birinə keçin.",
            "The page you are looking for does not exist, was removed or has moved. Search for a programme by name, or go to one of the sections below."
          )}
        </p>
        <form role="search" action={`/${locale}/programmes`} method="get" className="field-search mt-9 max-w-[36rem] !h-14">
          <IconSearch />
          <label htmlFor="nf-search" className="sr-only">
            {tr(locale, "İxtisas axtarın", "Search programmes")}
          </label>
          <input id="nf-search" name="q" type="search" placeholder={tr(locale, "İxtisas adı və ya kodu…", "Programme name or code…")} />
          <button type="submit" className="btn btn-primary btn-sm">
            {tr(locale, "Axtarın", "Search")}
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}`} tone="ghost" arrow>
            {tr(locale, "Ana səhifəyə qayıdın", "Back to the home page")}
          </ButtonLink>
        </div>
      </div>
      <div className="lg:col-span-5">
        <ul className="grid grid-cols-2 gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cx(l.hue, "cat-tile aspect-square !p-5")}>
                <span className="name text-[17px]">{l.label}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-[13.5px] font-semibold text-k-700">
                  {tr(locale, "Keçin", "Go")}
                  <IconArrowRight size={16} />
                </span>
                <span aria-hidden className="art-box -bottom-4 -right-4 h-[55%] w-[55%]">
                  <TileArt name={l.art} preserve="xMaxYMax meet" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
