"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";
import {
  getSpecialtyChar,
  SpecialtyChar,
} from "@/services/specialtCharacteristics/specialtyChar";

export type Locale = "az" | "en";

export default function SpecialtyDetails({
  specialtyCode,
}: {
  specialtyCode: string;
}) {
  const locale: Locale = useSelector((state: RootState) => state.locale.value);
  const [specialtyName, setSpecialtyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [specialtyChar, setSpecialtyChar] = useState<SpecialtyChar>();

  useEffect(() => {
    setLoading(true);
    getSpecialtyDetails(specialtyCode, locale)
      .then(setSpecialtyName)
      .finally(() => setLoading(false));
    getSpecialtyChar(specialtyCode, locale).then(setSpecialtyChar);
  }, [locale, specialtyCode]);

  const navItems = [
    { href: "program-learning-outcomes", az: "Proqram Təlim məqsədləri", en: "Program learning outcomes" },
    { href: "student-learning-outcomes", az: "Tələbələrin Təlim Nəticələri", en: "Student Learning Outcomes" },
    { href: "graduate-career-opportunities", az: "Məzunların Karyera İmkanları", en: "Graduate Career Opportunities" },
    // { href: "literatures", az: "Ədəbiyyat", en: "Literatures" },
    { href: "competency", az: "Səriştələr", en: "Competencies" },
    { href: "subjects", az: "Kurrikulum", en: "Curriculum" },
    { href: "clo", az: "İxtisasın təlim nəticəsi", en: "Course learning outcomes" },
  ];

  return (
    <section className="py-10 px-6 lg:px-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#182f79]">
          {loading ? (
            <Skeleton width={250} />
          ) : (
            `${specialtyName} (${specialtyCode})`
          )}
        </h1>
      </div>
      <nav className="flex flex-wrap justify-center gap-3 mb-12">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}/bachelor/specialty-details/${specialtyCode}/${item.href}`}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#182f79] hover:text-white transition"
          >
            {locale === "az" ? item.az : item.en}
          </Link>
        ))}
      </nav>
      <div className="max-w-[80%] mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-[#182f79] mb-4 text-center">
            {locale === "az" ? "Proqram deskripsiyası" : "Program description"}
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed text-justify">
            {loading ? (
              <div className="space-y-2">
                <Skeleton animation="wave" height={28} width="90%" />
                <Skeleton animation="wave" height={28} width="85%" />
                <Skeleton animation="wave" height={28} width="80%" />
                <Skeleton animation="wave" height={28} width="75%" />
              </div>
            ) : (
              specialtyChar?.program_desc
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#182f79] mb-4 text-center">
            {locale === "az" ? "Proqram tələbləri" : "Program requirements"}
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed text-justify">
            {loading ? (
              <div className="space-y-2">
                <Skeleton animation="wave" height={28} width="90%" />
                <Skeleton animation="wave" height={28} width="85%" />
                <Skeleton animation="wave" height={28} width="80%" />
              </div>
            ) : (
              specialtyChar?.degree_requirements
            )}
          </div>
        </div>
      </div>
    </section>
  );
}