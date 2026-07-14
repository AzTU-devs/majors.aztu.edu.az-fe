// middleware.ts (in src/ because this project uses the src directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GATE_COOKIE, GATE_TOKEN } from './lib/gate';

const allowedLangs = ['en', 'az'];
const defaultLang = 'az';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // The unlock page must always be reachable.
  if (pathname === '/unlock' || pathname.startsWith('/unlock/')) {
    return NextResponse.next();
  }

  // Password gate: without a valid access cookie, send the visitor to /unlock
  // (remembering where they wanted to go via ?next=).
  const unlocked = req.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN;
  if (!unlocked) {
    const url = req.nextUrl.clone();
    url.pathname = '/unlock';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // ---- Language routing (only reached once unlocked) ----
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLang}`;
    return NextResponse.redirect(url);
  }

  const firstSegment = segments[0];
  if (!allowedLangs.includes(firstSegment)) {
    const restPath = segments.slice(1).join('/');
    const redirectPath = restPath ? `/${defaultLang}/${restPath}` : `/${defaultLang}`;
    const url = req.nextUrl.clone();
    url.pathname = redirectPath;
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run on page routes only — skip API, Next internals, and static files.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
