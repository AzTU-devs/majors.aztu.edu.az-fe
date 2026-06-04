"use client";

import React from 'react';
import { motion } from 'framer-motion';

type PageTitleProps = {
  title?: string;
  subtitle?: string;
  category?: string;
};

export default function PageTitle({ title, subtitle, category }: PageTitleProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      {/* subtle navy accent */}
      <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#182f79]/5 blur-3xl dark:bg-blue-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-11 lg:px-8"
      >
        {category && (
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#2563eb] dark:text-blue-400">
            {category}
          </p>
        )}
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#0E205B] dark:text-white md:text-[34px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
