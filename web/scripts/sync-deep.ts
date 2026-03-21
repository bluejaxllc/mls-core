import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly since we are outside the framework
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Construct prisma client exactly like lib/prisma-core.ts to avoid path alias issues in scripts
const prisma = new PrismaClient();

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
const PROXY_URL = 'http://localhost:3008';
const PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';

const scrapers = [
    { name: 'Mercado Libre', portal: 'ml', url: 'https://inmuebles.mercadolibre.com.mx/inmuebles/venta/chihuahua/chihuahua/', maxPages: 50 },
    { name: 'Inmuebles24', portal: 'inmuebles24', url: 'https://www.inmuebles24.com/inmuebles-en-venta-en-chihuahua.html', maxPages: 25 }, // 25 to avoid captcha blocks
    { name: 'Century 21', portal: 'century21', url: 'https://century21mexico.com/v/resultados/en-pais_mexico/en-estado_chihuahua/en-municipio_chihuahua-chihuahua', maxPages: 20 },
    { name: 'RE/MAX', portal: 'remax', url: 'https://remax.com.mx/propiedades/chihuahua_chihuahua', maxPages: 20 },
    { name: 'Lamudi', portal: 'lamudi', url: 'https://www.lamudi.com.mx/chihuahua/chihuahua-1/for-sale/', maxPages: 25 },
    { name: 'Realtor', portal: 'realtor', url: 'https://www.realtor.com/international/mx/chihuahua/', maxPages: 25 },
    { name: 'Pincali', portal: 'pincali', url: 'https://www.pincali.com/chihuahua/venta/inmuebles', maxPages: 10 },
    { name: 'Facebook Marketplace', portal: 'facebook', url: 'https://www.facebook.com/marketplace/chihuahua/propertyforsale/?exact=false', maxPages: 5 }, // FB is infinite scroll
];

async function main() {
    console.log('======================================================');
    console.log('🚀 INITIALIZING DEEP SYNC PIPELINE');
    console.log('======================================================');
    console.log(`Targeting ${scrapers.length} endpoints via proxy: ${PROXY_URL}`);
    console.log(`Database connected. Ready to ingest.\n`);

    let totalSaved = 0;
    let totalSkipped = 0;

    for (const scraper of scrapers) {
        console.log(`\n------------------------------------------------------`);
        console.log(`🟡 START: [${scraper.name}] — Max target pages: ${scraper.maxPages}`);
        console.log(`URL: ${scraper.url}`);

        try {
            const start = Date.now();
            const proxyRes = await fetch(
                `${PROXY_URL}/scrape?portal=${scraper.portal}&url=${encodeURIComponent(scraper.url)}&maxPages=${scraper.maxPages}`,
                {
                    headers: { 'x-proxy-secret': PROXY_SECRET },
                    // 12 hour timeout, essentially infinite for scraping
                    signal: AbortSignal.timeout(12 * 60 * 60 * 1000),
                }
            );

            if (!proxyRes.ok) {
                console.error(`❌ [${scraper.name}] Proxy returned HTTP ${proxyRes.status}`);
                continue;
            }

            const data = await proxyRes.json();
            const listings = data?.listings || [];
            console.log(`✅ [${scraper.name}] Extracted ${listings.length} properties from proxy in ${Math.round((Date.now() - start) / 1000)}s`);

            // Save to database
            let saved = 0;
            let skipped = 0;
            for (const item of listings) {
                const sourceId = item.id || `${(item.source || scraper.name).toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                const source = item.source || scraper.name;

                try {
                    const imgArr = item.images || (item.imageUrl ? [item.imageUrl] : []);
                    await prisma.listing.upsert({
                        where: { unique_source_listing: { sourceId, source } },
                        update: {
                            price: item.price || undefined,
                            status: item.status || undefined,
                            lastVerifiedAt: new Date(),
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
            console.log(`💾 [${scraper.name}] Inserted/Updated: ${saved} | Errors: ${skipped}`);
            totalSaved += saved;
            totalSkipped += skipped;

        } catch (e: any) {
            console.error(`❌ [${scraper.name}] Fatal error during extraction:`, e.message);
        }
    }

    console.log(`\n======================================================`);
    console.log(`✅ ALL SCRAPING COMPLETE`);
    console.log(`✅ Total Saved/Updated: ${totalSaved}`);
    console.log(`✅ Total Skipped/Errors: ${totalSkipped}`);
    console.log(`======================================================\n`);

    console.log(`🌍 Starting Geocoding Sweep (FREE — Nominatim/OpenStreetMap)...`);
    let geocoded = 0;
    {
        let hasMore = true;
        let batchNo = 1;
        while (hasMore) {
            console.log(`   Fetching batch ${batchNo} of ungeocoded properties...`);
            const ungeocoded = await prisma.listing.findMany({
                where: {
                    OR: [{ mapUrl: null }, { mapUrl: '' }],
                    address: { not: null },
                    status: { not: 'EXPIRED' },
                },
                select: { id: true, address: true, city: true, state: true },
                take: 100,
            });

            if (ungeocoded.length === 0) {
                hasMore = false;
                break;
            }

            for (const listing of ungeocoded) {
                try {
                    const addr = [listing.address, listing.city, listing.state, 'Mexico'].filter(Boolean).join(', ');
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addr)}`,
                        { headers: { 'User-Agent': 'BlueJax-MLS/1.0 (edgar@bluejax.ai)' } }
                    );
                    const geoData = await geoRes.json();
                    if (geoData?.[0]?.lat && geoData?.[0]?.lon) {
                        const lat = parseFloat(geoData[0].lat);
                        const lng = parseFloat(geoData[0].lon);
                        await prisma.listing.update({
                            where: { id: listing.id },
                            data: { mapUrl: `${lat},${lng}` },
                        });
                        geocoded++;
                        process.stdout.write('📍');
                    } else {
                        process.stdout.write('x');
                    }
                    // Nominatim requires 1 request/second (usage policy)
                    await new Promise(r => setTimeout(r, 1100));
                } catch (e) {
                    process.stdout.write('!');
                }
            }
            console.log(`\n   Finished batch ${batchNo}. Geocoded ${geocoded} so far.`);
            batchNo++;
        }
    }

    console.log(`\n======================================================`);
    console.log(`🎉 DEEP SYNC PIPELINE FINISHED`);
    console.log(`🎉 Total Geocoded: ${geocoded}`);
    console.log(`======================================================`);
    process.exit(0);
}

main().catch(e => {
    console.error('Unhandled script error:', e);
    process.exit(1);
});
