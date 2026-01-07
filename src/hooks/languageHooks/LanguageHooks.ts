"use client";

import { useState } from "react";

export function LanguageHooks() {
    const [selectedLanguage, setSelectedLanguage] = useState("Az");

    const toggleLanguage = (language: string) => {
        setSelectedLanguage(language);
    };

    return {
        selectedLanguage,
        toggleLanguage
    };
}
