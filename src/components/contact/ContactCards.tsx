"use client";

import { motion } from "framer-motion";

import { tr } from "@/lib/i18n";
import { UNIVERSITY, type Locale } from "@/lib/site";
import { Card, Container } from "@/components/ui/primitives";

const icons = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
      <path
        d="M5 3h3.5l1.5 4.5-2 1.4a12.5 12.5 0 006.1 6.1l1.4-2L20 14.5V18a2 2 0 01-2.2 2A16.5 16.5 0 013 6.2 2 2 0 015 3z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

export default function ContactCards({ locale }: { locale: Locale }) {
  const az = locale === "az";

  const cards = [
    {
      icon: icons.mail,
      label: tr(locale, "E-poçt", "Email"),
      value: UNIVERSITY.email,
      href: `mailto:${UNIVERSITY.email}`,
    },
    {
      icon: icons.phone,
      label: tr(locale, "Telefon", "Phone"),
      value: "(+994 12) 538-33-83",
      href: `tel:${UNIVERSITY.phones[0]}`,
    },
    {
      icon: icons.globe,
      label: tr(locale, "Veb sayt", "Website"),
      value: "aztu.edu.az",
      href: UNIVERSITY.url,
      external: true,
    },
    {
      icon: icons.pin,
      label: tr(locale, "Ünvan", "Address"),
      value: az
        ? `${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz}`
        : `${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn}`,
      href: "https://maps.google.com/?q=Azerbaijan+Technical+University",
      external: true,
    },
  ];

  return (
    <Container className="py-10 md:py-14">
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <motion.a
            key={c.label}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="block"
          >
            <Card interactive className="flex items-center gap-5 p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
                {c.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {c.label}
                </p>
                <p className="mt-1 truncate text-[16px] font-bold text-[var(--text-strong)]">{c.value}</p>
              </div>
            </Card>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-card)]"
      >
        <iframe
          title={az ? "AzTU-nun xəritədəki yeri" : "AzTU location on the map"}
          src="https://www.google.com/maps?q=Azerbaijan%20Technical%20University&output=embed"
          className="h-[380px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </Container>
  );
}
