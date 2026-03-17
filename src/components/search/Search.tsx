"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export type Locale = "az" | "en";

interface SearchProps {
    onSearch: (value: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    return (
        <div className="flex items-center gap-3 bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 focus-within:border-[#182f79] focus-within:ring-2 focus-within:ring-[#182f79]/15 px-4 py-3.5 rounded-2xl transition-all duration-200">
            <SearchIcon className="flex-shrink-0" style={{ fontSize: 20, color: "#94a3b8" }} />
            <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                placeholder={locale === "az" ? "İxtisas adı ilə axtarın..." : "Search by specialty name..."}
                className="w-full bg-transparent outline-none text-[#1e293b] dark:text-slate-100 placeholder-[#94a3b8] text-[14px]"
            />
            {searchValue && (
                <button
                    onClick={() => { setSearchValue(""); onSearch(""); }}
                    className="text-[#94a3b8] hover:text-[#64748b] transition-colors flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
