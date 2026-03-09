/**
 * Lamudi scraper — calls the home proxy's Puppeteer-based scraper.
 * Uses the same ML_PROXY_URL + ML_PROXY_SECRET env vars.
 */

const ML_PROXY_URL = process.env.ML_PROXY_URL;
const ML_PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';

/**
 * Build Lamudi URL from filters.
 * Example: https://www.lamudi.com.mx/chihuahua/chihuahua-1/for-sale/
 */
function buildLamudiUrl(city: string, propertyType: string, listingType: string): string {
    const op = listingType.toUpperCase() === 'RENT' ? 'for-rent' : 'for-sale';
    const citySlug = (city || 'chihuahua').toLowerCase().replace(/\s+/g, '-');

    // Property type mapping (Lamudi paths)
    const typeMap: Record<string, string> = {
        'HOUSE': 'house',
        'APARTMENT': 'apartment',
        'LAND': 'land',
        'COMMERCIAL': 'commercial',
    };
    const typeStr = propertyType ? typeMap[propertyType.toUpperCase()] : '';

    // Lamudi urls get a bit wonky, e.g. /chihuahua/chihuahua-1/house/for-sale/
    const typePath = typeStr ? `${typeStr}/` : '';

    return `https://www.lamudi.com.mx/chihuahua/${citySlug}-1/${typePath}${op}/`;
}

/**
 * Scrape Lamudi via the home proxy's Puppeteer endpoint.
 */
export async function scrapeLamudi(
    city: string,
    propertyType: string,
    listingType: string,
    minPrice: string,
    maxPrice: string,
    limit: number = 12
): Promise<any[]> {
    if (!ML_PROXY_URL) {
        console.log('[Lamudi Scraper] No ML_PROXY_URL configured — skipping');
        return [];
    }

    const targetUrl = buildLamudiUrl(city, propertyType, listingType);
    const proxyUrl = `${ML_PROXY_URL.trim()}/scrape?portal=lamudi&url=${encodeURIComponent(targetUrl)}`;

    console.log(`[Lamudi Scraper] Scraping via proxy: ${targetUrl}`);

    try {
        const res = await fetch(proxyUrl, {
            headers: { 'x-proxy-secret': ML_PROXY_SECRET },
            signal: AbortSignal.timeout(45000), // Puppeteer needs time
        });

        if (!res.ok) {
            console.log(`[Lamudi Scraper] ⚠️ Proxy returned ${res.status}`);
            return [];
        }

        const data = await res.json();
        let listings = (data.listings || []) as any[];

        console.log(`[Lamudi Scraper] ✅ ${listings.length} raw listings in ${data.elapsed}ms`);

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
            images: l.images || [],
            source: 'Lamudi',
            sourceUrl: l.url,
            propertyType: l.propertyType || 'HOUSE',
            bedrooms: l.bedrooms || undefined,
            bathrooms: l.bathrooms || undefined,
            parking: l.parking || undefined,
            area: l.area || undefined,
            fetchedAt: new Date().toISOString(),
        }));
    } catch (e: any) {
        console.log(`[Lamudi Scraper] ⚠️ Failed: ${e.message}`);
        return [];
    }
}
