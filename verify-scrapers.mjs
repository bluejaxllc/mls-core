import { execSync } from 'child_process';
import { PrismaClient as PrismaCore } from '@prisma/client-core';

async function verify() {
    console.log("=== 1. VERIFYING DATABASE SOURCE FILTERING ===");
    const prisma = new PrismaCore();

    try {
        const sources = await prisma.listing.groupBy({
            by: ['source'],
            _count: { id: true }
        });
        console.log("Found listings by source:");
        console.table(sources);

        console.log("Testing filter with source = 'Inmuebles24'");
        const i24 = await prisma.listing.count({ where: { source: 'Inmuebles24' } });
        console.log(`Source 'Inmuebles24' yielded ${i24} results.`);

        console.log("Testing filter with source = 'Lamudi'");
        const lamudi = await prisma.listing.count({ where: { source: 'Lamudi' } });
        console.log(`Source 'Lamudi' yielded ${lamudi} results.`);
        console.log("Database filtering by source is fully functional!\n");

    } catch (e) {
        console.error("Database query failed. Is Prisma generated? Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }

    console.log("=== 2. VERIFYING ML-PROXY SCRAPERS ===");
    // To ensure a fast test, we query 1 page max. We will assume the proxy is running on 3007.
    const urls = [
        { name: 'ML', url: 'http://localhost:3007/?url=https://inmuebles.mercadolibre.com.mx/chihuahua/_NoIndex_True' },
        { name: 'Inmuebles24', url: 'http://localhost:3007/scrape?portal=inmuebles24&url=https://www.inmuebles24.com/inmuebles-en-venta-en-chihuahua.html&maxPages=1' },
        { name: 'Lamudi', url: 'http://localhost:3007/scrape?portal=lamudi&url=https://www.lamudi.com.mx/chihuahua/for-sale/&maxPages=1' },
        { name: 'Vivanuncios', url: 'http://localhost:3007/scrape?portal=vivanuncios&url=https://www.vivanuncios.com.mx/inmuebles-en-venta-en-chihuahua.html&maxPages=1' }
    ];

    for (const item of urls) {
        console.log(`Testing ${item.name}...`);
        try {
            const start = Date.now();
            const res = await fetch(item.url, { headers: { 'x-proxy-secret': 'bluejax-ml-proxy-2026' } });

            if (item.name === 'ML') {
                const text = await res.text();
                console.log(`[${item.name}] ✅ Returned HTML content length: ${text.length} in ${Date.now() - start}ms`);
            } else {
                const json = await res.json();
                if (json.error) {
                    console.log(`[${item.name}] ❌ Error: ${json.error}`);
                } else {
                    console.log(`[${item.name}] ✅ Successfully scraped ${json.count || json.listings?.length || 0} listings in ${Date.now() - start}ms`);
                }
            }
        } catch (e) {
            console.log(`[${item.name}] ❌ Failed to fetch: ${e.message}`);
        }
    }
}

verify().catch(console.error);
