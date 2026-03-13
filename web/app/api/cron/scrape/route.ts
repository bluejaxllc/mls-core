import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — scrapers need time

const PROXY_URL = (process.env.ML_PROXY_URL || 'https://mls-proxy-production.up.railway.app').trim();
const PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';
const CRON_SECRET = process.env.CRON_SECRET || 'bluejax-cron-2026';

/**
 * GET /api/cron/scrape
 * Called by Vercel Cron daily (or manually with ?secret=...).
 * Scrapes all 5 portals via the proxy and saves results to the Listing table.
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
        { name: 'Facebook Marketplace', portal: 'facebook', url: 'https://www.facebook.com/marketplace/chihuahua/propertyforsale/?exact=false', timeout: 60000 },
        { name: 'Mercado Libre', portal: 'ml', url: 'https://inmuebles.mercadolibre.com.mx/inmuebles/venta/chihuahua/chihuahua/', timeout: 25000 },
        { name: 'Inmuebles24', portal: 'inmuebles24', url: 'https://www.inmuebles24.com/inmuebles-en-venta-en-chihuahua.html', timeout: 50000 },
        { name: 'Lamudi', portal: 'lamudi', url: 'https://www.lamudi.com.mx/chihuahua/chihuahua-1/for-sale/', timeout: 50000 },
        { name: 'Vivanuncios', portal: 'vivanuncios', url: 'https://www.vivanuncios.com.mx/inmuebles-en-venta-en-chihuahua.html', timeout: 50000 },
    ];

    // Run all scrapers in parallel
    const scrapePromises = scrapers.map(async ({ name, portal, url, timeout }) => {
        try {
            const proxyRes = await fetch(
                `${PROXY_URL}/scrape?portal=${portal}&url=${encodeURIComponent(url)}`,
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
            await prisma.listing.upsert({
                where: { unique_source_listing: { sourceId, source } },
                update: {
                    price: item.price || undefined,
                    status: item.status || undefined,
                    lastVerifiedAt: new Date(),
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
                    images: JSON.stringify(item.images || (item.imageUrl ? [item.imageUrl] : [])),
                    trustScore: 30,
                    scrapedAt: new Date(),
                },
            });
            saved++;
        } catch (e: any) {
            skipped++;
        }
    }

    const elapsed = Date.now() - startTime;

    console.log(`[Cron Scrape] Done in ${elapsed}ms — ${saved} saved, ${skipped} skipped, ${allListings.length} total`);

    return NextResponse.json({
        success: true,
        elapsed: `${elapsed}ms`,
        total: allListings.length,
        saved,
        skipped,
        sources: results,
    });
}
