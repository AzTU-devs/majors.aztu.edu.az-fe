"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setTheme, type Theme } from "@/redux/slices/themeSlice";

/**
 * Keeps the Redux theme, <html data-theme> and localStorage in step.
 *
 * The attribute itself is set before first paint by the inline script in the
 * root layout; this component adopts whatever that script decided so the store
 * agrees with what the user is already looking at.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((s: RootState) => s.theme.value);
  const hydrated = useRef(false);

  useEffect(() => {
    const applied = document.documentElement.getAttribute("data-theme");
    if (applied === "dark" || applied === "light") {
      dispatch(setTheme(applied as Theme));
    }
    hydrated.current = true;
  }, [dispatch]);

  useEffect(() => {
    // Skip the first pass so the store's default ("light") cannot overwrite the
    // dark theme the inline script has already applied.
    if (!hydrated.current) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode / storage disabled — the theme just won't persist.
    }
  }, [theme]);

  return <>{children}</>;
}
