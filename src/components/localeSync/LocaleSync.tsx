"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLocale } from "@/redux/slices/localeSlice";

/**
 * Keeps the Redux `locale` in sync with the URL `[lang]` segment.
 *
 * The URL is the source of truth for the language, so a direct load / refresh
 * of e.g. /en/bachelor renders in English instead of falling back to the
 * Redux default ("az").
 */
export default function LocaleSync() {
    const params = useParams();
    const dispatch = useDispatch();

    const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

    useEffect(() => {
        if (lang === "en" || lang === "az") {
            dispatch(setLocale(lang));
        }
    }, [lang, dispatch]);

    return null;
}
