"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setLocale } from "@/redux/slices/localeSlice";
import { useRouter, usePathname } from "next/navigation";

type Locale = "az" | "en";

/**
 * @param onDark  true when the toggler sits on a dark/hero surface (white controls),
 *                false when it sits on a light surface (dark controls).
 */
export default function LanguageToggler({ onDark = false }: { onDark?: boolean }) {
  const dispatch = useDispatch<AppDispatch>();
  const locale = useSelector((state: RootState) => state.locale.value);

  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    dispatch(setLocale(newLocale));
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    router.push("/" + segments.join("/"));
  };

  const wrapClass = onDark
    ? "bg-white/15 border-white/25"
    : "bg-[#182f79]/8 border-[#182f79]/15";

  const inactiveClass = onDark
    ? "text-white/70 hover:text-white"
    : "text-[#182f79]/60 hover:text-[#182f79]";

  return (
    <div className={`flex items-center rounded-full p-0.5 border backdrop-blur-sm ${wrapClass}`}>
      {(["az", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => handleChangeLocale(l)}
          className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
            locale === l
              ? "bg-white text-[#182f79] shadow-sm"
              : inactiveClass
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
