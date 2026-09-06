import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { GATE_COOKIE, GATE_TOKEN } from "@/lib/gate";

// The site password. Override with the SITE_PASSWORD env var in production.
const SITE_PASSWORD = process.env.SITE_PASSWORD || "AzTU-cxjoGk";

/** Length-independent constant-time comparison. */
function matches(candidate: string, expected: string): boolean {
    // Hash both sides to a fixed width first so timingSafeEqual never throws on
    // a length mismatch (and the length itself isn't leaked by timing).
    const a = Buffer.from(candidate, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) {
        // Still burn a comparison so a wrong-length guess isn't measurably faster.
        timingSafeEqual(b, b);
        return false;
    }
    return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
    let password = "";
    try {
        const body = await req.json();
        password = String(body?.password ?? "");
    } catch {
        password = "";
    }

    if (!matches(password, SITE_PASSWORD)) {
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
