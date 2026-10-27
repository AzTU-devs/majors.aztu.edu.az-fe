import type { Metadata } from "next";
import Link from "next/link";

import { TileArt } from "@/components/art/TileArt";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import { IconArrowUpRight, IconBuilding, IconLayers, IconUsers } from "@/components/ui/icons";
import { EmptyState, Pill, cx } from "@/components/ui/primitives";
import { fetchCafedras, fetchFaculties, mapLimit, orFallback } from "@/lib/api";
import { facultyIndex, facultyStyleMap } from "@/lib/catalogue";
import { styleFromKey } from "@/lib/hues";
import { tr } from "@/lib/i18n";
import { breadcrumbSchema, graph, itemListSchema } from "@/lib/jsonld";
import { facultyPath, ogPath } from "@/lib/routes";
import { countLabel } from "@/lib/sections";
import { pageMetadata } from "@/lib/seo";
import { localeParam } from "@/lib/params";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const locale = localeParam((await params).lang);
  const az = locale === "az";
  return pageMetadata({
    locale,
    path: "/faculties",
    title: az ? "Fakültələr və kafedralar" : "Faculties and departments",
    description: az
      ? "Azərbaycan Texniki Universitetinin fakültələri, onlara aid kafedralar və hər kafedranın apardığı təhsil proqramları."
      : "The faculties of Azerbaijan Technical University, their departments, and the programmes each department runs.",
    image: ogPath(locale, "page", "faculties"),
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = localeParam((await params).lang);
  const az = locale === "az";
  // Primary content: an outage here is an error page, not an empty list.
  const faculties = await fetchFaculties(locale);
  const [index, styles, cafedras] = await Promise.all([
    facultyIndex(locale),
    facultyStyleMap(),
    mapLimit(faculties, 6, (f) => orFallback(fetchCafedras(f.faculty_code, locale), null)),
  ]);

  const totalDepartments = cafedras.every((c) => c !== null)
    ? cafedras.reduce((sum, c) => sum + (c?.length ?? 0), 0)
    : null;
  const totalProgrammes = Object.keys(index.facultyOf).length || null;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE_NAME[locale], path: `/${locale}` },
            { name: az ? "Fakültələr" : "Faculties", path: `/${locale}/faculties` },
          ]),
          itemListSchema(
            az ? "Fakültələr" : "Faculties",
            `/${locale}/faculties`,
            faculties.map((f) => ({ name: f.faculty_name, path: facultyPath(locale, f.faculty_code) }))
          )
        )}
      />
      <PageHero
        locale={locale}
        hue="k-build"
        crumbs={[{ label: tr(locale, "Ana səhifə", "Home"), href: `/${locale}` }, { label: tr(locale, "Fakültələr", "Faculties") }]}
        kicker={tr(locale, "Universitetin strukturu", "University structure")}
        title={tr(locale, "Fakültələr", "Faculties")}
        lead={tr(
          locale,
          "Azərbaycan Texniki Universitetinin fakültələri, onların kafedraları və hər kafedranın apardığı bakalavr və magistr ixtisasları.",
          "The faculties of Azerbaijan Technical University, their departments, and the bachelor's and master's programmes each department runs."
        )}
        art="arch"
        meta={
          <>
            <Pill tone="k0">
              <IconBuilding />
              {countLabel(faculties.length, locale, "faculty")}
            </Pill>
            {totalDepartments !== null && (
              <Pill tone="k0">
                <IconUsers />
                {countLabel(totalDepartments, locale, "department")}
              </Pill>
            )}
            {totalProgrammes !== null && (
              <Pill tone="k0">
                <IconLayers />
                {countLabel(totalProgrammes, locale, "programme")}
              </Pill>
            )}
          </>
        }
      />

      <section className="wrap py-12 md:py-16" aria-labelledby="faculty-list">
        <h2 id="faculty-list" className="sr-only">
          {tr(locale, "Fakültələrin siyahısı", "List of faculties")}
        </h2>
        {faculties.length === 0 ? (
          <EmptyState
            icon={<IconBuilding size={26} />}
            message={tr(locale, "Fakültə tapılmadı.", "No faculties found.")}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((f, i) => {
              const style = styles[f.faculty_code] ?? styleFromKey(f.faculty_code);
              const count = index.counts[f.faculty_code];
              const deps = cafedras[i];
              return (
                <li key={f.faculty_code} className="flex">
                  <Link href={facultyPath(locale, f.faculty_code)} className={cx(style.hue, "cat-tile min-h-[260px] w-full")}>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="name max-w-[20ch] text-[21px]">{f.faculty_name}</h3>
                      <span className="go" aria-hidden>
                        <IconArrowUpRight />
                      </span>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-8">
                      {deps && <span className="count">{countLabel(deps.length, locale, "department")}</span>}
                      {count && <span className="count">{countLabel(count.total, locale, "programme")}</span>}
                    </div>
                    <span aria-hidden className="art-box -bottom-5 -right-5 h-[62%] w-[42%]">
                      <TileArt name={style.art} preserve="xMaxYMax meet" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
