"use client";

import Image from "next/image";
import { useState } from "react";
import AztuLogoLight from "@/../public/assets/aztu-logo-light-320.png";
import { SITE_TAGLINE, UNIVERSITY } from "@/lib/site";

export default function UnlockPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "/";
        // Only same-site paths — never redirect to an absolute URL supplied in
        // the query string ("//evil.example" would leave the site).
        const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
        window.location.replace(safe);
        return;
      }
      setError("Şifrə yanlışdır. Yenidən cəhd edin. / Incorrect password.");
    } catch {
      setError("Xəta baş verdi. Yenidən cəhd edin. / Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-700 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_110%_at_20%_-10%,#2f4184_0%,transparent_60%)]"
      />
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 text-white opacity-[0.045]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src={AztuLogoLight}
            alt={UNIVERSITY.nameAz}
            width={160}
            height={219}
            className="mx-auto h-20 w-auto object-contain"
            priority
          />
          <p className="mt-5 text-[15px] font-bold text-white">{UNIVERSITY.shortName}</p>
          <p className="mt-0.5 text-[12.5px] text-white/50">{SITE_TAGLINE.az}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
          <h1 className="text-center text-[17px] font-bold text-white">Məhdud giriş</h1>
          <p className="mt-1.5 text-center text-[13px] text-white/55">
            Davam etmək üçün şifrəni daxil edin.
            <br />
            <span className="opacity-80">Enter the password to continue.</span>
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="relative">
              <label htmlFor="gate-password" className="sr-only">
                Şifrə / Password
              </label>
              <input
                id="gate-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrə / Password"
                autoFocus
                autoComplete="current-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "gate-error" : undefined}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-11 text-[14px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-sky-brand-400 focus:ring-4 focus:ring-sky-brand-400/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Şifrəni gizlət / Hide password" : "Şifrəni göstər / Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p id="gate-error" role="alert" className="text-[13px] font-medium text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-[14px] font-bold text-navy-700 transition-all hover:bg-sky-brand-50 disabled:opacity-60"
            >
              {loading ? "Yoxlanılır… / Checking…" : "Davam et / Continue"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11.5px] text-white/35">
          © {new Date().getFullYear()} {UNIVERSITY.nameAz}
        </p>
      </div>
    </div>
  );
}
