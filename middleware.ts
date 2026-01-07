// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedLangs = ['en', 'az'];
const defaultLang = 'az';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Ignore Next.js internals and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);

  // If no segments, redirect root to default language
  if (segments.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLang}`;
    return NextResponse.redirect(url);
  }

  const firstSegment = segments[0];

  // If first segment is not allowed, redirect to defaultLang preserving rest of path
  if (!allowedLangs.includes(firstSegment)) {
    const restPath = segments.slice(1).join('/'); // skip the first invalid segment
    const redirectPath = restPath ? `/${defaultLang}/${restPath}` : `/${defaultLang}`;
    const url = req.nextUrl.clone();
    url.pathname = redirectPath;
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply to all paths
export const config = {
  matcher: '/:path*',
};