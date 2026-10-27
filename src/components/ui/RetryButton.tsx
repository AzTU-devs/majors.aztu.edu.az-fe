"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A "try again" button that stays focusable while the retry runs.
 *
 * `disabled` would drop keyboard focus to <body> the moment it is pressed;
 * aria-disabled keeps the button (and focus) in place and only ignores
 * presses. When the retry succeeds the error state — and this button — goes
 * away: if the button had focus then, focus moves to `returnFocusTo` (an
 * element id; the page's <main> by default) instead of being lost.
 */
export function RetryButton({
  onRetry,
  retrying = false,
  className,
  returnFocusTo = "main",
  children,
}: {
  onRetry: () => void;
  retrying?: boolean;
  className?: string;
  returnFocusTo?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // A layout-effect cleanup runs while the button is still in the document,
  // so it can tell whether the button was focused when it was removed.
  useLayoutEffect(() => {
    const button = ref.current;
    return () => {
      if (!button || document.activeElement !== button) return;
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (active && active !== document.body) return;
        const target = document.getElementById(returnFocusTo) ?? document.getElementById("main");
        target?.focus({ preventScroll: true });
      });
    };
  }, [returnFocusTo]);

  return (
    <button
      ref={ref}
      type="button"
      aria-disabled={retrying || undefined}
      onClick={() => {
        if (!retrying) onRetry();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
