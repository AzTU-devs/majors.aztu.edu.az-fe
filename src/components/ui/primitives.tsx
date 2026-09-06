"use client";

import Link from "next/link";
import React from "react";

/* ────────────────────────────────────────────────────────────
   Small, dependency-free building blocks shared by every page.
   Keeping them here is what makes the site read as one product
   rather than a dozen separately-styled screens.
   ──────────────────────────────────────────────────────────── */

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── Layout ─────────────────────────────────────────────────── */

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  const max =
    width === "wide" ? "max-w-[1400px]" : width === "narrow" ? "max-w-4xl" : "max-w-7xl";
  return (
    <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
  tone = "page",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "page" | "sunken" | "card";
}) {
  const bg =
    tone === "sunken"
      ? "bg-[var(--surface-sunken)]"
      : tone === "card"
      ? "bg-[var(--surface-card)]"
      : "";
  return <section className={cx("py-14 md:py-20", bg, className)}>{children}</section>;
}

/* ── Typography ─────────────────────────────────────────────── */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.18em] text-[var(--brand-accent)]",
        className
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-50" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <Tag className="mt-3 text-[26px] font-extrabold leading-[1.15] md:text-[34px]">{title}</Tag>
      {subtitle && (
        <p className="mt-3.5 text-[15.5px] leading-relaxed text-[var(--text-muted)]">{subtitle}</p>
      )}
    </div>
  );
}

/* ── Surfaces ───────────────────────────────────────────────── */

export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cx(
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--brand-accent)]/45 hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "accent" | "outline";
  className?: string;
}) {
  const tones = {
    neutral:
      "bg-[var(--surface-sunken)] text-[var(--text-muted)] border-transparent",
    brand: "bg-[var(--brand)] text-white border-transparent",
    accent:
      "bg-[var(--brand-tint)] text-[var(--brand-accent)] border-[var(--brand-accent)]/25",
    outline:
      "bg-transparent text-[var(--text-muted)] border-[var(--border-strong)]",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Monospaced code chip used for specialty / subject codes. */
export function CodeChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-2.5 py-1 font-mono text-[11.5px] font-semibold tracking-tight text-[var(--text-body)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Actions ────────────────────────────────────────────────── */

type ButtonTone = "primary" | "secondary" | "ghost" | "onBrand" | "onBrandGhost";

const buttonTones: Record<ButtonTone, string> = {
  primary:
    "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-sm hover:shadow-md dark:text-[#0a0f2b]",
  secondary:
    "border border-[var(--border-strong)] text-[var(--text-strong)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]",
  ghost:
    "text-[var(--text-body)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-strong)]",
  onBrand: "bg-white text-[#141e53] hover:bg-sky-brand-50 shadow-sm",
  onBrandGhost: "border border-white/30 text-white hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  tone = "primary",
  size = "md",
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  tone?: ButtonTone;
  size?: "sm" | "md";
  className?: string;
  external?: boolean;
}) {
  const classes = cx(
    "group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    size === "sm" ? "px-4 py-2.5 text-[13.5px]" : "px-6 py-3.5 text-[15px]",
    buttonTones[tone],
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Right-pointing arrow that nudges on hover. Pair with `group`. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(
        "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5",
        className
      )}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** "Read more" style link used at the foot of cards. */
export function CardCta({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[var(--brand-accent)]">
      {children}
      <ArrowRight />
    </span>
  );
}

/* ── States ─────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx("skeleton rounded-lg", className)} />;
}

export function CardSkeletonGrid({ count = 6, height = "h-[168px]" }: { count?: number; height?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cx("rounded-2xl", height)} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-card)]/60 px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-tint)] text-[var(--brand-accent)]">
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-7 w-7">
            <path d="M3 7h18M3 12h18M3 17h10" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {title && <p className="text-[16px] font-bold text-[var(--text-strong)]">{title}</p>}
      <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-[var(--text-muted)]">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ── Data display ───────────────────────────────────────────── */

/** A definition-list row used across detail panels. */
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[var(--border-subtle)] py-3 last:border-0">
      <dt className="text-[13px] font-medium text-[var(--text-muted)]">{label}</dt>
      <dd className="text-right text-[14px] font-semibold text-[var(--text-strong)]">{value}</dd>
    </div>
  );
}

/** Headline number tile (credits, semester, …). */
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-[26px] font-extrabold leading-none text-[var(--text-strong)]">
        {value}
      </p>
      {hint && <p className="mt-1 text-[12px] text-[var(--text-muted)]">{hint}</p>}
    </Card>
  );
}

/**
 * Horizontally scrollable table wrapper. Wide matrices (CLO↔PLO etc.) scroll
 * inside their own box instead of making the whole page scroll sideways.
 */
export function TableFrame({
  children,
  caption,
  className,
}: {
  children: React.ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]",
        className
      )}
    >
      {caption && (
        <p className="border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-5 py-3 text-[12.5px] font-semibold text-[var(--text-muted)]">
          {caption}
        </p>
      )}
      <div className="table-scroll">{children}</div>
    </div>
  );
}

/** Ordered list of outcome statements (PLO / CLO / TLO / competencies). */
export function OutcomeList({
  items,
  prefix,
}: {
  items: { key: string; content: string; code?: string }[];
  prefix?: string;
}) {
  return (
    <ol className="grid gap-3">
      {items.map((item, i) => (
        <li key={item.key}>
          <Card className="flex gap-4 p-5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-tint)] text-[12px] font-extrabold text-[var(--brand-accent)]">
              {prefix ? `${prefix}${i + 1}` : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] leading-relaxed text-[var(--text-body)]">{item.content}</p>
              {item.code && (
                <p className="mt-2 font-mono text-[11px] text-[var(--text-muted)]">{item.code}</p>
              )}
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
