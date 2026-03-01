import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/intelligence/fb_live?page=0
 * 
 * Proxies to the Express backend's /api/intelligence/fb/drip endpoint.
 * The backend handles the actual Puppeteer drip crawl (zero cost, no Apify).
 * 
 * This proxy exists because the Next.js edge runtime can't run Puppeteer,
 * but the Railway Express backend can.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const url = `${backendUrl}/api/intelligence/fb/drip?page=${page}`;

        console.log(`[FB_LIVE] Proxying to backend: ${url}`);

        const authHeader = request.headers.get('authorization');
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            headers,
            signal: AbortSignal.timeout(90000), // 90s timeout (crawl can take up to 60s)
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (e: any) {
        console.error('[FB_LIVE] Proxy error:', e.message);
        return NextResponse.json(
            { error: e.message, items: [], total: 0, hasMore: false },
            { status: 500 }
        );
    }
}
