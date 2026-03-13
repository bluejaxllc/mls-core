// Debug endpoint: test proxy connectivity from Railway's server
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== (process.env.CRON_SECRET || 'bluejax-cron-2026')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proxyUrl = process.env.ML_PROXY_URL || 'NOT_SET';
    const proxySecret = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';

    const results: Record<string, any> = {
        ML_PROXY_URL: proxyUrl,
        ML_PROXY_SECRET_SET: !!process.env.ML_PROXY_SECRET,
        timestamp: new Date().toISOString(),
    };

    // Test 1: health endpoint
    try {
        const healthRes = await fetch(`${proxyUrl}/health`, {
            headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' },
            signal: AbortSignal.timeout(10000),
        });
        results.health = {
            status: healthRes.status,
            statusText: healthRes.statusText,
            body: await healthRes.text().catch(() => 'failed to read body'),
        };
    } catch (e: any) {
        results.health = { error: e.message, code: e.code, cause: e.cause?.message };
    }

    // Test 2: raw fetch to the URL
    try {
        const rawRes = await fetch(proxyUrl, {
            headers: { 'Bypass-Tunnel-Reminder': 'true' },
            signal: AbortSignal.timeout(10000),
        });
        results.raw = { status: rawRes.status, statusText: rawRes.statusText };
    } catch (e: any) {
        results.raw = { error: e.message, code: e.code };
    }

    return NextResponse.json(results, { status: 200 });
}
