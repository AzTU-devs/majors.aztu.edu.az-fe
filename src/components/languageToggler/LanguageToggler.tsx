"use client";

import { t } from "@/lib/i18n";
import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setLocale } from "@/redux/slices/localeSlice";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter, usePathname } from "next/navigation";

type Locale = "az" | "en";
const locales: Locale[] = ["az", "en"];

export default function LanguageToggler() {
  const dispatch = useDispatch<AppDispatch>();
  const locale = useSelector((state: RootState) => state.locale.value);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLocale = (newLocale: Locale) => {
    dispatch(setLocale(newLocale));
    handleClose();

    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    router.push("/" + segments.join("/"));
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleClick}
        className="p-2 border border-[rgba(0,0,0,0.2)] rounded-[10px] flex justify-center items-center cursor-pointer"
      >
        <LanguageIcon className="text-[rgba(0,0,0,0.4)] mr-[5px]" />
        <p className="text-[rgba(0,0,0,0.6)]">{locale.toUpperCase()}</p>
      </button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} className="mt-[10px]">
        {locales
          .filter((l) => l !== locale)
          .map((l) => (
            <MenuItem key={l} onClick={() => handleChangeLocale(l)}>
              {l.toUpperCase()}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}