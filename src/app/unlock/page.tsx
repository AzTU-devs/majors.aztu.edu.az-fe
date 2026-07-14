"use client";

import { useState } from "react";

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
                window.location.replace(next.startsWith("/") ? next : "/");
                return;
            }
            setError("Incorrect password. Please try again.");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0E205B] via-[#182f79] to-[#1f3a96] px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
                <div className="mb-6 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/aztu-logo-dark.png"
                        alt="AZTU"
                        className="mx-auto mb-4 h-16 w-auto object-contain"
                    />
                    <h1 className="text-lg font-semibold text-[#0E205B]">
                        Restricted access
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter the password to continue.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoFocus
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none focus:border-[#182f79] focus:ring-2 focus:ring-[#182f79]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#182f79]"
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
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#182f79] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a96] disabled:opacity-60"
                    >
                        {loading ? "Checking..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
