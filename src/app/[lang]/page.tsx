"use client";

import { t } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import AzTU from "@/../public/aztu.jpg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";

export type Locale = "en" | "az";

const tr = (locale: Locale, az: string, en: string) => (locale === "az" ? az : en);

const stats = [
  { az: "İxtisas", en: "Specialties", value: "100+" },
  { az: "Fakültə", en: "Faculties", value: "12" },
  { az: "Tədris ili", en: "Years of study", value: "4" },
  { az: "Məzun", en: "Graduates", value: "50K+" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const { lang } = useParams();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white dark:bg-slate-900">
        {/* ─────────────────────── HERO ─────────────────────── */}
        <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
          {/* subtle background tint */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900" />
          <div className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-[#182f79]/5 blur-3xl dark:bg-blue-500/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            {/* Left: copy */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#182f79] dark:bg-blue-400" />
                {tr(locale, "AZTU Təhsil Proqramları", "AZTU Educational Programs")}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 text-[34px] font-extrabold leading-[1.1] tracking-tight text-[#0E205B] dark:text-white sm:text-[44px] lg:text-[52px]"
              >
                {t("home", "header", locale)}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[16.5px]"
              >
                {t("home", "desc", locale)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href={`/${lang}/bachelor`}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#182f79] px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0E205B] hover:shadow-md"
                >
                  {tr(locale, "İxtisasları araşdır", "Explore specialties")}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href={`/${lang}/faculties`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-[15px] font-semibold text-slate-700 transition-colors duration-200 hover:border-[#182f79] hover:text-[#182f79] dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-400"
                >
                  {tr(locale, "Fakültələr", "Faculties")}
                </Link>
              </motion.div>

              {/* inline trust stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-100 pt-6 dark:border-slate-800"
              >
                {stats.map((s) => (
                  <div key={s.az}>
                    <div className="text-[24px] font-extrabold leading-none text-[#182f79] dark:text-blue-300">{s.value}</div>
                    <div className="mt-1 text-[12px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                      {tr(locale, s.az, s.en)}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: image panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-slate-700">
                <Image
                  src={AzTU}
                  alt="Azərbaycan Texniki Universiteti"
                  className="h-[300px] w-full object-cover sm:h-[420px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E205B]/70 via-[#0E205B]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[13px] font-medium text-white/80">{tr(locale, "Azərbaycan Texniki Universiteti", "Azerbaijan Technical University")}</p>
                  <p className="text-[16px] font-bold text-white">aztu.edu.az</p>
                </div>
              </div>
              {/* simple floating chip */}
              <div className="absolute -left-4 -top-4 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:block">
                <p className="text-[20px] font-extrabold leading-none text-[#182f79] dark:text-blue-300">100+</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{tr(locale, "ixtisas", "specialties")}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────── PROGRAMS ─────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={tr(locale, "Proqramlar", "Programs")}
              title={tr(locale, "Təhsil səviyyəni seç", "Choose your level of study")}
              subtitle={tr(
                locale,
                "Bakalavr və magistr pilləsi üzrə bütün ixtisasları və fakültə strukturunu araşdırın.",
                "Browse every specialty across bachelor and master levels and the full faculty structure."
              )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <ProgramCard
                href={`/${lang}/bachelor`}
                icon="🎓"
                title={tr(locale, "Bakalavr", "Bachelor")}
                desc={tr(locale, "4 illik bakalavr dərəcəsi proqramları və ixtisasları.", "4-year undergraduate degree programs and specialties.")}
                cta={tr(locale, "İxtisaslara bax", "View specialties")}
              />
              <ProgramCard
                href={`/${lang}/master`}
                icon="📚"
                title={tr(locale, "Magistr", "Master")}
                desc={tr(locale, "2 illik magistr dərəcəsi və elmi-tədqiqat proqramları.", "2-year graduate degree and research programs.")}
                cta={tr(locale, "İxtisaslara bax", "View specialties")}
              />
              <ProgramCard
                href={`/${lang}/faculties`}
                icon="🏛️"
                title={tr(locale, "Fakültələr", "Faculties")}
                desc={tr(locale, "Fakültələr, kafedralar və onlara aid ixtisaslar.", "Faculties, departments, and their specialties.")}
                cta={tr(locale, "Strukturu kəşf et", "Explore structure")}
              />
            </div>
          </div>
        </section>

        {/* ─────────────────────── FEATURES ─────────────────────── */}
        <section className="border-y border-slate-100 bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-950/40 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={tr(locale, "Sistem haqqında", "What's inside")}
              title={tr(locale, "İxtisas haqqında hər şey bir yerdə", "Everything about a specialty in one place")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureTile i={0} icon="📖" title={tr(locale, "Sillabuslar", "Syllabi")} desc={tr(locale, "Hər ixtisasın tədris planı, fənləri və mövzuları.", "Curriculum, subjects, and topics for every specialty.")} />
              <FeatureTile i={1} icon="🎯" title={tr(locale, "Təlim nəticələri", "Learning outcomes")} desc={tr(locale, "Proqram və mövzu üzrə təlim hədəfləri.", "Program- and topic-level learning targets.")} />
              <FeatureTile i={2} icon="💼" title={tr(locale, "Karyera imkanları", "Career paths")} desc={tr(locale, "Məzunların iş yerləri və perspektivləri.", "Where graduates work and grow.")} />
              <FeatureTile i={3} icon="🧭" title={tr(locale, "Səriştələr", "Competencies")} desc={tr(locale, "Peşə və soft-skill bacarıqları.", "Professional and soft-skill competencies.")} />
              <FeatureTile i={4} icon="📚" title={tr(locale, "Ədəbiyyat", "Literature")} desc={tr(locale, "Hər fənn üçün tövsiyə olunan mənbələr.", "Recommended sources for every subject.")} />
              <FeatureTile i={5} icon="🏛️" title={tr(locale, "Fakültə strukturu", "Faculty structure")} desc={tr(locale, "Fakültələr, kafedralar və onların ixtisasları.", "Faculties, departments, and their specialties.")} />
            </div>
          </div>
        </section>

        {/* ─────────────────────── CTA ─────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#182f79] px-6 py-12 text-center md:px-12 md:py-16"
          >
            <h3 className="mx-auto max-w-2xl text-[24px] font-extrabold leading-tight tracking-tight text-white md:text-[32px]">
              {tr(locale, "Gələcək karyeranıza uyğun ixtisası tapın", "Find the specialty that fits your future")}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-blue-100/80">
              {tr(locale, "Bütün proqramları, fənləri və təlim nəticələrini bir kliklə araşdırın.", "Explore every program, subject, and learning outcome with one click.")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/${lang}/bachelor`} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-[#182f79] transition-colors hover:bg-blue-50">
                {tr(locale, "Bakalavr ixtisasları", "Bachelor specialties")} →
              </Link>
              <Link href={`/${lang}/contact`} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
                {tr(locale, "Bizimlə əlaqə", "Get in touch")}
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ───────────────────────── helpers ───────────────────────── */

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10 max-w-2xl"
    >
      <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#2563eb] dark:text-blue-400">{eyebrow}</p>
      <h2 className="text-[26px] font-extrabold tracking-tight text-[#0E205B] dark:text-white md:text-[32px]">{title}</h2>
      {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>}
    </motion.div>
  );
}

function ProgramCard({ href, icon, title, desc, cta }: { href: string; icon: string; title: string; desc: string; cta: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Link
        href={href}
        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#182f79]/8 text-[24px] dark:bg-blue-400/10">{icon}</span>
        <h3 className="mt-5 text-[20px] font-bold tracking-tight text-[#0E205B] dark:text-white">{title}</h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#182f79] transition-all group-hover:gap-2.5 dark:text-blue-400">
          {cta} <span>→</span>
        </span>
      </Link>
    </motion.div>
  );
}

function FeatureTile({ icon, title, desc, i }: { icon: string; title: string; desc: string; i: number }) {
  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-[#182f79]/30 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-blue-400/30"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#182f79]/8 text-[20px] dark:bg-blue-400/10">{icon}</div>
      <h3 className="text-[15.5px] font-bold text-[#0E205B] dark:text-white">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
    </motion.div>
  );
}
