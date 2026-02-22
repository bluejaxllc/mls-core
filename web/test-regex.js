const regex = new RegExp('^/((?!api/auth|_next/static|_next/image|favicon.ico|icon\\.png|og-image|opengraph-image|twitter-image|grid\\.svg|auth/signin|whitepaper).*)');

const paths = [
    '/',
    '/api/auth/signin',
    '/_next/static/js/main.js',
    '/favicon.ico',
    '/icon.png',
    '/opengraph-image',
    '/opengraph-image?v=1',
    '/opengraph-image/route',
    '/apple-icon.png',
    '/icon.svg'
];

paths.forEach(p => {
    const pathname = new URL(p, 'http://localhost').pathname;
    console.log(`${p} (pathname: ${pathname}) matches? ${regex.test(pathname)}`);
});
