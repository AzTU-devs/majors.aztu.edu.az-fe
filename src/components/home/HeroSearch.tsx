"use client";

import { useRef, useState } from "react";

import { IconArrowRight, IconBook, IconCap, IconSearch } from "@/components/ui/icons";
import { tr } from "@/lib/i18n";
import { catalogPath } from "@/lib/routes";
import type { Locale } from "@/lib/site";

type Scope = "all" | "bachelor" | "master";

/**
 * The hero search: a scope switch (all / bachelor / master) attached to a
 * large field. It is a plain GET form, so it works before hydration and
 * without JavaScript (scope "all"); the switch only changes where it submits.
 * The switch is a radio group: arrow keys move the selection.
 */
export default function HeroSearch({ locale }: { locale: Locale }) {
  const [scope, setScope] = useState<Scope>("all");
  const refs = useRef<Record<Scope, HTMLButtonElement | null>>({ all: null, bachelor: null, master: null });

  const scopes: { id: Scope; label: string; icon?: React.ReactNode; action: string }[] = [
    { id: "all", label: tr(locale, "Hamısı", "All"), action: catalogPath(locale) },
    { id: "bachelor", label: tr(locale, "Bakalavr", "Bachelor's"), icon: <IconCap />, action: catalogPath(locale, 1) },
    { id: "master", label: tr(locale, "Magistr", "Master's"), icon: <IconBook />, action: catalogPath(locale, 2) },
  ];
  const current = scopes.find((s) => s.id === scope) ?? scopes[0];

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const order = scopes.map((s) => s.id);
    const at = order.indexOf(scope);
    let next: Scope | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = order[(at + 1) % order.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = order[(at - 1 + order.length) % order.length];
    if (e.key === "Home") next = order[0];
    if (e.key === "End") next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    setScope(next);
    refs.current[next]?.focus();
  };

  return (
    <form role="search" action={current.action} method="get" className="hsearch">
      <div
        className="tabs-f"
        role="radiogroup"
        aria-label={tr(locale, "Təhsil pilləsi", "Degree level")}
        onKeyDown={onKeyDown}
      >
        {scopes.map((s) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[s.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={scope === s.id}
            tabIndex={scope === s.id ? 0 : -1}
            onClick={() => setScope(s.id)}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>
      <div className="field">
        <IconSearch />
        <label htmlFor="hero-search" className="sr-only">
          {tr(locale, "İxtisas adı və ya kodu", "Programme name or code")}
        </label>
        <input
          id="hero-search"
          name="q"
          type="search"
          placeholder={tr(locale, "İxtisas adı və ya kodu…", "Programme name or code…")}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="btn btn-primary go">
          <span className="go-label">{tr(locale, "Axtarın", "Search")}</span>
          <IconArrowRight className="i-arrow" />
        </button>
      </div>
    </form>
  );
}
