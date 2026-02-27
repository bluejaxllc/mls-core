import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that should NEVER be protected by auth
const PUBLIC_PATHS = [
    '/api/auth',
    '/api/integrations',
    '/api/intelligence',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/icon.png',
    '/icon',
    '/apple-icon.png',
    '/apple-icon',
    '/opengraph-image',
    '/twitter-image',
    '/grid.svg',
    '/robots.txt',
    '/robots',
    '/sitemap.xml',
    '/sitemap',
    '/manifest.webmanifest',
    '/manifest',
    '/auth/signin',
    '/whitepaper',
];

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Fast-path: Allow all public paths through without auth
    if (PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p + '.'))) {
        return NextResponse.next();
    }

    // Fast-path: Allow common static file extensions through
    if (/\.(ico|png|jpg|jpeg|gif|svg|webp|txt|xml|webmanifest|json|css|js|woff|woff2|ttf|eot)$/i.test(path)) {
        return NextResponse.next();
    }

    // Check for NextAuth session cookies
    // Note: In Vercel production, NextAuth uses a '__Secure-next-auth.session-token' prefix
    const hasToken = req.cookies.has("next-auth.session-token") || req.cookies.has("__Secure-next-auth.session-token");

    // Everything else requires auth
    if (!hasToken) {
        // Build absolute redirect URI for Vercel edge router
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except _next/static, _next/image,
         * api/integrations, api/intelligence, and files with common static extensions.
         */
        '/((?!_next/static|_next/image|api/integrations|api/intelligence|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml|webmanifest)$).*)',
    ],
}
