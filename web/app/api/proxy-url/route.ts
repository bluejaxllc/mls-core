import { NextResponse } from 'next/server';

/**
 * GET /api/proxy-url
 * Returns the ML proxy tunnel URL so the client can call it directly.
 * This avoids Vercel function timeout issues for scraper calls.
 */
export async function GET() {
    const proxyUrl = process.env.ML_PROXY_URL || '';
    return NextResponse.json({
        url: proxyUrl,
        secret: process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026',
    });
}
