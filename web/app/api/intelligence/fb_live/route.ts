import { NextResponse } from 'next/server';

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
 * 3. If Prisma engine is unavailable (Vercel), return graceful empty result
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '0', 10);

        // Serve from intelligence DB directly
        return await serveFromDb(page);

    } catch (e: any) {
        console.error('[FB_LIVE] Error:', e.message);
        return NextResponse.json({
            items: [],
            total: 0,
            page: 0,
            hasMore: false,
            cached: false,
            source: 'error',
            note: 'Facebook data unavailable.',
        });
    }
}

/**
 * Serve Facebook listings from the intelligence database.
 * Uses dynamic import to avoid runtime crash when Prisma engine is missing.
 */
async function serveFromDb(page: number) {
    let prismaIntelligence: any;
    try {
        const mod = await import('@/lib/prisma-intelligence');
        prismaIntelligence = mod.prismaIntelligence;
    } catch (e: any) {
        console.warn('[FB_LIVE] Prisma intelligence client unavailable:', e.message);
        return NextResponse.json({
            items: [],
            total: 0,
            page,
            hasMore: false,
            cached: false,
            source: 'unavailable',
            note: 'Intelligence database not configured for this environment.',
        });
    }

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
