import Link from "next/link";
import React from "react";

import { IconAlert, IconArrowRight, IconList } from "./icons";
import { RetryButton } from "./RetryButton";

/* ────────────────────────────────────────────────────────────
   Small building blocks shared by every page. Server-safe (no hooks), so
   server components render them without shipping any JavaScript; client
   components can use them too. The visual rules live in globals.css
   (.btn, .pill, .card, .kicker …) — these components only assemble markup.
   ──────────────────────────────────────────────────────────── */

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── Layout ─────────────────────────────────────────────────── */

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "nav";
}) {
  return <Tag className={cx("wrap", className)}>{children}</Tag>;
}

/* ── Typography ─────────────────────────────────────────────── */

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cx("kicker", className)}>{children}</p>;
}

/**
 * Section header: big two-line title on the left, a short paragraph on the
 * right, optional actions (a quiet "see all" link, carousel buttons).
 */
export function SectionHead({
  id,
  title,
  lead,
  actions,
  as: Tag = "h2",
  size = "lg",
  className,
}: {
  id?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <div className={cx("grid items-end gap-6 md:grid-cols-12 md:gap-10", className)}>
      <Tag id={id} className={cx(size === "lg" ? "d-lg" : "d-md", "md:col-span-7 max-w-[15ch] md:max-w-none")}>
        {title}
      </Tag>
      {(lead || actions) && (
        <div className="flex flex-col gap-5 md:col-span-5 md:items-end">
          {lead && <p className="text-[17px] leading-[1.65] text-ink-2 md:max-w-[30rem] md:self-start">{lead}</p>}
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      )}
    </div>
  );
}

/** Heading used at the top of a tab's content (programme / subject pages). */
export function PanelHead({
  title,
  lead,
  aside,
  id,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <h2 id={id} className="d-md">
          {title}
        </h2>
        {lead && <p className="mt-3 text-[16.5px] leading-relaxed text-ink-2">{lead}</p>}
      </div>
      {aside && <div className="flex shrink-0 flex-wrap items-center gap-2">{aside}</div>}
    </div>
  );
}

/* ── Surfaces ───────────────────────────────────────────────── */

export function Card({
  children,
  className,
  lift = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
  as?: "div" | "article" | "li" | "section";
}) {
  return <Tag className={cx("card", lift && "card-lift", className)}>{children}</Tag>;
}

export function Pill({
  children,
  tone = "line",
  size = "md",
  className,
  title,
}: {
  children: React.ReactNode;
  tone?: "line" | "k" | "k0" | "gold" | "new" | "navy" | "glass" | "ok";
  size?: "sm" | "md";
  className?: string;
  title?: string;
}) {
  return (
    <span title={title} className={cx("pill", `pill-${tone}`, size === "sm" && "pill-sm", className)}>
      {children}
    </span>
  );
}

/** Monospaced code pill (programme / subject codes). */
export function CodePill({
  children,
  tone = "line",
  className,
}: {
  children: React.ReactNode;
  tone?: "line" | "k" | "k0";
  className?: string;
}) {
  return <span className={cx("pill code", `pill-${tone}`, className)}>{children}</span>;
}

/* ── Actions ────────────────────────────────────────────────── */

type ButtonTone = "primary" | "gold" | "ghost" | "quiet" | "on-navy" | "outline-on-navy";

export function buttonClass(tone: ButtonTone = "primary", size: "sm" | "md" | "lg" = "md", className?: string) {
  return cx("btn", `btn-${tone}`, size === "sm" && "btn-sm", size === "lg" && "btn-lg", className);
}

export function ButtonLink({
  href,
  children,
  tone = "primary",
  size = "md",
  className,
  external = false,
  arrow = false,
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  tone?: ButtonTone;
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  arrow?: boolean;
  prefetch?: boolean;
}) {
  const classes = buttonClass(tone, size, className);
  const content = (
    <>
      {children}
      {arrow && <IconArrowRight className="i-arrow" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} prefetch={prefetch}>
      {content}
    </Link>
  );
}

/** Quiet text link with a trailing arrow ("Bütün proqramlar →"). */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cx("link-arrow", className)}>
      {children}
      <IconArrowRight />
    </Link>
  );
}

/* ── States ─────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx("skeleton", className)} />;
}

export function CardSkeletonGrid({ count = 6, height = "h-[168px]" }: { count?: number; height?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cx("rounded-[20px]", height)} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
  className,
}: {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "k-navy flex flex-col items-center justify-center rounded-[28px] bg-surface px-6 py-14 text-center ring-line-2",
        className
      )}
    >
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-k-100 text-k-700">
        {icon ?? <IconList size={26} />}
      </div>
      {title && <p className="font-display text-[18px] font-bold text-ink">{title}</p>}
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-3">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Shown when a section's data could not be loaded. Kept distinct from
 * EmptyState's "nothing has been published yet" so an API outage is never
 * mistaken for missing content. `onRetry` re-runs the load (see useApi); the
 * server-rendered sections use RefreshErrorState instead.
 */
export function ErrorState({
  locale,
  onRetry,
  retrying = false,
  action,
  returnFocusTo,
}: {
  locale: "az" | "en";
  onRetry?: () => void;
  retrying?: boolean;
  /** Replaces the default retry button. */
  action?: React.ReactNode;
  /** Id of the element that takes focus once a retry succeeds (default: <main>). */
  returnFocusTo?: string;
}) {
  const az = locale === "az";
  return (
    <div role="alert">
      <EmptyState
        title={az ? "Məlumat yüklənmədi" : "This section could not be loaded"}
        message={
          az
            ? "Serverlə əlaqə qurmaq mümkün olmadı. Bir az sonra yenidən cəhd edin."
            : "The server could not be reached. Please try again in a moment."
        }
        icon={<IconAlert size={26} />}
        action={
          action ??
          (onRetry && (
            <RetryButton onRetry={onRetry} retrying={retrying} returnFocusTo={returnFocusTo} className={buttonClass("ghost", "sm")}>
              {az ? "Yenidən cəhd et" : "Try again"}
            </RetryButton>
          ))
        }
      />
    </div>
  );
}

/* ── Data display ───────────────────────────────────────────── */

/** A definition-list row used across detail panels. */
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/** Headline number tile (credits, semester, …). */
export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="card flex items-start gap-4 p-5">
      {icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-k-100 text-k-700">{icon}</span>
      )}
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink-3">{label}</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          {value}
          {hint && <span className="ml-1.5 text-[14px] font-semibold tracking-normal text-ink-3">{hint}</span>}
        </p>
      </div>
    </div>
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
  label,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  /** Accessible name of the scroll region. */
  label?: string;
}) {
  return (
    <div className={cx("tbl-frame", className)}>
      {caption && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5 text-[13.5px] font-medium text-ink-3">
          {caption}
        </div>
      )}
      {/* Focusable so keyboard users can scroll a wide table. */}
      <div className="tbl-scroll" tabIndex={0} role="region" aria-label={label}>
        {children}
      </div>
    </div>
  );
}

/** A tick for matrix cells. */
export function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}
