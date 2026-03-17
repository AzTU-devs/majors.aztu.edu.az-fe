"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setLocale } from "@/redux/slices/localeSlice";
import { useRouter, usePathname } from "next/navigation";

type Locale = "az" | "en";

export default function LanguageToggler() {
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

  return (
    <div className="flex items-center bg-white/15 border border-white/25 rounded-full p-0.5 backdrop-blur-sm">
      {(["az", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => handleChangeLocale(l)}
          className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
            locale === l
              ? "bg-white text-[#182f79] shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
