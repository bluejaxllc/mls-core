import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Paths that should NEVER be protected by auth
const PUBLIC_PATHS = [
    '/api/auth',
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
]

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                const path = req.nextUrl.pathname
                // Allow all public paths through without auth
                if (PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p + '.'))) {
                    return true
                }
                // Everything else requires auth
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except _next/static, _next/image,
         * and files with common static extensions.
         */
        '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml|webmanifest)$).*)',
    ],
}
