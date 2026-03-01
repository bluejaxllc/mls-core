import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

/**
 * GET /api/intelligence/fb_live?page=0
 * 
 * Serves Facebook Marketplace listings with on-demand crawl support.
 * 
 * Strategy:
 * 1. Try to proxy to Express backend /fb/drip (where Puppeteer runs)
 * 2. If backend is unavailable, serve directly from the intelligence DB
 *
 * This ensures the endpoint ALWAYS works, even if Railway backend is down.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '0', 10);

        // Try backend proxy first (for on-demand Puppeteer crawl)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        if (backendUrl) {
            try {
                const url = `${backendUrl}/api/intelligence/fb/drip?page=${page}`;
                console.log(`[FB_LIVE] Proxying to backend: ${url}`);

                const authHeader = request.headers.get('authorization');
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                if (authHeader) headers['Authorization'] = authHeader;

                const response = await fetch(url, {
                    headers,
                    signal: AbortSignal.timeout(30000), // 30s timeout
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data);
                }
                console.warn(`[FB_LIVE] Backend returned ${response.status}, falling back to DB`);
            } catch (e: any) {
                console.warn(`[FB_LIVE] Backend unreachable: ${e.message}. Serving from DB.`);
            }
        }

        // Fallback: serve directly from intelligence DB (always works)
        return await serveFromDb(page);

    } catch (e: any) {
        console.error('[FB_LIVE] Error:', e.message);
        // Graceful degradation if Prisma engine is missing on Vercel
        return NextResponse.json({
            items: [],
            total: 0,
            page: 0,
            hasMore: false,
            cached: false,
            source: 'error',
            note: 'Facebook crawler is not yet configured for production. Data is available locally.',
        });
    }
}

/**
 * Serve Facebook listings directly from the intelligence database.
 */
async function serveFromDb(page: number) {
    // Find Facebook source profile
    const source = await prismaIntelligence.sourceProfile.findFirst({
        where: {
            OR: [
                { name: { contains: 'Facebook' } },
                { name: { contains: 'facebook' } },
                { baseUrl: { contains: 'facebook.com' } }
            ]
        }
    });

    if (!source) {
        return NextResponse.json({
            items: [], total: 0, page, hasMore: false,
            note: 'No Facebook source profile configured'
        });
    }

    const skip = page * PAGE_SIZE;

    const [items, total] = await Promise.all([
        prismaIntelligence.observedListing.findMany({
            where: { snapshot: { sourceId: source.id } },
            include: { snapshot: { include: { source: true } } },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip,
        }),
        prismaIntelligence.observedListing.count({
            where: { snapshot: { sourceId: source.id } }
        })
    ]);

    // Extract images from rawJson
    const mapped = items.map((item: any) => {
        let imageUrl = null;
        if (item.snapshot?.rawJson) {
            try {
                const raw = JSON.parse(item.snapshot.rawJson);
                imageUrl = raw.imageUrl || raw.images?.[0] || raw.primary_listing_photo?.listing_image?.uri || null;
            } catch (_e) { }
        }
        return {
            ...item,
            imageUrl,
            snapshot: { ...item.snapshot, rawJson: undefined },
        };
    });

    return NextResponse.json({
        items: mapped,
        total,
        page,
        hasMore: skip + PAGE_SIZE < total,
        cached: true,
        source: 'db-direct',
    });
}
