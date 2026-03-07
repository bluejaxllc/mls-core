/**
 * ML Scrape Proxy v2 — supports both direct fetch (ML) and Puppeteer (Inmuebles24, Lamudi, Vivanuncios).
 * Runs on your home machine behind a Cloudflare Tunnel.
 *
 * Usage:   node ml-proxy.mjs
 * Port:    3004 (registered in port registry)
 * Tunnel:  cloudflared tunnel --url http://localhost:3004
 */

import http from 'http';
import puppeteer from 'puppeteer';

const PORT = 3004;
const SECRET = process.env.PROXY_SECRET || 'bluejax-ml-proxy-2026';

// ── Shared Browser Pool ──────────────────────────────────────────────────
let browser = null;
async function getBrowser() {
    if (!browser || !browser.connected) {
        console.log('[Proxy] Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
        });
        console.log('[Proxy] Browser launched.');
    }
    return browser;
}

// ── Inmuebles24 Scraper ──────────────────────────────────────────────────
async function scrapeInmuebles24(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        console.log(`[Inmuebles24] Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for listing cards to appear in the DOM
        try {
            await page.waitForSelector('[data-posting-type], [class*="postingCard"]', { timeout: 10000 });
        } catch (_) {
            console.log('[Inmuebles24] ⚠️ Timed out waiting for posting cards');
        }

        // Debug: check what selectors match
        const debug = await page.evaluate(() => ({
            postingType: document.querySelectorAll('[data-posting-type]').length,
            postingTypeProp: document.querySelectorAll('[data-posting-type="PROPERTY"]').length,
            postingCard: document.querySelectorAll('[class*="postingCard"]').length,
            dataQa: document.querySelectorAll('[data-qa*="posting"]').length,
            dataId: document.querySelectorAll('[data-id]').length,
            title: document.title,
            bodyLen: document.body.innerHTML.length,
        }));
        console.log('[Inmuebles24] Debug selectors:', JSON.stringify(debug));

        const listings = await page.evaluate(() => {
            // Use broadest working selector
            const cards = document.querySelectorAll('[data-posting-type="PROPERTY"]');
            if (cards.length === 0) return [];
            return Array.from(cards).map(card => {
                const id = card.getAttribute('data-id') || '';
                const detailPath = card.getAttribute('data-to-posting') || '';
                const text = card.textContent || '';

                // Parse price — look for "MN X,XXX,XXX" pattern
                const priceMatch = text.match(/MN\s*([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

                // Parse area — "XXX m²"
                const areaMatch = text.match(/([\d,]+)\s*m[²2]\s*(?:lote|const|total)?/i);
                const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0;

                // Parse bedrooms — "X rec."
                const bedsMatch = text.match(/(\d+)\s*rec/i);
                const bedrooms = bedsMatch ? parseInt(bedsMatch[1]) : 0;

                // Parse bathrooms — "X baños"
                const bathsMatch = text.match(/(\d+)\s*ba[ñn]/i);
                const bathrooms = bathsMatch ? parseInt(bathsMatch[1]) : 0;

                // Parse parking — "X estac."
                const parkingMatch = text.match(/(\d+)\s*estac/i);
                const parking = parkingMatch ? parseInt(parkingMatch[1]) : 0;

                // Get title from link or image alt
                const link = card.querySelector('a[data-qa="posting PROPERTY"]') || card.querySelector('a');
                const titleFromAlt = card.querySelector('img')?.alt || '';
                const titleFromLink = link?.textContent?.trim().substring(0, 200) || '';
                let title = titleFromAlt.split('·').pop()?.trim() || titleFromLink.substring(0, 120) || 'Propiedad en Inmuebles24';

                // Get location
                const locationEl = card.querySelector('[data-qa="POSTING_CARD_LOCATION"]');
                let location = locationEl?.textContent?.trim() || '';
                if (!location) {
                    // Fallback: try to find "Chihuahua" in text
                    const locMatch = text.match(/(?:Fraccionamiento|Col\.|Colonia|Zona)\s+([^,]+),?\s*Chihuahua/i);
                    location = locMatch ? `${locMatch[1]}, Chihuahua` : 'Chihuahua';
                }

                // Get images
                const images = Array.from(card.querySelectorAll('img'))
                    .map(img => img.src)
                    .filter(src => src && src.includes('naventcdn.com') && !src.includes('logo'));

                // Get property type from alt text or URL
                let propertyType = 'HOUSE';
                const altLower = titleFromAlt.toLowerCase();
                if (altLower.includes('departamento')) propertyType = 'APARTMENT';
                else if (altLower.includes('terreno') || altLower.includes('lote')) propertyType = 'LAND';
                else if (altLower.includes('local') || altLower.includes('oficina')) propertyType = 'COMMERCIAL';
                else if (altLower.includes('bodega')) propertyType = 'INDUSTRIAL';

                // Listing type from URL
                const listingType = detailPath.includes('renta') ? 'RENT' : 'SALE';

                return {
                    id: `i24-${id}`,
                    title: title.substring(0, 150),
                    price,
                    currency: 'MXN',
                    area,
                    bedrooms,
                    bathrooms,
                    parking,
                    location,
                    images,
                    url: detailPath ? `https://www.inmuebles24.com${detailPath}` : '',
                    source: 'Inmuebles24',
                    propertyType,
                    listingType,
                };
            });
        });

        console.log(`[Inmuebles24] Extracted ${listings.length} listings from ${url}`);
        return listings;
    } finally {
        await page.close();
    }
}

// ── Lamudi Scraper ───────────────────────────────────────────────────────
async function scrapeLamudi(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const listings = await page.evaluate(() => {
            // Lamudi uses Next.js — try __NEXT_DATA__ first
            const nextData = document.getElementById('__NEXT_DATA__');
            if (nextData) {
                try {
                    const data = JSON.parse(nextData.textContent || '{}');
                    const results = data?.props?.pageProps?.listingSearchResult?.listings || [];
                    return results.map((item, i) => ({
                        id: `lamudi-${item.id || i}`,
                        title: item.title || '',
                        price: item.price?.value || 0,
                        currency: item.price?.currency || 'MXN',
                        area: item.attributes?.find(a => a.key === 'surface_total')?.value || 0,
                        bedrooms: item.attributes?.find(a => a.key === 'bedrooms')?.value || 0,
                        bathrooms: item.attributes?.find(a => a.key === 'bathrooms')?.value || 0,
                        parking: item.attributes?.find(a => a.key === 'car_spaces')?.value || 0,
                        location: item.location?.name || '',
                        images: (item.images || []).map(img => img.url),
                        url: item.url ? `https://www.lamudi.com.mx${item.url}` : '',
                        source: 'Lamudi',
                        propertyType: 'HOUSE',
                        listingType: 'SALE',
                    }));
                } catch (e) { /* fall through to DOM parsing */ }
            }

            // Fallback: DOM parsing
            const cards = document.querySelectorAll('[data-listing-id], .listing-card, .ListingCell');
            return Array.from(cards).map((card, i) => ({
                id: `lamudi-${card.getAttribute('data-listing-id') || i}`,
                title: card.querySelector('h2, .listing-title, [class*="title"]')?.textContent?.trim() || '',
                price: parseFloat((card.querySelector('[class*="price"]')?.textContent || '0').replace(/[^0-9.]/g, '')) || 0,
                currency: 'MXN',
                area: 0,
                bedrooms: 0,
                bathrooms: 0,
                parking: 0,
                location: card.querySelector('[class*="location"]')?.textContent?.trim() || '',
                images: Array.from(card.querySelectorAll('img')).map(img => img.src).filter(Boolean),
                url: card.querySelector('a')?.href || '',
                source: 'Lamudi',
                propertyType: 'HOUSE',
                listingType: 'SALE',
            }));
        });

        console.log(`[Lamudi] Extracted ${listings.length} listings`);
        return listings;
    } finally {
        await page.close();
    }
}

// ── Vivanuncios Scraper ──────────────────────────────────────────────────
async function scrapeVivanuncios(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const listings = await page.evaluate(() => {
            const cards = document.querySelectorAll('[data-aut-id="itemBox"], .item-card, [class*="AdCard"]');
            return Array.from(cards).map((card, i) => {
                const title = card.querySelector('[data-aut-id="itemTitle"], h2, [class*="title"]')?.textContent?.trim() || '';
                const priceText = card.querySelector('[data-aut-id="itemPrice"], [class*="price"]')?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                const location = card.querySelector('[data-aut-id="itemLocation"], [class*="location"]')?.textContent?.trim() || '';
                const image = card.querySelector('img')?.src || '';
                const link = card.querySelector('a')?.href || '';

                return {
                    id: `viva-${i}`,
                    title,
                    price,
                    currency: 'MXN',
                    area: 0,
                    bedrooms: 0,
                    bathrooms: 0,
                    parking: 0,
                    location,
                    images: image ? [image] : [],
                    url: link.startsWith('http') ? link : `https://www.vivanuncios.com.mx${link}`,
                    source: 'Vivanuncios',
                    propertyType: 'HOUSE',
                    listingType: 'SALE',
                };
            });
        });

        console.log(`[Vivanuncios] Extracted ${listings.length} listings`);
        return listings;
    } finally {
        await page.close();
    }
}

// ── HTTP Server ──────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-proxy-secret');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // Health check
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', ip: 'residential', browser: !!browser, timestamp: Date.now() }));
        return;
    }

    // Auth check
    if (req.headers['x-proxy-secret'] !== SECRET) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid proxy secret' }));
        return;
    }

    const params = new URL(req.url, `http://localhost:${PORT}`).searchParams;

    // ── Portal scraper endpoint (/scrape?portal=inmuebles24&url=...) ──
    if (req.url.startsWith('/scrape')) {
        const portal = params.get('portal');
        const targetUrl = params.get('url');

        if (!portal || !targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing portal or url param' }));
            return;
        }

        console.log(`[Proxy] Scraping ${portal}: ${targetUrl}`);
        const start = Date.now();

        try {
            let listings = [];
            switch (portal) {
                case 'inmuebles24': listings = await scrapeInmuebles24(targetUrl); break;
                case 'lamudi': listings = await scrapeLamudi(targetUrl); break;
                case 'vivanuncios': listings = await scrapeVivanuncios(targetUrl); break;
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Unknown portal: ${portal}` }));
                    return;
            }

            const elapsed = Date.now() - start;
            console.log(`[Proxy] ✅ ${portal}: ${listings.length} listings in ${elapsed}ms`);

            res.writeHead(200, { 'Content-Type': 'application/json', 'X-Proxy-Time': `${elapsed}ms` });
            res.end(JSON.stringify({ listings, count: listings.length, portal, elapsed }));
        } catch (err) {
            console.error(`[Proxy] ❌ ${portal} failed:`, err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message, listings: [] }));
        }
        return;
    }

    // ── Direct fetch proxy (for ML) (/fetch?url=...) ──
    const targetUrl = params.get('url');
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing ?url= parameter' }));
        return;
    }

    console.log(`[Proxy] Fetching: ${targetUrl}`);
    const start = Date.now();

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5',
                'Accept-Encoding': 'identity',
            },
            signal: AbortSignal.timeout(15000),
        });

        const html = await response.text();
        const elapsed = Date.now() - start;
        console.log(`[Proxy] ✅ ${response.status} — ${html.length} chars in ${elapsed}ms`);

        res.writeHead(response.status, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Proxy-Time': `${elapsed}ms`,
        });
        res.end(html);
    } catch (err) {
        console.error(`[Proxy] ❌ Failed:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
});

server.listen(PORT, () => {
    console.log(`\n🏠 MLS Scrape Proxy v2 running on http://localhost:${PORT}`);
    console.log(`   Health:  GET /health`);
    console.log(`   ML:      GET /?url=<ml_url>  (direct fetch)`);
    console.log(`   I24:     GET /scrape?portal=inmuebles24&url=<url>`);
    console.log(`   Lamudi:  GET /scrape?portal=lamudi&url=<url>`);
    console.log(`   Viva:    GET /scrape?portal=vivanuncios&url=<url>\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (browser) await browser.close();
    process.exit(0);
});
