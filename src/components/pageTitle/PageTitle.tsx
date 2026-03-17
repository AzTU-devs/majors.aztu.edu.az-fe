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
    <div
      className="relative h-[260px] w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #182f79 0%, #1e40af 45%, #0E205B 100%)",
      }}
    >
      {/* Dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Angled geometric accent — right side */}
      <div
        className="absolute -right-16 top-0 h-full w-64 opacity-10"
        style={{
          background: "linear-gradient(to left, #ffffff, transparent)",
          clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Large decorative circle */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-white/10" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-8 z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {category && (
          <span className="inline-flex items-center gap-1.5 text-white/60 text-[11px] uppercase tracking-[0.15em] font-semibold mb-3">
            <span className="w-4 h-px bg-white/40" />
            {category}
          </span>
        )}
        <div className="flex items-end gap-4">
          <div className="w-1 h-10 rounded-full bg-white/50 mb-0.5 flex-shrink-0" />
          <div>
            <h1 className="text-white text-[24px] md:text-[30px] font-bold leading-tight drop-shadow-sm">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/65 text-[13px] md:text-sm mt-1.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
