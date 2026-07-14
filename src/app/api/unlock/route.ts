import { NextResponse } from "next/server";
import { GATE_COOKIE, GATE_TOKEN } from "@/lib/gate";

// The site password. Override with the SITE_PASSWORD env var in production.
const SITE_PASSWORD = process.env.SITE_PASSWORD || "AzTU-cxjoGk";

export async function POST(req: Request) {
    let password = "";
    try {
        const body = await req.json();
        password = String(body?.password ?? "");
    } catch {
        password = "";
    }

    if (password !== SITE_PASSWORD) {
        return NextResponse.json(
            { ok: false, message: "Incorrect password." },
            { status: 401 }
        );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(GATE_COOKIE, GATE_TOKEN, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}
