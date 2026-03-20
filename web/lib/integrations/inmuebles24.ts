/**
 * Inmuebles24 scraper — calls the home proxy's Puppeteer-based scraper.
 * Uses the same ML_PROXY_URL + ML_PROXY_SECRET env vars.
 */

const ML_PROXY_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3008' : (process.env.ML_PROXY_URL || 'http://localhost:3008');
const ML_PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';

/**
 * Build Inmuebles24 URL from filters.
 * Example: https://www.inmuebles24.com/inmuebles-en-venta-en-chihuahua.html
 */
function buildI24Url(city: string, propertyType: string, listingType: string): string {
    const op = listingType.toUpperCase() === 'RENT' ? 'renta' : 'venta';
    const citySlug = (city || 'chihuahua').toLowerCase().replace(/\s+/g, '-');

    // Property type mapping
    const typeMap: Record<string, string> = {
        'HOUSE': 'casas',
        'APARTMENT': 'departamentos',
        'LAND': 'terrenos',
        'COMMERCIAL': 'locales-comerciales',
    };
    const type = typeMap[propertyType?.toUpperCase()] || 'inmuebles';

    return `https://www.inmuebles24.com/${type}-en-${op}-en-${citySlug}.html`;
}

/**
 * Scrape Inmuebles24 via the home proxy's Puppeteer endpoint.
 */
export async function scrapeInmuebles24(
    city: string,
    propertyType: string,
    listingType: string,
    minPrice: string,
    maxPrice: string,
    limit: number = 12
): Promise<any[]> {
    if (!ML_PROXY_URL) {
        console.log('[I24 Scraper] No ML_PROXY_URL configured — skipping');
        return [];
    }

    const targetUrl = buildI24Url(city, propertyType, listingType);
    const proxyUrl = `${ML_PROXY_URL.trim()}/scrape?portal=inmuebles24&url=${encodeURIComponent(targetUrl)}`;

    console.log(`[I24 Scraper] Scraping via proxy: ${targetUrl}`);

    try {
        const res = await fetch(proxyUrl, {
            headers: { 'x-proxy-secret': ML_PROXY_SECRET },
            signal: AbortSignal.timeout(45000), // Puppeteer needs more time
        });

        if (!res.ok) {
            console.log(`[I24 Scraper] ⚠️ Proxy returned ${res.status}`);
            return [];
        }

        const data = await res.json();
        let listings = (data.listings || []) as any[];

        console.log(`[I24 Scraper] ✅ ${listings.length} raw listings in ${data.elapsed}ms`);

        // Apply price filters
        if (minPrice) listings = listings.filter(l => l.price >= parseFloat(minPrice));
        if (maxPrice) listings = listings.filter(l => l.price <= parseFloat(maxPrice));

        // Normalize to match the live route's listing schema
        return listings.slice(0, limit).map(l => ({
            id: l.id,
            title: l.title,
            price: l.price,
            currency: l.currency || 'MXN',
            address: l.location,
            city: city || 'Chihuahua',
            state: 'Chihuahua',
            status: l.listingType === 'RENT' ? 'DETECTED_RENT' : 'DETECTED_SALE',
            imageUrl: l.images?.[0] || '',
            source: 'Inmuebles24',
            sourceUrl: l.url,
            propertyType: l.propertyType || 'HOUSE',
            bedrooms: l.bedrooms || undefined,
            bathrooms: l.bathrooms || undefined,
            parking: l.parking || undefined,
            area: l.area || undefined,
            fetchedAt: new Date().toISOString(),
        }));
    } catch (e: any) {
        console.log(`[I24 Scraper] ⚠️ Failed: ${e.message}`);
        return [];
    }
}
