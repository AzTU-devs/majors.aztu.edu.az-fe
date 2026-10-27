import { formatPhone } from "@/components/footer/Footer";
import { IconExternal, IconGlobe, IconMail, IconPhone, IconPin } from "@/components/ui/icons";
import { cx } from "@/components/ui/primitives";
import { tr } from "@/lib/i18n";
import { UNIVERSITY, type Locale } from "@/lib/site";

export default function ContactCards({ locale }: { locale: Locale }) {
  const az = locale === "az";
  const address = az
    ? `${UNIVERSITY.address.streetAz}, ${UNIVERSITY.address.cityAz} ${UNIVERSITY.address.postalCode}`
    : `${UNIVERSITY.address.streetEn}, ${UNIVERSITY.address.cityEn} ${UNIVERSITY.address.postalCode}`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${UNIVERSITY.geo.lat},${UNIVERSITY.geo.lng}`;

  const cards = [
    {
      hue: "k-data",
      icon: <IconMail />,
      label: tr(locale, "E-poçt", "Email"),
      lines: [{ text: UNIVERSITY.email, href: `mailto:${UNIVERSITY.email}` }],
    },
    {
      hue: "k-build",
      icon: <IconPhone />,
      label: tr(locale, "Telefon", "Phone"),
      lines: UNIVERSITY.phones.map((p) => ({ text: formatPhone(p), href: `tel:${p}` })),
    },
    {
      hue: "k-gold",
      icon: <IconPin />,
      label: tr(locale, "Ünvan", "Address"),
      lines: [{ text: address, href: mapsLink, external: true }],
    },
    {
      hue: "k-it",
      icon: <IconGlobe />,
      label: tr(locale, "Universitetin saytı", "University website"),
      lines: [{ text: "aztu.edu.az", href: UNIVERSITY.url, external: true }],
    },
  ];

  return (
    <section className="wrap py-12 md:py-16" aria-labelledby="contact-ways">
      <h2 id="contact-ways" className="sr-only">
        {tr(locale, "Əlaqə vasitələri", "Ways to get in touch")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label} className={cx(c.hue, "card flex flex-col p-6")}>
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-k-100 text-k-700">{c.icon}</span>
            <h3 className="mt-5 text-[14px] font-medium text-ink-3">{c.label}</h3>
            <ul className="mt-1.5 flex flex-col gap-1">
              {c.lines.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-1.5 font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-gold [overflow-wrap:anywhere]"
                  >
                    {l.text}
                    {"external" in l && l.external && (
                      <>
                        <IconExternal size={15} className="shrink-0 text-ink-3" />
                        <span className="sr-only">{tr(locale, "(yeni pəncərədə açılır)", "(opens in a new tab)")}</span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-6 overflow-hidden rounded-[28px] bg-surface elev-1 ring-line">
        <iframe
          title={az ? "AzTU-nun xəritədəki yeri" : "AzTU on the map"}
          src={`https://www.google.com/maps?q=${UNIVERSITY.geo.lat},${UNIVERSITY.geo.lng}&z=16&output=embed`}
          className="block h-[320px] w-full border-0 md:h-[420px]"
          loading="lazy"
          // Only the site's origin goes to Google, never the page path
          // ("no-referrer-when-downgrade" sent the full URL).
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
