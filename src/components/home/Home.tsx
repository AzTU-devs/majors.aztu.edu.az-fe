import Link from "next/link";

import { CoverArt, TileArt } from "@/components/art/TileArt";
import { HeroBand, HeroMosaic } from "@/components/art/Mosaic";
import {
  BachelorArt,
  MasterArt,
  StepCurriculumArt,
  StepOutcomesArt,
  StepSearchArt,
  SyllabusSheet,
} from "@/components/art/Scenes";
import { ProgrammeCoverCard } from "@/components/catalogue/ProgrammeCard";
import Carousel from "@/components/home/Carousel";
import HeroSearch from "@/components/home/HeroSearch";
import {
  IconArrowUpRight,
  IconBook,
  IconCap,
  IconCheckCircle,
  IconClock,
  IconHash,
  IconPlus,
  IconTarget,
} from "@/components/ui/icons";
import { ArrowLink, ButtonLink, Kicker, SectionHead, cx } from "@/components/ui/primitives";
import type { FacultyMeta, ProgrammeCardData } from "@/lib/catalogue";
import { t, tr } from "@/lib/i18n";
import { catalogPath, facultyPath, programmePath } from "@/lib/routes";
import { countLabel, degreeLabel } from "@/lib/sections";
import type { Locale } from "@/lib/site";

export interface HomeFaculty extends FacultyMeta {
  total: number | null;
  bachelor: number | null;
  master: number | null;
}

export interface HomeProps {
  locale: Locale;
  counts: { bachelor: number | null; master: number | null };
  faculties: HomeFaculty[];
  newest: ProgrammeCardData | null;
  carousel: { card: ProgrammeCardData; isNew: boolean; subjects: number | null }[];
  faq: { q: string; a: string }[];
}

/* ── Hero ──────────────────────────────────────────────────── */

function NewestCard({ p, locale }: { p: ProgrammeCardData; locale: Locale }) {
  return (
    <Link href={programmePath(locale, p.key)} className={cx(p.hue, "float-card group flex items-center gap-4 pr-5")}>
      <div className="cover w-[118px] shrink-0 !rounded-[18px] sm:w-[128px]" style={{ aspectRatio: "16 / 11" }}>
        <CoverArt name={p.art} />
      </div>
      <div className="min-w-0 py-1">
        <span className="pill pill-gold !h-6 !text-[11.5px]">{tr(locale, "Ən yeni proqram", "Newest programme")}</span>
        <p className="clamp-2 mt-2 font-display text-[16.5px] font-bold leading-snug tracking-[-0.012em] text-ink">
          {p.name}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <IconCap size={15} />
            {degreeLabel(p.degree, locale)}
          </span>
          {p.code && <span className="code">{p.code}</span>}
        </p>
      </div>
    </Link>
  );
}

function Hero({ locale, faculties, newest }: Pick<HomeProps, "locale" | "faculties" | "newest">) {
  const az = locale === "az";
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_0%_100%,var(--navy-tint),transparent_70%),radial-gradient(45%_45%_at_100%_0%,var(--gold-tint),transparent_70%)] opacity-80"
      />
      <div className="pt-6 lg:hidden">
        <HeroBand />
      </div>
      <div className="wrap grid gap-12 pb-16 pt-10 md:pb-20 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-14">
        <div className="relative z-10 min-w-0 lg:col-span-6">
          <Kicker>{az ? "Azərbaycan Texniki Universiteti" : "Azerbaijan Technical University"}</Kicker>
          <h1 id="hero-title" className="d-xl mt-5 lg:mt-7">
            {az ? (
              <>
                Gələcəyini AzTU-da{" "}
                <span className="mark">
                  qur
                  <svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M5 16 C 60 5, 140 5, 195 13" />
                  </svg>
                </span>
                .
              </>
            ) : (
              <>
                Build your future at{" "}
                <span className="mark">
                  AzTU
                  <svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M5 16 C 60 5, 140 5, 195 13" />
                  </svg>
                </span>
                .
              </>
            )}
          </h1>
          <p className="lead mt-6 max-w-[34rem] lg:mt-7">
            {tr(
              locale,
              "Universitetin bütün bakalavr və magistr ixtisaslarını araşdırın: tədris planı, fənlərin sillabusları, təlim nəticələri və məzunların karyera imkanları — hamısı bir yerdə.",
              "Explore every bachelor's and master's programme at the university: the curriculum, subject syllabi, learning outcomes and graduate careers — all in one place."
            )}
          </p>

          <div className="mt-9 max-w-[36rem] lg:mt-11">
            <HeroSearch locale={locale} />
          </div>

          {faculties.length > 0 && (
            <div className="mt-7 flex items-start gap-3">
              <span className="mt-3 hidden shrink-0 text-[14px] text-ink-3 sm:block">{t("header", "faculties", locale)}:</span>
              <ul
                className="no-scrollbar -mx-5 flex min-w-0 gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                aria-label={t("header", "faculties", locale)}
              >
                {faculties.map((f) => (
                  <li key={f.code} className="shrink-0">
                    <Link href={facultyPath(locale, f.code)} className={cx(f.hue, "chip")}>
                      <span className="sw">
                        <TileArt name={f.art} />
                      </span>
                      <span className="max-w-[17rem] truncate">{f.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative min-w-0 lg:col-span-6">
          <div className="hidden lg:block">
            <HeroMosaic />
          </div>
          {newest && (
            <div className="relative z-10 lg:absolute lg:-bottom-11 lg:-right-4 lg:w-[400px]">
              <NewestCard p={newest} locale={locale} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Faculty bento ─────────────────────────────────────────── */

/** lg column/row spans for tile `i` of `n` (one 2-row feature tile, then rows). */
function bentoSpan(i: number, n: number): string {
  if (n === 1) return "lg:col-span-12";
  if (n === 2) return "lg:col-span-6 lg:row-span-2";
  if (i === 0) return "lg:col-span-6 lg:row-span-2";
  if (n === 3) return "lg:col-span-6";
  if (n === 4) return i === 3 ? "lg:col-span-6" : "lg:col-span-3";
  if (i <= 4) return "lg:col-span-3";
  const rest = n - 5;
  const posInRest = i - 5;
  const lastRowSize = rest % 3 || 3;
  const inLastRow = posInRest >= rest - lastRowSize;
  if (!inLastRow) return "lg:col-span-4";
  return lastRowSize === 1 ? "lg:col-span-12" : lastRowSize === 2 ? "lg:col-span-6" : "lg:col-span-4";
}

function FacultyBento({ locale, faculties }: { locale: Locale; faculties: HomeFaculty[] }) {
  // The faculty with the most programmes gets the feature tile.
  const order = [...faculties].sort((a, b) => (b.total ?? -1) - (a.total ?? -1));
  const n = order.length;
  return (
    <section className="section" aria-labelledby="faculties-title">
      <div className="wrap">
        <SectionHead
          id="faculties-title"
          title={tr(locale, "Maraqlandığınız fakültədən başlayın", "Start with the faculty that interests you")}
          lead={tr(
            locale,
            "Mühəndislikdən iqtisadiyyata qədər. Fakültəni seçin — kafedraları və bütün ixtisasları bir səhifədə açılsın.",
            "From engineering to economics. Pick a faculty and see its departments and every programme on one page."
          )}
        />
        <ul className="mt-12 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:auto-rows-[232px] lg:grid-cols-12">
          {order.map((f, i) => {
            const feature = i === 0 && n > 2;
            return (
              <li key={f.code} className={cx(feature && "sm:col-span-2", bentoSpan(i, n), "flex")}>
                <Link href={facultyPath(locale, f.code)} className={cx(f.hue, "cat-tile w-full")}>
                  {feature && <span className="paper" aria-hidden />}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={cx(
                        "name max-w-[22ch]",
                        feature ? "text-[clamp(1.75rem,1.2rem+1.6vw,2.6rem)]" : "text-[19px]"
                      )}
                    >
                      {f.name}
                    </h3>
                    <span className="go" aria-hidden>
                      <IconArrowUpRight />
                    </span>
                  </div>
                  {feature && f.total !== null && (
                    <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-k-900/80">
                      {tr(
                        locale,
                        `${f.bachelor ?? 0} bakalavr və ${f.master ?? 0} magistr ixtisası.`,
                        `${f.bachelor ?? 0} bachelor's and ${f.master ?? 0} master's programmes.`
                      )}
                    </p>
                  )}
                  <div className="mt-auto pt-6">
                    {f.total !== null && <span className="count">{countLabel(f.total, locale, "programme")}</span>}
                  </div>
                  <span
                    aria-hidden
                    className={cx(
                      "art-box",
                      feature ? "-bottom-6 -right-4 h-[78%] w-[52%]" : "-bottom-5 -right-5 h-[64%] w-[46%] sm:h-[70%]"
                    )}
                  >
                    <TileArt name={f.art} preserve="xMaxYMax meet" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Programmes carousel ───────────────────────────────────── */

function ProgrammesSection({ locale, items }: { locale: Locale; items: HomeProps["carousel"] }) {
  if (!items.length) return null;
  return (
    <section className="section pt-0" aria-labelledby="newest-title">
      <div className="wrap">
        <Carousel
          locale={locale}
          id="newest-programmes"
          label={tr(locale, "Yeni əlavə olunan ixtisaslar", "Recently added programmes")}
          heading={
            <h2 id="newest-title" className="d-lg max-w-[13ch]">
              {tr(locale, "Kataloqa yeni əlavə olunanlar", "Recently added programmes")}
            </h2>
          }
          extra={<ArrowLink href={catalogPath(locale)}>{tr(locale, "Bütün ixtisaslar", "All programmes")}</ArrowLink>}
        >
          {items.map(({ card, isNew, subjects }) => (
            <li key={card.key} className="w-[82%] shrink-0 snap-start sm:w-[300px] lg:w-[302px]">
              <ProgrammeCoverCard p={card} locale={locale} isNew={isNew} subjects={subjects} />
            </li>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

/* ── Degree levels ─────────────────────────────────────────── */

function DegreeCards({ locale, counts }: { locale: Locale; counts: HomeProps["counts"] }) {
  const cards = [
    {
      degree: 1 as const,
      hue: "k-navy",
      big: tr(locale, "Bakalavr", "Bachelor's"),
      text: tr(
        locale,
        "Ali təhsilin birinci pilləsi: ixtisas üzrə fundamental və peşə hazırlığı. Hər proqramın tam tədris planı və fənləri açıqdır.",
        "The first cycle of higher education: the core and professional grounding of a field. Every programme's full curriculum is open."
      ),
      points: [
        tr(locale, "Tam tədris planı, kredit və semestrlər", "Full curriculum with credits and semesters"),
        tr(locale, "Hər fənnin sillabusu və mövzu planı", "A syllabus and topic plan for every subject"),
        tr(locale, "Proqram təlim məqsədləri və karyera", "Programme outcomes and careers"),
      ],
      count: counts.bachelor,
      cta: tr(locale, "Bakalavr ixtisaslarına baxın", "Browse bachelor's programmes"),
      tone: "primary" as const,
      Art: BachelorArt,
    },
    {
      degree: 2 as const,
      hue: "k-gold",
      big: tr(locale, "Magistr", "Master's"),
      text: tr(
        locale,
        "İkinci pillə: bakalavr məzunları üçün dərin ixtisaslaşma və tədqiqat hazırlığı, ixtisaslaşma istiqamətləri ilə.",
        "The second cycle: deeper specialisation and research training for graduates, with the specialisation tracks."
      ),
      points: [
        tr(locale, "İxtisaslaşma üzrə fənlər", "Subjects of each specialisation"),
        tr(locale, "Səriştələr və uyğunluq matrisləri", "Competencies and matching matrices"),
        tr(locale, "Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)"),
      ],
      count: counts.master,
      cta: tr(locale, "Magistr ixtisaslarına baxın", "Browse master's programmes"),
      tone: "ghost" as const,
      Art: MasterArt,
    },
  ];
  return (
    <section className="section pt-0" aria-labelledby="degrees-title">
      <div className="wrap">
        <h2 id="degrees-title" className="sr-only">
          {tr(locale, "Təhsil pillələri", "Degree levels")}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map(({ degree, hue, big, text, points, count, cta, tone, Art }) => (
            <article key={degree} className={cx(hue, "fmt flex flex-col p-7 pt-0 sm:p-10 sm:pt-0 lg:p-12 lg:pt-0")}>
              <Art className="-mx-4 mb-2 h-auto w-[calc(100%+2rem)] max-w-[460px] self-end sm:-mr-6" />
              <h3 className="big">{big}</h3>
              <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-k-900">{text}</p>
              <ul className="mt-7 flex flex-col gap-3.5 text-[15.5px] text-k-900">
                {points.map((p) => (
                  <li key={p}>
                    <IconCheckCircle />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink href={catalogPath(locale, degree)} tone={tone} size="lg" arrow>
                  {cta}
                </ButtonLink>
                {count !== null && <span className="text-[15px] text-k-700">{countLabel(count, locale, "programme")}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Steps ─────────────────────────────────────────────────── */

function Steps({ locale, example }: { locale: Locale; example: string }) {
  const steps = [
    {
      title: tr(locale, "İxtisası seçin", "Choose a programme"),
      text: tr(
        locale,
        "Kataloqda adı və ya kodu ilə axtarın, təhsil pilləsinə və fakültəyə görə süzün.",
        "Search the catalogue by name or code and filter by degree level and faculty."
      ),
      art: <StepSearchArt term={example} locale={locale} />,
    },
    {
      title: tr(locale, "Kurikulumu araşdırın", "Explore the curriculum"),
      text: tr(
        locale,
        "Tədris planındakı hər fənnin kreditini, semestrini, sillabusunu və mövzularını görün.",
        "See the credits, semester, syllabus and topics of every subject in the curriculum."
      ),
      art: <StepCurriculumArt />,
    },
    {
      title: tr(locale, "Nəticələri görün", "See the outcomes"),
      text: tr(
        locale,
        "Proqramın təlim nəticələri, səriştələri və məzunların karyera imkanları ilə tanış olun.",
        "Review the programme's learning outcomes, competencies and graduate career paths."
      ),
      art: <StepOutcomesArt />,
    },
  ];
  return (
    <section className="section bg-paper-2" aria-labelledby="steps-title">
      <div className="wrap">
        <SectionHead
          id="steps-title"
          title={tr(locale, "Proqramı üç addımda tanıyın", "Get to know a programme in three steps")}
          lead={tr(
            locale,
            "Qeydiyyat tələb olunmur: bütün ixtisasların məlumatı açıqdır və iki dildə təqdim olunur.",
            "No sign-up needed: every programme's information is open and available in two languages."
          )}
        />
        <div aria-hidden className="relative mt-14 hidden h-3 md:block">
          <div className="absolute inset-x-0 top-1/2 h-px bg-line-2" />
          {[0, 1 / 3, 2 / 3, 1].map((x) => (
            <span key={x} className="absolute top-0 h-3 w-px bg-line-2" style={{ left: `${x * 100}%` }} />
          ))}
        </div>
        <ol className="mt-8 grid gap-10 md:mt-6 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-7">
              <div className="h-[190px] overflow-hidden rounded-[28px] bg-surface elev-1 ring-line">{s.art}</div>
              <div className="flex gap-5">
                <span className="step-n shrink-0" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="t-lg">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Syllabus showcase ─────────────────────────────────────── */

function Showcase({ locale }: { locale: Locale }) {
  const features = [
    { icon: <IconClock />, hue: "k-biz", text: tr(locale, "Kredit, semestr və iş yükü", "Credits, semester and workload") },
    { icon: <IconBook />, hue: "k-it", text: tr(locale, "Mövzu planı və mövzu nəticələri", "Topic plan and topic outcomes") },
    { icon: <IconTarget />, hue: "k-build", text: tr(locale, "Fənn təlim nəticələri (CLO)", "Course learning outcomes (CLO)") },
    { icon: <IconHash />, hue: "k-res", text: tr(locale, "Ədəbiyyat və qiymətləndirmə", "Reading list and assessment") },
  ];
  return (
    <section className="section" aria-labelledby="showcase-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="showcase-title" className="d-lg max-w-[14ch]">
            {tr(locale, "Hər fənnin sillabusu bir yerdə", "Every subject's syllabus in one place")}
          </h2>
          <p className="lead mt-6 max-w-[32rem]">
            {tr(
              locale,
              "Sillabus səhifəsi fənn haqqında rəsmi məlumatı toplayır və çap üçün hazırdır.",
              "The syllabus page gathers a subject's official information and is ready to print."
            )}
          </p>
          <ul className="mt-9 flex flex-col gap-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-4 text-[16px] text-ink">
                <span className={cx(f.hue, "grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-k-100 text-k-700")}>
                  {f.icon}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <ArrowLink href={catalogPath(locale)} className="mt-10">
            {tr(locale, "İxtisası seçin", "Choose a programme")}
          </ArrowLink>
        </div>
        <div className="k-navy relative lg:col-span-7">
          <div className="relative overflow-hidden rounded-[36px] bg-k-100 px-5 py-12 sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,var(--k-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--k-200)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <SyllabusSheet locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ───────────────────────────────────────────────────── */

function Faq({ locale, faq }: { locale: Locale; faq: HomeProps["faq"] }) {
  return (
    <section className="section pt-0" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="d-lg max-w-[12ch]">
            {tr(locale, "Tez-tez verilən suallar", "Frequently asked questions")}
          </h2>
          <p className="mt-5 max-w-sm text-[16.5px] leading-relaxed text-ink-2">
            {tr(locale, "Cavabını tapmadınız?", "Didn't find your answer?")}{" "}
            <Link href={`/${locale}/contact`} className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
              {tr(locale, "Universitetlə əlaqə saxlayın", "Contact the university")}
            </Link>
            .
          </p>
        </div>
        <div className="border-t border-line lg:col-span-8">
          {faq.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                {item.q}
                <span className="pm" aria-hidden>
                  <IconPlus />
                </span>
              </summary>
              <p className="a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing call to action ────────────────────────────────── */

function ClosingCta({ locale }: { locale: Locale }) {
  return (
    <section className="pb-20 md:pb-28" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="on-navy relative isolate overflow-hidden rounded-[40px] bg-brand-navy px-7 py-14 text-white sm:px-12 md:py-20 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(60%_80%_at_85%_20%,#000,transparent_75%)]"
          />
          <div aria-hidden className="absolute -right-10 top-1/2 hidden -translate-y-1/2 grid-cols-3 gap-3 lg:grid">
            {(
              [
                ["k-it", "code"],
                ["k-gold", "star"],
                ["k-data", "dots"],
                ["k-energy", "waves"],
                ["k-eng", "gear"],
                ["k-res", "book"],
              ] as const
            ).map(([hue, art]) => (
              <div key={art} className={cx("mo h-[118px] w-[118px] !rounded-[26px]", hue, art === "star" && "gold")}>
                <TileArt name={art} />
              </div>
            ))}
          </div>
          <div className="relative max-w-[40rem]">
            <p className="kicker !text-white/75">{tr(locale, "Bakalavr və magistr", "Bachelor's and master's")}</p>
            <h2 id="cta-title" className="d-lg mt-5 !text-white">
              {tr(locale, "Sənə uyğun ixtisası bu gün tap", "Find the programme that fits you")}
            </h2>
            <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-white/80">{t("home", "desc", locale)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={catalogPath(locale, 1)} tone="gold" size="lg" arrow>
                {tr(locale, "Bakalavr ixtisasları", "Bachelor's programmes")}
              </ButtonLink>
              <ButtonLink href={catalogPath(locale, 2)} tone="outline-on-navy" size="lg">
                {tr(locale, "Magistr ixtisasları", "Master's programmes")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default function Home(props: HomeProps) {
  const { locale } = props;
  return (
    <>
      <Hero locale={locale} faculties={props.faculties} newest={props.newest} />
      {props.faculties.length > 0 && <FacultyBento locale={locale} faculties={props.faculties} />}
      <ProgrammesSection locale={locale} items={props.carousel} />
      <DegreeCards locale={locale} counts={props.counts} />
      <Steps
        locale={locale}
        example={props.newest?.name ?? tr(locale, "İxtisas adı və ya kodu", "Programme name or code")}
      />
      <Showcase locale={locale} />
      <Faq locale={locale} faq={props.faq} />
      <ClosingCta locale={locale} />
    </>
  );
}
