import { NextRequest, NextResponse } from 'next/server';
import { prismaCore as prisma } from '@/lib/prisma-core';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — scrapers need time

const GCP_PROXY = 'https://mls-proxy-snz5dayccq-uc.a.run.app';
const PROXY_URL = (() => {
    const env = (process.env.ML_PROXY_URL || '').trim();
    if (process.env.NODE_ENV === 'development') return 'http://localhost:3008';
    return env ? env : GCP_PROXY;
})();
const PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';
const CRON_SECRET = process.env.CRON_SECRET || 'bluejax-cron-2026';

/**
 * GET /api/cron/scrape
 * Called by Vercel Cron daily (or manually with ?secret=...).
 * Scrapes all 8 portals via the proxy and saves results to the Listing table.
 */
export async function GET(req: NextRequest) {
    // Verify cron secret (Vercel sends Authorization header for cron jobs)
    const authHeader = req.headers.get('authorization');
    const urlSecret = req.nextUrl.searchParams.get('secret');
    if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    const results: Record<string, { count: number; error?: string }> = {};

    // Define all scraper targets for Chihuahua
    const scrapers = [
        { name: 'Facebook Marketplace', portal: 'facebook', url: 'https://www.facebook.com/marketplace/chihuahua/propertyforsale/?exact=false', timeout: 120000 },
        { name: 'Mercado Libre', portal: 'ml', url: 'https://inmuebles.mercadolibre.com.mx/inmuebles/venta/chihuahua/chihuahua/', timeout: 150000 },
        { name: 'Inmuebles24', portal: 'inmuebles24', url: 'https://www.inmuebles24.com/inmuebles-en-venta-en-chihuahua.html', timeout: 180000 },
        { name: 'Lamudi', portal: 'lamudi', url: 'https://www.lamudi.com.mx/chihuahua/chihuahua-1/for-sale/', timeout: 180000 },
        { name: 'Century 21', portal: 'century21', url: 'https://century21mexico.com/v/resultados/en-pais_mexico/en-estado_chihuahua/en-municipio_chihuahua-chihuahua', timeout: 180000 },
        { name: 'RE/MAX', portal: 'remax', url: 'https://remax.com.mx/propiedades/chihuahua_chihuahua', timeout: 180000 },
        { name: 'Realtor', portal: 'realtor', url: 'https://www.realtor.com/international/mx/chihuahua/', timeout: 180000 },
        { name: 'Pincali', portal: 'pincali', url: 'https://www.pincali.com/chihuahua/venta/inmuebles', timeout: 180000 },
    ];

    // Run all scrapers in parallel
    const scrapePromises = scrapers.map(async ({ name, portal, url, timeout }) => {
        try {
            const proxyRes = await fetch(
                `${PROXY_URL}/scrape?portal=${portal}&url=${encodeURIComponent(url)}&maxPages=5`,
                {
                    headers: { 'x-proxy-secret': PROXY_SECRET, 'Bypass-Tunnel-Reminder': 'true' },
                    signal: AbortSignal.timeout(timeout),
                },
            );

            if (!proxyRes.ok) {
                results[name] = { count: 0, error: `HTTP ${proxyRes.status}` };
                return [];
            }

            const data = await proxyRes.json();
            const listings = data?.listings || [];
            results[name] = { count: listings.length };
            return listings.map((l: any) => ({ ...l, source: l.source || name }));
        } catch (e: any) {
            results[name] = { count: 0, error: e.message };
            return [];
        }
    });

    const allResults = await Promise.all(scrapePromises);
    const allListings = allResults.flat();

    // Save to database
    let saved = 0;
    let skipped = 0;

    for (const item of allListings) {
        const sourceId = item.id || `${(item.source || 'unknown').toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const source = item.source || 'Unknown';

        try {
            const imgArr = item.images || (item.imageUrl ? [item.imageUrl] : []);
            await prisma.listing.upsert({
                where: { unique_source_listing: { sourceId, source } },
                update: {
                    price: item.price || undefined,
                    status: item.status || undefined,
                    lastVerifiedAt: new Date(),
                    // Update rich content when available
                    ...(item.description ? { description: item.description } : {}),
                    ...(imgArr.length > 0 ? { images: JSON.stringify(imgArr) } : {}),
                    ...(item.address || item.location ? { address: item.address || item.location } : {}),
                    ...(item.city ? { city: item.city } : {}),
                    ...(item.state ? { state: item.state } : {}),
                },
                create: {
                    propertyId: `SCR-${sourceId.slice(0, 12)}`,
                    title: item.title || null,
                    description: item.description || null,
                    price: item.price || null,
                    address: item.address || item.location || null,
                    city: item.city || 'Chihuahua',
                    state: item.state || 'Chihuahua',
                    propertyType: item.propertyType || 'residential',
                    status: item.status || 'DETECTED_SALE',
                    source,
                    sourceId,
                    sourceUrl: item.sourceUrl || item.url || null,
                    listingType: item.listingType || 'SALE',
                    images: JSON.stringify(imgArr),
                    trustScore: 30,
                    scrapedAt: new Date(),
                },
            });
            saved++;
        } catch (e: any) {
            skipped++;
        }
    }

    // ── Expiry Sweep: mark stale listings as EXPIRED ──
    let expired = 0;
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const expireResult = await prisma.listing.updateMany({
            where: {
                lastVerifiedAt: { lt: sevenDaysAgo },
                status: { not: 'EXPIRED' },
            },
            data: { status: 'EXPIRED' },
        });
        expired = expireResult.count;
        if (expired > 0) console.log(`[Cron Scrape] Expired ${expired} stale listings (not verified in 7 days)`);
    } catch (e: any) {
        console.error('[Cron Scrape] Expiry sweep failed:', e.message);
    }

    const elapsed = Date.now() - startTime;

    console.log(`[Cron Scrape] Done in ${elapsed}ms — ${saved} saved, ${skipped} skipped, ${expired} expired, ${allListings.length} total`);

    return NextResponse.json({
        success: true,
        elapsed: `${elapsed}ms`,
        total: allListings.length,
        saved,
        skipped,
        expired,
        sources: results,
    });
}
