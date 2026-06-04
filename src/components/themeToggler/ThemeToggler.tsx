"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setTheme } from "@/redux/slices/themeSlice";

/**
 * @param onDark  true when the toggler sits on a dark/hero surface (white controls),
 *                false when it sits on a light surface (dark controls).
 */
export default function ThemeToggler({ onDark = false }: { onDark?: boolean }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === "dark";

  const toggle = () => dispatch(setTheme(isDark ? "light" : "dark"));

  const buttonClass = onDark
    ? "bg-white/15 border-white/25 hover:bg-white/25 text-white"
    : "bg-[#182f79]/8 border-[#182f79]/15 hover:bg-[#182f79]/15 text-[#182f79]";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-sm transition-all duration-200 active:scale-90 ${buttonClass}`}
    >
      {isDark ? (
        <svg className="w-[18px] h-[18px] text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
}
