"use client";

import { useState } from "react";

export default function UnlockPage() {
    const [password, setPassword] = useState("");
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
            setError("Parol yanlışdır. Yenidən cəhd edin.");
        } catch {
            setError("Xəta baş verdi. Yenidən cəhd edin.");
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
                        src="/aztu-logo-dark.webp"
                        alt="AZTU"
                        className="mx-auto mb-4 h-14 w-14 object-contain"
                    />
                    <h1 className="text-lg font-semibold text-[#0E205B]">
                        Giriş məhduddur
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Davam etmək üçün parolu daxil edin.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Parol"
                            autoFocus
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#182f79] focus:ring-2 focus:ring-[#182f79]/20"
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#182f79] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a96] disabled:opacity-60"
                    >
                        {loading ? "Yoxlanılır..." : "Daxil ol"}
                    </button>
                </form>
            </div>
        </div>
    );
}
