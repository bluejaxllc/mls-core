import axios from 'axios';
import { parse } from 'node-html-parser';

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;
const ML_PROXY_URL = process.env.ML_PROXY_URL;       // e.g. https://xxx.trycloudflare.com
const ML_PROXY_SECRET = process.env.ML_PROXY_SECRET || 'bluejax-ml-proxy-2026';

export async function scrapeMLViaZenRows(city: string, propertyType: string, listingType: string, minPrice: string, maxPrice: string, q: string, limit: number = 12, page: number = 1): Promise<any[]> {
    const op = listingType.toUpperCase() === 'RENT' ? 'renta' : 'venta';

    const typeMap: Record<string, string> = {
        'house': `casas/${op}`,
        'apartment': `departamentos/${op}`,
        'land': `terrenos/${op}`,
        'commercial': `locales-comerciales/${op}`,
        'industrial': `bodegas/${op}`,
    };

    let path = `inmuebles/${op}`;
    if (propertyType && typeMap[propertyType.toLowerCase()]) {
        path = typeMap[propertyType.toLowerCase()];
    }

    const formattedCity = (city || 'chihuahua').toLowerCase().replace(/\s+/g, '-');
    const state = 'chihuahua';
    let url = `https://inmuebles.mercadolibre.com.mx/${path}/${state}/${formattedCity}/`;

    if (q) {
        url = `https://inmuebles.mercadolibre.com.mx/${path}/${state}/${formattedCity}/${encodeURIComponent(q)}_`;
    }

    if (minPrice || maxPrice) {
        const minUrl = minPrice || '0';
        const maxUrl = maxPrice || '0';
        url += `_PriceRange_${minUrl}-${maxUrl}`;
    }

    // Handle pagination
    if (page > 1) {
        const offsetString = (page - 1) * limit + 1;
        url += `_Desde_${Math.max(1, offsetString)}`;
    }

    console.log(`[ML Scraper] Scraping ML URL: ${url}`);

    // ── Strategy A: Direct fetch (free, no proxy needed) ────────────────
    let html = '';
    try {
        console.log('[ML Scraper] Trying direct fetch...');
        const directRes = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5',
                'Accept-Encoding': 'identity',
            },
            signal: AbortSignal.timeout(15000),
        });

        if (directRes.ok) {
            html = await directRes.text();
            console.log(`[ML Scraper] ✅ Direct fetch OK — ${html.length} chars`);
        } else {
            console.log(`[ML Scraper] ⚠️ Direct fetch returned ${directRes.status}`);
        }
    } catch (e: any) {
        console.log(`[ML Scraper] ⚠️ Direct fetch failed: ${e.message}`);
    }

    // ── Strategy B: Home proxy via Cloudflare Tunnel (free, residential IP) ─
    if (!html && ML_PROXY_URL) {
        try {
            const proxyUrl = `${ML_PROXY_URL}/?url=${encodeURIComponent(url)}`;
            console.log(`[ML Scraper] Trying home proxy: ${ML_PROXY_URL}`);
            const proxyRes = await fetch(proxyUrl, {
                headers: { 'x-proxy-secret': ML_PROXY_SECRET },
                signal: AbortSignal.timeout(20000),
            });
            if (proxyRes.ok) {
                html = await proxyRes.text();
                console.log(`[ML Scraper] ✅ Home proxy OK — ${html.length} chars`);
            } else {
                console.log(`[ML Scraper] ⚠️ Home proxy returned ${proxyRes.status}`);
            }
        } catch (e: any) {
            console.log(`[ML Scraper] ⚠️ Home proxy failed: ${e.message}`);
        }
    }

    // ── Strategy C: ZenRows proxy fallback (paid) ───────────────────────
    if (!html && ZENROWS_API_KEY) {
        try {
            console.log('[ML Scraper] Falling back to ZenRows proxy...');
            const response = await axios({
                method: 'GET',
                url: 'https://api.zenrows.com/v1/',
                params: {
                    url: url,
                    apikey: ZENROWS_API_KEY,
                    premium_proxy: 'true',
                    js_render: 'true'
                },
                timeout: 25000
            });
            html = response.data;
            console.log(`[ML Scraper] ✅ ZenRows OK — ${html.length} chars`);
        } catch (error: any) {
            console.error('[ML Scraper] ⚠️ ZenRows also failed:', error?.response?.status || error.message);
        }
    }

    if (!html) {
        console.log('[ML Scraper] ❌ No HTML obtained from any source.');
        return [];
    }

    // ── Parse HTML ──────────────────────────────────────────────────────
    let listings: any[] = [];

    // Parse strategy 1: NORDIC JSON
    listings = parseNordicResults(html, city, propertyType, listingType, limit);

    // Parse strategy 2: DOM fallback
    if (listings.length === 0) {
        console.log('[ML Scraper] JSON extraction found 0 items, trying DOM fallback...');
        listings = parseDOMFallback(html, city, propertyType, listingType, url, limit);
    }

    if (listings.length === 0) {
        console.log(`[ML Scraper] ⚠️ 0 listings extracted. HTML Length: ${html.length}. Peek: ${html.substring(0, 200)}...`);
    }

    console.log(`[ML Scraper] ✅ Extracted ${listings.length} ML listings.`);
    return listings;
}

/**
 * Extract POLYCARD results from the __NORDIC_RENDERING_CTX__ script.
 *
 * The script uses JavaScript syntax (new Map, new Set) so JSON.parse on the
 * entire object fails. Instead we locate the "results" array via string search
 * and bracket-match to extract just the JSON array.
 */
function parseNordicResults(html: string, city: string, propertyType: string, listingType: string, maxItems: number): any[] {
    const listings: any[] = [];

    try {
        // Find POLYCARD results array inside the NORDIC script
        const resultsMarker = '"results":[{"id":"POLYCARD"';
        const markerIdx = html.indexOf(resultsMarker);
        if (markerIdx === -1) {
            console.log('[ZenRows] No POLYCARD results marker in HTML.');
            return [];
        }

        // Jump to the `[` that starts the results array
        const arrStart = markerIdx + '"results":'.length;

        // Bracket-match to find the end of the results array
        let depth = 0;
        let arrEnd = -1;
        for (let i = arrStart; i < html.length && i < arrStart + 600000; i++) {
            if (html[i] === '[') depth++;
            if (html[i] === ']') {
                depth--;
                if (depth === 0) { arrEnd = i + 1; break; }
            }
        }

        if (arrEnd === -1) {
            console.log('[ZenRows] Could not bracket-match results array end.');
            return [];
        }

        const resultsJson = html.substring(arrStart, arrEnd);
        const results = JSON.parse(resultsJson);

        console.log(`[ZenRows] Found ${results.length} POLYCARD results in NORDIC JSON.`);

        for (const result of results) {
            if (listings.length >= maxItems) break;

            const polycard = result?.polycard;
            if (!polycard) continue;

            const metadata = polycard.metadata || {};
            const components = polycard.components || [];

            // Extract title
            const titleComp = components.find((c: any) => c.type === 'title');
            const title = titleComp?.title?.text || '';

            // Extract price
            const priceComp = components.find((c: any) => c.type === 'price');
            const priceNum = priceComp?.price?.current_price?.value || 0;
            const currency = priceComp?.price?.current_price?.currency || 'MXN';

            // Extract location
            const locComp = components.find((c: any) => c.type === 'location');
            const address = locComp?.location?.text || city;

            // Extract attributes (rooms, bathrooms, area)
            const attrsComp = components.find((c: any) => c.type === 'attributes_list');
            const attrs: string[] = attrsComp?.attributes_list?.texts || [];

            // Extract images — construct full URLs from picture IDs
            const pictures = polycard.pictures?.pictures || [];
            const images = pictures.map((pic: any) => {
                const id = pic.id || '';
                return `https://http2.mlstatic.com/D_NQ_NP_${id}-O.webp`;
            });
            const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/600x400?text=No+Image';

            // Build source URL
            const rawUrl = metadata.url || '';
            const sourceUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

            // ML Item ID
            const mlId = metadata.id || `ML-${Math.random().toString(36).substring(7)}`;

            if (title && priceNum > 0) {
                listings.push({
                    id: mlId,
                    title: title,
                    price: priceNum,
                    currency: currency,
                    address: address,
                    city: city,
                    state: 'Chihuahua',
                    status: listingType.toUpperCase() === 'RENT' ? 'DETECTED_RENT' : 'DETECTED_SALE',
                    imageUrl: imageUrl,
                    images: images.length > 0 ? images : [imageUrl],
                    source: 'Mercado Libre',
                    sourceUrl: sourceUrl,
                    attributes: attrs,
                    propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                    fetchedAt: new Date().toISOString()
                });
            }
        }
    } catch (e: any) {
        console.log(`[ZenRows] NORDIC JSON parsing error: ${e.message}`);
    }

    return listings;
}

/**
 * DOM-based fallback parser in case ML removes the NORDIC JSON again.
 */
function parseDOMFallback(html: string, city: string, propertyType: string, listingType: string, url: string, maxItems: number): any[] {
    const listings: any[] = [];

    try {
        const root = parse(html);

        let items = root.querySelectorAll('.ui-search-layout__item');
        if (items.length === 0) items = root.querySelectorAll('[class*="poly-card"]');
        if (items.length === 0) items = root.querySelectorAll('.ui-search-result');

        console.log(`[ZenRows] DOM fallback found ${items.length} items.`);

        for (const item of items) {
            if (listings.length >= maxItems) break;

            const linkEl = item.querySelector('a[href*="mercadolibre"]') || item.querySelector('a');
            const link = linkEl ? linkEl.getAttribute('href') : url;

            const titleEl = item.querySelector('[class*="title"]') || item.querySelector('h2') || item.querySelector('h3');
            const title = titleEl ? titleEl.textContent.trim() : '';

            const priceEl = item.querySelector('.andes-money-amount__fraction') || item.querySelector('[class*="price"]');
            const priceNum = priceEl ? parseInt(priceEl.textContent.replace(/\D/g, ''), 10) : 0;

            const locEl = item.querySelector('[class*="location"]');
            const address = locEl ? locEl.textContent.trim() : city;

            const attrs: string[] = [];
            const attrEls = item.querySelectorAll('[class*="attributes"] li, [class*="attributes"] span');
            for (const attr of attrEls) {
                if (attr.textContent) attrs.push(attr.textContent.trim());
            }

            const imgEl = item.querySelector('img');
            let imageUrl = 'https://via.placeholder.com/600x400?text=No+Image';
            if (imgEl) {
                imageUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || imageUrl;
            }

            let mlId = `ML-${Math.random().toString(36).substring(7)}`;
            const idMatch = link?.match(/MLM-?\d+/);
            if (idMatch) mlId = idMatch[0].replace('-', '');

            if (title && priceNum > 0) {
                listings.push({
                    id: mlId,
                    title: title,
                    price: priceNum,
                    currency: 'MXN',
                    address: address,
                    city: city,
                    state: 'Chihuahua',
                    status: listingType.toUpperCase() === 'RENT' ? 'DETECTED_RENT' : 'DETECTED_SALE',
                    imageUrl: imageUrl,
                    images: [imageUrl],
                    source: 'Mercado Libre',
                    sourceUrl: link || '',
                    attributes: attrs,
                    propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                    fetchedAt: new Date().toISOString()
                });
            }
        }
    } catch (e: any) {
        console.log(`[ZenRows] DOM fallback error: ${e.message}`);
    }

    return listings;
}
