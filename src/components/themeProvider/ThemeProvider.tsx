"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setTheme, type Theme } from "@/redux/slices/themeSlice";
import { THEME_COLOR } from "@/lib/site";

/** Point the browser UI colour at the active theme. */
function syncThemeColor(theme: Theme) {
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLOR[theme]));
}

/**
 * Keeps the Redux theme, <html data-theme> and localStorage in step.
 *
 * The attribute itself is set before first paint by the inline script in the
 * root layout; this component adopts whatever that script decided so the store
 * agrees with what the user is already looking at, and writes back only when
 * the visitor toggles. (The previous version wrote the store's default
 * "light" once on mount, flashing dark-mode visitors to light for a frame.)
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((s: RootState) => s.theme.value);
  const mounted = useRef(false);

  useEffect(() => {
    const applied = document.documentElement.getAttribute("data-theme");
    if (applied === "dark" || applied === "light") {
      dispatch(setTheme(applied));
      syncThemeColor(applied);
    }
  }, [dispatch]);

  useEffect(() => {
    // The first value is the store's placeholder, not a choice.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const root = document.documentElement;
    if (root.getAttribute("data-theme") === theme) return;
    root.setAttribute("data-theme", theme);
    syncThemeColor(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode / storage disabled — the theme just won't persist.
    }
  }, [theme]);

  return <>{children}</>;
}
