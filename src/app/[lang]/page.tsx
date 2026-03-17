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
  { labelAz: "İxtisas", labelEn: "Specialties", value: "100+" },
  { labelAz: "Fakültə", labelEn: "Faculties", value: "12" },
  { labelAz: "Tədris ili", labelEn: "Years of study", value: "4" },
  { labelAz: "Məzun", labelEn: "Graduates", value: "50 000+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const { lang } = useParams();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ── Hero ── */}
        <div className="relative h-[680px] md:h-[760px] overflow-hidden">
          <Image
            src={AzTU}
            alt="Azərbaycan Texniki Universiteti"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E205B]/70 via-[#182f79]/50 to-[#0E205B]/90" />

          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-[13px] text-white/80 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
              {locale === "az" ? "AZTU Təhsil Proqramları" : "AZTU Educational Programs"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-bold text-[34px] md:text-[50px] mb-5 drop-shadow-lg leading-tight max-w-3xl"
            >
              {t("home", "header", locale)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl font-normal text-[16px] md:text-[18px] mb-10 text-white/80"
            >
              {t("home", "desc", locale)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href={`/${lang}/bachelor`}
                className="px-7 py-3 bg-white text-[#182f79] font-semibold rounded-full hover:bg-blue-50 border-2 border-white transition-all duration-300 text-[15px] shadow-xl"
              >
                {locale === "az" ? "Bakalavr →" : "Bachelor →"}
              </Link>
              <Link
                href={`/${lang}/master`}
                className="px-7 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white hover:text-[#182f79] border-2 border-white/40 transition-all duration-300 text-[15px]"
              >
                {locale === "az" ? "Magistr →" : "Master →"}
              </Link>
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f1f5f9] dark:from-slate-900 to-transparent" />
        </div>

        {/* ── Stats Strip ── */}
        <div className="bg-[#f1f5f9] dark:bg-slate-900 py-10 px-4 -mt-1">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-2xl py-6 px-4 shadow-sm border border-[#e2e8f0] dark:border-slate-700"
              >
                <span className="text-[36px] font-extrabold text-[#182f79] leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[#64748b] dark:text-slate-400 text-[13px] mt-1.5 font-medium">
                  {locale === "az" ? stat.labelAz : stat.labelEn}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Explore Programs ── */}
        <section className="bg-[#f1f5f9] dark:bg-slate-900 px-4 pb-16 pt-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#2563eb] font-semibold mb-2">
                {locale === "az" ? "Proqramlar" : "Programs"}
              </p>
              <h2 className="text-[#1e293b] dark:text-slate-100 text-[26px] md:text-[32px] font-bold">
                {locale === "az" ? "Təhsil Proqramlarını Kəşf Edin" : "Explore Degree Programs"}
              </h2>
              <p className="text-[#64748b] dark:text-slate-400 text-[15px] mt-3 max-w-xl mx-auto">
                {locale === "az"
                  ? "Azərbaycan Texniki Universitetinin geniş ixtisas portfelini araşdırın"
                  : "Browse the full portfolio of specialties offered at Azerbaijan Technical University"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bachelor Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/${lang}/bachelor`}
                  className="group relative overflow-hidden flex flex-col h-[220px] rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #182f79 0%, #1e40af 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[38px] mb-3">🎓</span>
                    <h3 className="text-white font-bold text-[22px]">
                      {locale === "az" ? "Bakalavr" : "Bachelor"}
                    </h3>
                    <p className="text-white/65 text-[13px] mt-1 flex-1">
                      {locale === "az"
                        ? "4 illik bakalavr dərəcəsi proqramları"
                        : "4-year undergraduate degree programs"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-white/80 text-[13px] font-semibold group-hover:gap-2 transition-all">
                      {locale === "az" ? "İxtisaslara bax" : "View specialties"} →
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Master Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/${lang}/master`}
                  className="group relative overflow-hidden flex flex-col h-[220px] rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #0E205B 0%, #182f79 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[38px] mb-3">📚</span>
                    <h3 className="text-white font-bold text-[22px]">
                      {locale === "az" ? "Magistr" : "Master"}
                    </h3>
                    <p className="text-white/65 text-[13px] mt-1 flex-1">
                      {locale === "az"
                        ? "2 illik magistr dərəcəsi proqramları"
                        : "2-year graduate degree programs"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-white/80 text-[13px] font-semibold group-hover:gap-2 transition-all">
                      {locale === "az" ? "İxtisaslara bax" : "View specialties"} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
