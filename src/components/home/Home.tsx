"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { t, tr } from "@/lib/i18n";
import { UNIVERSITY, type Locale } from "@/lib/site";
import {
  ArrowRight,
  ButtonLink,
  Card,
  CardCta,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";

import Campus from "@/../public/aztu-campus.jpg";

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

/* ── Icons ──────────────────────────────────────────────────── */

const icon = (path: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
    {path}
  </svg>
);

const Icons = {
  cap: icon(
    <>
      <path d="M12 4L2 9l10 5 10-5-10-5z" strokeLinejoin="round" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" />
    </>
  ),
  book: icon(
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z" strokeLinejoin="round" />
      <path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z" strokeLinejoin="round" />
    </>
  ),
  building: icon(
    <>
      <path d="M3 21h18M5 21V6l7-3 7 3v15" strokeLinejoin="round" />
      <path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" strokeLinecap="round" />
    </>
  ),
  doc: icon(
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" />
    </>
  ),
  target: icon(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4V2M12 22v-2M20 12h2M2 12h2" strokeLinecap="round" />
    </>
  ),
  briefcase: icon(
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3 12.5h18" strokeLinecap="round" />
    </>
  ),
  compass: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" strokeLinejoin="round" />
    </>
  ),
  library: icon(
    <>
      <path d="M4 5h5a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-5a2 2 0 00-2 2v13a2 2 0 012-2h5z" strokeLinejoin="round" />
    </>
  ),
  network: icon(
    <>
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5.5" cy="18" r="2.4" />
      <circle cx="18.5" cy="18" r="2.4" />
      <path d="M12 7.4v4.2M10.4 13l-3.3 3M13.6 13l3.3 3" strokeLinecap="round" />
    </>
  ),
};

/* ── Page ───────────────────────────────────────────────────── */

export default function Home({
  locale,
  stats,
}: {
  locale: Locale;
  stats: { bachelor: number; master: number; faculties: number };
}) {
  const lang = locale;
  const az = locale === "az";

  // Round down to a "N+" figure so a single catalogue edit doesn't make the
  // headline read as a precise-but-stale number.
  const approx = (n: number) => (n >= 20 ? `${Math.floor(n / 10) * 10}+` : `${n}`);

  const heroStats = [
    {
      value: stats.bachelor ? approx(stats.bachelor) : "—",
      label: tr(locale, "Bakalavr ixtisası", "Bachelor programmes"),
    },
    {
      value: stats.master ? approx(stats.master) : "—",
      label: tr(locale, "Magistr ixtisası", "Master programmes"),
    },
    {
      value: stats.faculties ? String(stats.faculties) : "—",
      label: tr(locale, "Fakültə", "Faculties"),
    },
    { value: "1920", label: tr(locale, "Təsis ili", "Founded") },
  ];

  const programmes = [
    {
      href: `/${lang}/bachelor`,
      icon: Icons.cap,
      title: t("header", "bachelor", locale),
      desc: tr(
        locale,
        "Dörd illik bakalavr proqramları — tədris planı, fənlər və təlim nəticələri ilə birlikdə.",
        "Four-year undergraduate programmes, with the full curriculum, subjects and learning outcomes."
      ),
      cta: tr(locale, "İxtisaslara bax", "Browse programmes"),
      count: stats.bachelor,
    },
    {
      href: `/${lang}/master`,
      icon: Icons.book,
      title: t("header", "master", locale),
      desc: tr(
        locale,
        "İki illik magistr və elmi-tədqiqat proqramları, ixtisaslaşma istiqamətləri ilə.",
        "Two-year graduate and research programmes with their specialisation tracks."
      ),
      cta: tr(locale, "İxtisaslara bax", "Browse programmes"),
      count: stats.master,
    },
    {
      href: `/${lang}/faculties`,
      icon: Icons.building,
      title: t("header", "faculties", locale),
      desc: tr(
        locale,
        "Universitetin fakültələri, kafedraları və onların ixtisas portfeli.",
        "The university's faculties, departments and the programmes each one runs."
      ),
      cta: tr(locale, "Strukturu araşdır", "Explore the structure"),
      count: stats.faculties,
    },
  ];

  const features = [
    {
      icon: Icons.doc,
      title: tr(locale, "Sillabuslar", "Syllabi"),
      desc: tr(
        locale,
        "Hər fənn üçün tam sillabus: kredit, semestr, mövzular və qiymətləndirmə.",
        "A complete syllabus per subject: credits, semester, topics and assessment."
      ),
    },
    {
      icon: Icons.target,
      title: tr(locale, "Təlim nəticələri", "Learning outcomes"),
      desc: tr(
        locale,
        "Proqram, fənn və mövzu səviyyəsində təlim nəticələri və onların uyğunluğu.",
        "Programme-, course- and topic-level outcomes, and how they map to each other."
      ),
    },
    {
      icon: Icons.briefcase,
      title: tr(locale, "Karyera imkanları", "Career paths"),
      desc: tr(
        locale,
        "Məzunların çalışdığı sahələr və hər ixtisasın açdığı peşə istiqamətləri.",
        "Where graduates work, and the roles each programme opens up."
      ),
    },
    {
      icon: Icons.compass,
      title: tr(locale, "Səriştələr", "Competencies"),
      desc: tr(
        locale,
        "Peşə və ixtisas səriştələri, fənlərlə uyğunluq cədvəli ilə birlikdə.",
        "Professional and specialty competencies, with the subject matching table."
      ),
    },
    {
      icon: Icons.library,
      title: tr(locale, "Ədəbiyyat", "Reading lists"),
      desc: tr(
        locale,
        "Hər fənn üzrə tövsiyə olunan dərslik və mənbələr.",
        "Recommended textbooks and sources for every subject."
      ),
    },
    {
      icon: Icons.network,
      title: tr(locale, "Uyğunluq matrisləri", "Matching matrices"),
      desc: tr(
        locale,
        "CLO↔PLO və fənn↔səriştə matrisləri akkreditasiya sənədləri üçün hazır formatda.",
        "CLO↔PLO and subject↔competency matrices, ready for accreditation files."
      ),
    },
  ];

  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--surface-card)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-52 h-[560px] w-[560px] rounded-full bg-[var(--brand-tint)] blur-3xl"
        />
        <div
          aria-hidden
          className="blueprint-grid pointer-events-none absolute inset-0 text-[var(--brand)] opacity-[0.035]"
        />

        <Container className="relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          {/* Copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Eyebrow>{tr(locale, "AzTU İxtisas İnformasiya Sistemi", "AzTU Programme Information System")}</Eyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-[34px] font-extrabold leading-[1.08] sm:text-[44px] lg:text-[54px]"
            >
              {tr(locale, "Gələcək ixtisasını", "Find the programme")}{" "}
              <span className="text-gradient-brand">{tr(locale, "burada tap", "that fits you")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--text-muted)] sm:text-[17px]"
            >
              {t("home", "desc", locale)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <ButtonLink href={`/${lang}/bachelor`}>
                {tr(locale, "İxtisasları araşdır", "Explore programmes")}
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href={`/${lang}/faculties`} tone="secondary">
                {t("header", "faculties", locale)}
              </ButtonLink>
            </motion.div>

            {/* Headline figures */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-11 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--border-subtle)] pt-7 sm:grid-cols-4"
            >
              {heroStats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-[27px] font-extrabold leading-none text-[var(--brand-accent)]">
                      {s.value}
                    </span>
                    <span className="mt-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Campus panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-[var(--shadow-card-hover)]">
              <Image
                src={Campus}
                alt={
                  az
                    ? "Azərbaycan Texniki Universitetinin əsas binası"
                    : "The main building of Azerbaijan Technical University"
                }
                className="h-[320px] w-full object-cover sm:h-[440px]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                placeholder="blur"
                priority
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[12.5px] font-medium text-white/70">
                  {az ? UNIVERSITY.nameAz : UNIVERSITY.nameEn}
                </p>
                <p className="mt-0.5 text-[17px] font-bold text-white">
                  {az ? "H.Cavid prospekti 25, Bakı" : "25 H.Javid Avenue, Baku"}
                </p>
              </div>
            </div>

            {/* Floating figure */}
            <div className="absolute -left-5 -top-5 hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 shadow-[var(--shadow-card-hover)] sm:block">
              <p className="text-[24px] font-extrabold leading-none text-[var(--brand-accent)]">
                {stats.bachelor + stats.master || "—"}
              </p>
              <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {tr(locale, "təhsil proqramı", "programmes")}
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ─────────────── PROGRAMMES ─────────────── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={tr(locale, "Proqramlar", "Programmes")}
            title={tr(locale, "Təhsil səviyyəsini seçin", "Choose your level of study")}
            subtitle={tr(
              locale,
              "Bakalavr və magistr pilləsi üzrə bütün ixtisaslar, fakültə strukturu ilə birlikdə.",
              "Every programme across the bachelor's and master's levels, alongside the faculty structure."
            )}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {programmes.map((p, i) => (
              <motion.div
                key={p.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={rise}
              >
                <Link href={p.href} className="block h-full">
                  <Card interactive className="flex h-full flex-col p-7">
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                        {p.icon}
                      </span>
                      {p.count > 0 && (
                        <span className="text-[13px] font-bold text-[var(--text-muted)]">{p.count}</span>
                      )}
                    </div>
                    <h3 className="mt-6 text-[20px] font-bold">{p.title}</h3>
                    <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-[var(--text-muted)]">{p.desc}</p>
                    <CardCta>{p.cta}</CardCta>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─────────────── WHAT'S INSIDE ─────────────── */}
      <Section tone="sunken" className="border-y border-[var(--border-subtle)]">
        <Container>
          <SectionHeading
            eyebrow={tr(locale, "Sistem haqqında", "What's inside")}
            title={tr(
              locale,
              "Bir ixtisas haqqında bilməli olduğunuz hər şey",
              "Everything you need to know about a programme"
            )}
            subtitle={tr(
              locale,
              "Tədris planından məzun karyerasına qədər — hamısı eyni yerdə, iki dildə.",
              "From the curriculum to graduate careers — all in one place, in two languages."
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={rise}
              >
                <Card className="h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                    {f.icon}
                  </span>
                  <h3 className="mt-5 text-[15.5px] font-bold">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─────────────── CTA ─────────────── */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-navy-700 px-6 py-14 text-center md:px-14 md:py-20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_120%_at_50%_-20%,#2f4184_0%,transparent_60%)]"
            />
            <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 text-white opacity-[0.06]" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-[26px] font-extrabold leading-tight text-white md:text-[34px]">
                {tr(
                  locale,
                  "Karyeranıza uyğun ixtisası tapın",
                  "Find the programme that matches your ambition"
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/65">
                {tr(
                  locale,
                  "Bütün proqramları, fənləri və təlim nəticələrini bir kliklə araşdırın.",
                  "Explore every programme, subject and learning outcome in a couple of clicks."
                )}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonLink href={`/${lang}/bachelor`} tone="onBrand">
                  {tr(locale, "Bakalavr ixtisasları", "Bachelor programmes")}
                  <ArrowRight />
                </ButtonLink>
                <ButtonLink href={`/${lang}/contact`} tone="onBrandGhost">
                  {tr(locale, "Bizimlə əlaqə", "Get in touch")}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
