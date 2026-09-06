"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setTheme, type Theme } from "@/redux/slices/themeSlice";

export function useTheme() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((s: RootState) => s.theme.value);
  const isDark = theme === "dark";

  return {
    theme,
    isDark,
    setTheme: (next: Theme) => dispatch(setTheme(next)),
    toggle: () => dispatch(setTheme(isDark ? "light" : "dark")),
  };
}
