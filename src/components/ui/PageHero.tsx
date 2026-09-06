"use client";

import Link from "next/link";
import React from "react";
import { Container, Eyebrow, cx } from "./primitives";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb trail. Rendered as a real <nav>/<ol> so assistive tech and
 * crawlers can read the hierarchy (the matching BreadcrumbList JSON-LD is
 * emitted server-side by each route's layout).
 */
export function Breadcrumbs({ items, onBrand = false }: { items: Crumb[]; onBrand?: boolean }) {
  if (!items.length) return null;

  const base = onBrand ? "text-white/60" : "text-[var(--text-muted)]";
  const link = onBrand ? "hover:text-white" : "hover:text-[var(--brand-accent)]";
  const current = onBrand ? "text-white/90" : "text-[var(--text-body)]";

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]", base)}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className={cx("transition-colors", link)}>
                  {item.label}
                </Link>
              ) : (
                <span className={cx("font-medium", current)} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 opacity-45" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The masthead used at the top of every interior page.
 *
 * `tone="brand"` renders the deep-navy AzTU panel (programme and subject
 * pages); `tone="light"` is the quieter variant for list pages.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  meta,
  actions,
  tone = "light",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  /** Chips shown beneath the title (code, degree, credits…). */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: "light" | "brand";
}) {
  const onBrand = tone === "brand";

  return (
    <header
      className={cx(
        "relative overflow-hidden border-b",
        onBrand
          ? "border-navy-800 bg-navy-700 text-white"
          : "border-[var(--border-subtle)] bg-[var(--surface-card)]"
      )}
    >
      {onBrand ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_-10%,#2f4184_0%,transparent_60%)]"
          />
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-40 h-96 w-96 rounded-full bg-[var(--brand-tint)] blur-3xl"
        />
      )}

      <Container className="relative py-8 md:py-12">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-5">
            <Breadcrumbs items={breadcrumbs} onBrand={onBrand} />
          </div>
        )}

        {eyebrow &&
          (onBrand ? (
            <p className="inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.18em] text-sky-brand-300">
              <span aria-hidden className="h-px w-6 bg-current opacity-50" />
              {eyebrow}
            </p>
          ) : (
            <Eyebrow>{eyebrow}</Eyebrow>
          ))}

        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1
              className={cx(
                "max-w-4xl text-[27px] font-extrabold leading-[1.15] md:text-[38px]",
                onBrand && "text-white"
              )}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className={cx(
                  "mt-3.5 max-w-2xl text-[15px] leading-relaxed",
                  onBrand ? "text-white/70" : "text-[var(--text-muted)]"
                )}
              >
                {subtitle}
              </p>
            )}

            {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
          </div>

          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </div>
      </Container>
    </header>
  );
}
