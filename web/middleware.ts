export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, icon.png, apple-icon.png (favicon/icon files)
         * - opengraph-image, twitter-image (OG/social images)
         * - grid.svg (background asset)
         * - robots.txt, sitemap.xml, manifest.webmanifest (SEO/PWA)
         * - auth/signin (custom sign-in page)
         * - whitepaper (public page)
         */
        '/((?!api/auth|_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|opengraph-image|twitter-image|grid\\.svg|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|auth/signin|whitepaper).*)',
    ],
}
