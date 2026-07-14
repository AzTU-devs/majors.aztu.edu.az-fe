"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Faculty, getFaculties } from "@/services/faculty/facultyService";

export type Locale = "az" | "en";

export default function FacultyCategory() {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFaculties(locale)
      .then((res) => setFaculties(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, [locale]);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-[#f1f5f9] dark:bg-slate-700 animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  const chip = (active: boolean) =>
    `flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold border transition-all duration-200 ${
      active
        ? "bg-[#182f79] text-white border-[#182f79] shadow-sm shadow-[#182f79]/25"
        : "bg-white dark:bg-slate-700/40 text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-600 hover:border-[#182f79]/40 hover:text-[#182f79] dark:hover:text-blue-300"
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button onClick={() => setSelected(null)} className={chip(selected === null)}>
        {locale === "az" ? "Hamısı" : "All"}
      </button>
      {faculties.map((faculty) => (
        <button
          key={faculty.faculty_code}
          title={faculty.faculty_name}
          onClick={() => setSelected(faculty.faculty_code)}
          className={chip(selected === faculty.faculty_code)}
        >
          {faculty.faculty_name}
        </button>
      ))}
    </div>
  );
}
