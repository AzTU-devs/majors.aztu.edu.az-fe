"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import PageTitle from "@/components/pageTitle/PageTitle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { motion, type Variants } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";

export type Locale = "az" | "en";

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function ContactPage() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);

  const cards = [
    {
      icon: <EmailIcon style={{ fontSize: 24 }} />,
      labelAz: "E-poçt",
      labelEn: "Email",
      value: "aztu@aztu.edu.az",
      href: "mailto:aztu@aztu.edu.az",
    },
    {
      icon: <LocalPhoneIcon style={{ fontSize: 24 }} />,
      labelAz: "Telefon",
      labelEn: "Phone",
      value: "(+994 12) 538-33-83",
      href: "tel:+994125383383",
    },
    {
      icon: <LanguageIcon style={{ fontSize: 24 }} />,
      labelAz: "Veb sayt",
      labelEn: "Website",
      value: "aztu.edu.az",
      href: "https://aztu.edu.az",
    },
    {
      icon: <LocationOnIcon style={{ fontSize: 24 }} />,
      labelAz: "Ünvan",
      labelEn: "Address",
      value: locale === "az" ? "H.Cavid pr. 25, Bakı, Azərbaycan" : "25 H.Javid Ave, Baku, Azerbaijan",
      href: "https://maps.google.com/?q=Azerbaijan+Technical+University",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f1f5f9] dark:bg-slate-900">
        <PageTitle
          category={locale === "az" ? "Bizimlə əlaqə" : "Get in touch"}
          title={locale === "az" ? "Əlaqə" : "Contact"}
          subtitle={
            locale === "az"
              ? "Suallarınız üçün Azərbaycan Texniki Universiteti ilə əlaqə saxlayın"
              : "Reach out to Azerbaijan Technical University with your questions"
          }
        />

        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardEnter}
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#182f79]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-400/30"
              >
                <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-[#182f79]/8 text-[#182f79] dark:bg-blue-400/10 dark:text-blue-300">
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {locale === "az" ? c.labelAz : c.labelEn}
                  </p>
                  <p className="mt-1 truncate text-[16px] font-bold text-[#0E205B] dark:text-white">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <iframe
              title="AZTU map"
              src="https://www.google.com/maps?q=Azerbaijan%20Technical%20University&output=embed"
              className="w-full h-[360px] grayscale-[0.2] dark:grayscale-[0.4] dark:invert-[0.9] dark:hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
