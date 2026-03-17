"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AztuLogoLight from "@/../public/assets/aztu-logo-light.png";

export default function Footer() {
    const { lang } = useParams();

    return (
        <footer>
            {/* Top separator gradient */}
            <div
                className="h-px w-full"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
            />

            <div
                className="px-6 md:px-16 py-14"
                style={{ background: "linear-gradient(180deg, #182f79 0%, #112368 100%)" }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <Image
                            src={AztuLogoLight}
                            alt="Azərbaycan Texniki Universiteti"
                            width={110}
                            height={110}
                            className="object-contain"
                        />
                        <p className="text-white/50 text-[13px] leading-relaxed max-w-[200px]">
                            Azərbaycan Texniki Universiteti — texniki elmlər sahəsində aparıcı ali təhsil müəssisəsi.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h2 className="text-white/40 text-[10px] uppercase tracking-[0.14em] font-semibold mb-4">
                            Keçidlər
                        </h2>
                        <ul className="flex flex-col gap-2.5">
                            {[
                                { href: `/${lang}/bachelor`, label: "Bakalavr" },
                                { href: `/${lang}/master`, label: "Magistr" },
                                { href: `/${lang}/faculties`, label: "Fakültələr" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-white/60 hover:text-white transition-colors text-[14px] flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-white/60 transition-all duration-200 overflow-hidden" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-white/40 text-[10px] uppercase tracking-[0.14em] font-semibold mb-4">
                            Əlaqə
                        </h2>
                        <ul className="flex flex-col gap-2.5">
                            <li>
                                <a
                                    href="https://aztu.edu.az"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors text-[14px]"
                                >
                                    aztu.edu.az
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:aztu@aztu.edu.az"
                                    className="text-white/60 hover:text-white transition-colors text-[14px] flex items-center gap-2"
                                >
                                    <EmailIcon style={{ fontSize: 14 }} className="opacity-60" />
                                    aztu@aztu.edu.az
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Phone */}
                    <div>
                        <h2 className="text-white/40 text-[10px] uppercase tracking-[0.14em] font-semibold mb-4">
                            Telefon
                        </h2>
                        <ul className="flex flex-col gap-2.5">
                            {["+994125383383", "+994125391305"].map((num) => (
                                <li key={num}>
                                    <a
                                        href={`tel:${num}`}
                                        className="text-white/60 hover:text-white transition-colors text-[14px] flex items-center gap-2"
                                    >
                                        <LocalPhoneIcon style={{ fontSize: 14 }} className="opacity-60" />
                                        {num.replace("+994", "(+994 ").replace(/(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1) $2-$3-$4")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="bg-[#0E205B] py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <p className="text-white/40 text-[12px]">
                        © {new Date().getFullYear()} Azərbaycan Texniki Universiteti. Bütün hüquqlar qorunur.
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                        <span className="text-white/30 text-[11px]">aztu.edu.az</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
