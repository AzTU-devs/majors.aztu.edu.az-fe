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
import { motion } from "framer-motion";

export type Locale = "en" | "az";

const stats = [
  { labelAz: "İxtisas",     labelEn: "Specialties",     value: "100+",    icon: "🎯" },
  { labelAz: "Fakültə",     labelEn: "Faculties",       value: "12",      icon: "🏛️" },
  { labelAz: "Tədris ili",  labelEn: "Years of study",  value: "4",       icon: "📅" },
  { labelAz: "Məzun",       labelEn: "Graduates",       value: "50 000+", icon: "🎓" },
];

const features = [
  {
    icon: "📖",
    titleAz: "Sillabuslar",   titleEn: "Syllabi",
    descAz: "Hər ixtisasın tədris planı və mövzuları",
    descEn: "Curriculum and topics for every specialty",
  },
  {
    icon: "🎯",
    titleAz: "Təlim nəticələri", titleEn: "Learning outcomes",
    descAz: "Proqram və mövzu üzrə təlim hədəfləri",
    descEn: "Program- and topic-level learning targets",
  },
  {
    icon: "💼",
    titleAz: "Karyera imkanları", titleEn: "Career paths",
    descAz: "Məzunların iş yerləri və perspektivləri",
    descEn: "Where graduates work and grow",
  },
  {
    icon: "🧭",
    titleAz: "Səriştələr",     titleEn: "Competencies",
    descAz: "Peşə və soft-skill bacarıqları",
    descEn: "Professional and soft-skill competencies",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const { lang } = useParams();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f1f5f9] dark:bg-slate-900">
        {/* ─────────── Hero ─────────── */}
        <section className="relative min-h-[100vh] md:min-h-[92vh] overflow-hidden">
          {/* Background photo */}
          <Image
            src={AzTU}
            alt="Azərbaycan Texniki Universiteti"
            fill
            className="object-cover object-center scale-105"
            priority
          />

          {/* Deep gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E205B]/85 via-[#182f79]/65 to-[#0E205B]/95" />

          {/* Animated colour blobs */}
          <div className="blob bg-[#3b82f6] w-[520px] h-[520px] top-[-120px] left-[-140px]" />
          <div className="blob blob-2 bg-[#7c3aed] w-[460px] h-[460px] bottom-[-160px] right-[-120px]" />
          <div className="blob blob-3 bg-[#22d3ee] w-[380px] h-[380px] top-[40%] left-[55%]" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Hero content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-7 inline-flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-[12.5px] text-white/85 font-medium shadow-[0_4px_20px_-6px_rgba(0,0,0,0.4)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-300" />
              </span>
              {locale === "az" ? "AZTU Təhsil Proqramları" : "AZTU Educational Programs"}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-extrabold text-[36px] md:text-[64px] mb-5 leading-[1.05] max-w-4xl tracking-tight"
            >
              <span className="gradient-text drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                {t("home", "header", locale)}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-2xl font-normal text-[15px] md:text-[18px] mb-10 text-white/80 leading-relaxed"
            >
              {t("home", "desc", locale)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href={`/${lang}/bachelor`}
                className="cta-glow group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0E205B] font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 text-[15px] shadow-2xl"
              >
                {locale === "az" ? "Bakalavr" : "Bachelor"}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={`/${lang}/master`}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white hover:text-[#0E205B] border border-white/30 transition-all duration-300 text-[15px]"
              >
                {locale === "az" ? "Magistr" : "Master"}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={`/${lang}/faculties`}
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-white/85 hover:text-white font-semibold rounded-full transition-colors duration-300 text-[15px]"
              >
                {locale === "az" ? "Fakültələr" : "Faculties"}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60"
            >
              <span className="text-[10.5px] uppercase tracking-[0.2em]">
                {locale === "az" ? "Aşağı sürüşdür" : "Scroll"}
              </span>
              <span className="scroll-cue inline-block w-px h-7 bg-gradient-to-b from-white/0 via-white/70 to-white/0" />
            </motion.div>
          </div>

          {/* Bottom fade into page bg */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f1f5f9] dark:from-slate-900 to-transparent z-[5]" />
        </section>

        {/* ─────────── Stats ─────────── */}
        <section className="relative -mt-12 z-20 px-4 pb-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl py-6 px-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] border border-[#e2e8f0] dark:border-slate-700 hover:shadow-[0_18px_40px_-12px_rgba(24,47,121,0.25)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[26px]">{stat.icon}</span>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#182f79]/8 to-[#2563eb]/8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[32px] md:text-[34px] font-extrabold text-[#0E205B] dark:text-blue-300 leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[#64748b] dark:text-slate-400 text-[12.5px] mt-1.5 font-medium uppercase tracking-wider">
                  {locale === "az" ? stat.labelAz : stat.labelEn}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─────────── Programs ─────────── */}
        <section className="px-4 pb-16 pt-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#2563eb] font-semibold mb-3">
                {locale === "az" ? "Proqramlar" : "Programs"}
              </p>
              <h2 className="text-[#0E205B] dark:text-slate-100 text-[28px] md:text-[36px] font-extrabold tracking-tight">
                {locale === "az" ? "Təhsil Proqramlarını Kəşf Edin" : "Explore Degree Programs"}
              </h2>
              <p className="text-[#64748b] dark:text-slate-400 text-[15px] mt-3 max-w-xl mx-auto">
                {locale === "az"
                  ? "Azərbaycan Texniki Universitetinin geniş ixtisas portfelini araşdırın"
                  : "Browse the full portfolio of specialties offered at Azerbaijan Technical University"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bachelor */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/${lang}/bachelor`}
                  className="group relative overflow-hidden flex flex-col h-[260px] rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ background: "linear-gradient(135deg, #182f79 0%, #1e40af 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-white/8 group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[42px] mb-3 float-slow">🎓</span>
                    <h3 className="text-white font-bold text-[24px] tracking-tight">
                      {locale === "az" ? "Bakalavr" : "Bachelor"}
                    </h3>
                    <p className="text-white/65 text-[13.5px] mt-2 flex-1 leading-relaxed">
                      {locale === "az"
                        ? "4 illik bakalavr dərəcəsi proqramları və ixtisasları"
                        : "4-year undergraduate degree programs and specialties"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-white text-[13px] font-semibold group-hover:gap-3 transition-all">
                      {locale === "az" ? "İxtisaslara bax" : "View specialties"}
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Master */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href={`/${lang}/master`}
                  className="group relative overflow-hidden flex flex-col h-[260px] rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ background: "linear-gradient(135deg, #0E205B 0%, #312e81 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-white/8 group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[42px] mb-3 float-slow">📚</span>
                    <h3 className="text-white font-bold text-[24px] tracking-tight">
                      {locale === "az" ? "Magistr" : "Master"}
                    </h3>
                    <p className="text-white/65 text-[13.5px] mt-2 flex-1 leading-relaxed">
                      {locale === "az"
                        ? "2 illik magistr dərəcəsi və elmi-tədqiqat proqramları"
                        : "2-year graduate degree and research programs"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-white text-[13px] font-semibold group-hover:gap-3 transition-all">
                      {locale === "az" ? "İxtisaslara bax" : "View specialties"}
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Faculties */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href={`/${lang}/faculties`}
                  className="group relative overflow-hidden flex flex-col h-[260px] rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700"
                >
                  <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-gradient-to-br from-[#182f79]/10 to-[#2563eb]/10 group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[42px] mb-3 float-slow">🏛️</span>
                    <h3 className="text-[#0E205B] dark:text-slate-100 font-bold text-[24px] tracking-tight">
                      {locale === "az" ? "Fakültələr" : "Faculties"}
                    </h3>
                    <p className="text-[#64748b] dark:text-slate-400 text-[13.5px] mt-2 flex-1 leading-relaxed">
                      {locale === "az"
                        ? "Fakültələr, kafedralar və onlara aid ixtisaslar"
                        : "Faculties, departments, and their specialties"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[#182f79] dark:text-blue-400 text-[13px] font-semibold group-hover:gap-3 transition-all">
                      {locale === "az" ? "Strukturu kəşf et" : "Explore structure"}
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─────────── Features ─────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#2563eb] font-semibold mb-3">
                {locale === "az" ? "Sistem haqqında" : "What's inside"}
              </p>
              <h2 className="text-[#0E205B] dark:text-slate-100 text-[26px] md:text-[32px] font-extrabold tracking-tight">
                {locale === "az" ? "İxtisas haqqında hər şey bir yerdə" : "Everything about a specialty in one place"}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-[#e2e8f0] dark:border-slate-700 hover:border-[#182f79]/30 dark:hover:border-blue-400/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#182f79]/10 to-[#2563eb]/10 flex items-center justify-center text-[20px] mb-3 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-[#0E205B] dark:text-slate-100 font-bold text-[15px] mb-1">
                    {locale === "az" ? f.titleAz : f.titleEn}
                  </h3>
                  <p className="text-[#64748b] dark:text-slate-400 text-[13px] leading-relaxed">
                    {locale === "az" ? f.descAz : f.descEn}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── CTA strip ─────────── */}
        <section className="px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0E205B 0%, #1e40af 50%, #312e81 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="blob bg-[#60a5fa] w-[300px] h-[300px] -top-40 -left-20 opacity-30" />
            <div className="blob blob-2 bg-[#a78bfa] w-[280px] h-[280px] -bottom-40 -right-20 opacity-30" />
            <div className="relative z-10">
              <h3 className="text-white text-[24px] md:text-[30px] font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
                {locale === "az"
                  ? "Gələcək karyeranıza uyğun ixtisası tapın"
                  : "Find the specialty that fits your future"}
              </h3>
              <p className="text-white/70 text-[14.5px] mt-3 max-w-xl mx-auto">
                {locale === "az"
                  ? "Bütün proqramları, fənləri və təlim nəticələrini bir kliklə araşdırın."
                  : "Explore every program, subject, and learning outcome with one click."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/${lang}/bachelor`}
                  className="cta-glow inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0E205B] font-semibold rounded-full text-[14.5px] hover:bg-blue-50 transition-colors"
                >
                  {locale === "az" ? "Bakalavr ixtisasları" : "Bachelor specialties"} →
                </Link>
                <Link
                  href={`/${lang}/faculties`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full text-[14.5px] border border-white/25 transition-colors backdrop-blur-md"
                >
                  {locale === "az" ? "Fakültələri gör" : "Browse faculties"} →
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
