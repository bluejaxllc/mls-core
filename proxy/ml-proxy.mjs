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
// ── ML (Mercado Libre) Scraper — uses Puppeteer and Regex extraction ──
async function scrapeML(url) {
    console.log(`[Proxy] ML Puppeteer: ${url}`);
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });

        // Optimizing resources
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const html = await page.content();

        const marker = '_n.ctx.r=';
        const startIdx = html.indexOf(marker);

        if (startIdx === -1) {
            console.log('[Proxy] ML: _n.ctx.r marker not found. Trying fallback...');
            return [];
        }

        const jsonStart = startIdx + marker.length;
        let openBraces = 0;
        let inString = false;
        let escape = false;
        let validJson = '';

        for (let i = jsonStart; i < html.length; i++) {
            const char = html[i];
            validJson += char;

            if (inString) {
                if (char === '\\') escape = !escape;
                else if (char === '"' && !escape) inString = false;
                else if (escape) escape = false;
            } else {
                if (char === '"') inString = true;
                else if (char === '{' || char === '[') openBraces++;
                else if (char === '}' || char === ']') openBraces--;

                if (openBraces === 0 && validJson.trim().length > 0) {
                    break;
                }
            }
        }

        const state = JSON.parse(validJson);
        const polycards = state.appProps?.pageProps?.initialState?.results || [];

        const listings = polycards.map(r => {
            const pc = r.polycard;
            if (!pc) return null;
            const comps = pc.components || [];
            const meta = pc.metadata || {};
            const titleC = comps.find(c => c.type === 'title');
            const priceC = comps.find(c => c.type === 'price');
            const locC = comps.find(c => c.type === 'location');
            const attrsC = comps.find(c => c.type === 'attributes_list');
            const pics = pc.pictures?.pictures || [];
            const images = pics.map(p => `https://http2.mlstatic.com/D_NQ_NP_${p.id || ''}-O.webp`);
            const price = priceC?.price?.current_price?.value || 0;
            const title = titleC?.title?.text || '';
            if (!title || price <= 0) return null;
            const rawUrl = meta.url || '';
            return {
                id: meta.id || `ML-${Math.random().toString(36).substring(7)}`,
                title, price,
                currency: priceC?.price?.current_price?.currency || 'MXN',
                location: locC?.location?.text || '',
                url: rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`,
                images,
                imageUrl: images[0] || '',
                attributes: attrsC?.attributes_list?.texts || [],
                source: 'Mercado Libre',
            };
        }).filter(Boolean);

        console.log(`[Proxy] ML: ${listings.length} results extracted`);
        return listings;
    } catch (err) {
        console.error(`[Proxy] ML Puppeteer Error:`, err.message);
        return [];
    } finally {
        await page.close();
    }
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
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        console.log(`[Lamudi] Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for listing cards
        try {
            await page.waitForSelector('.snippet[data-idanuncio], [data-test="serp-project"]', { timeout: 10000 });
        } catch (_) {
            console.log('[Lamudi] ⚠️ Timed out waiting for snippets');
        }

        const debug = await page.evaluate(() => ({
            snippets: document.querySelectorAll('.snippet[data-idanuncio]').length,
            serpProject: document.querySelectorAll('[data-test="serp-project"]').length,
            listings: document.querySelectorAll('[class*="listing"]').length,
            title: document.title,
        }));
        console.log('[Lamudi] Debug:', JSON.stringify(debug));

        const listings = await page.evaluate((targetUrl) => {
            // Lamudi uses .snippet divs with data-idanuncio attributes
            const cards = document.querySelectorAll('.snippet[data-idanuncio]');
            return Array.from(cards).map((card, i) => {
                const id = card.getAttribute('data-idanuncio') || `${i}`;

                // Get title from the main link
                const titleEl = card.querySelector('[class*="snippet__title"], h2, a[class*="info"] span');
                const title = titleEl?.textContent?.trim() || '';

                // Get price
                const priceEl = card.querySelector('[class*="price"], [data-test*="price"]');
                const priceText = priceEl?.textContent || '';
                const priceMatch = priceText.match(/([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

                // Get location
                const locationEl = card.querySelector('[class*="location"], [class*="address"]');
                const location = locationEl?.textContent?.trim() || '';

                // Get attributes (bedrooms, bathrooms, area)
                const attrText = card.textContent || '';
                const bedsMatch = attrText.match(/(\d+)\s*(?:rec|hab)/i);
                const bathsMatch = attrText.match(/(\d+)\s*ba.o/i);
                const areaMatch = attrText.match(/([\d,]+)\s*m/i);

                // Get images
                const images = Array.from(card.querySelectorAll('img'))
                    .map(img => img.src || img.getAttribute('data-src') || '')
                    .filter(src => src && src.includes('lamudi'));

                // Get detail URL
                const link = card.querySelector('a[href*="lamudi"]');
                const detailUrl = link?.href || '';

                // Detect property type
                let propertyType = 'HOUSE';
                const textLower = (title + ' ' + attrText).toLowerCase();
                if (textLower.includes('departamento') || textLower.includes('apartment')) propertyType = 'APARTMENT';
                else if (textLower.includes('terreno') || textLower.includes('lote')) propertyType = 'LAND';
                else if (textLower.includes('local') || textLower.includes('oficina')) propertyType = 'COMMERCIAL';

                return {
                    id: `lamudi-${id}`,
                    title: title.substring(0, 150) || 'Propiedad en Lamudi',
                    price,
                    currency: 'MXN',
                    area: areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0,
                    bedrooms: bedsMatch ? parseInt(bedsMatch[1]) : 0,
                    bathrooms: bathsMatch ? parseInt(bathsMatch[1]) : 0,
                    parking: 0,
                    location,
                    images,
                    url: detailUrl,
                    source: 'Lamudi',
                    propertyType,
                    listingType: targetUrl.includes('for-rent') ? 'RENT' : 'SALE',
                };
            });
        }, url);

        console.log(`[Lamudi] Extracted ${listings.length} listings`);
        return listings;
    } finally {
        await page.close();
    }
}

// ── Vivanuncios Scraper ──────────────────────────────────────────────────
// Vivanuncios uses the same navent platform as Inmuebles24
async function scrapeVivanuncios(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        console.log(`[Vivanuncios] Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for posting cards (same navent platform as Inmuebles24)
        try {
            await page.waitForSelector('[class*="postingCardLayout"], [data-posting-type]', { timeout: 10000 });
        } catch (_) {
            console.log('[Vivanuncios] ⚠️ Timed out waiting for posting cards');
        }

        const debug = await page.evaluate(() => ({
            postingCard: document.querySelectorAll('[class*="postingCardLayout"]').length,
            postingType: document.querySelectorAll('[data-posting-type]').length,
            dataId: document.querySelectorAll('[data-id]').length,
            title: document.title,
            bodyLen: document.body.innerHTML.length,
        }));
        console.log('[Vivanuncios] Debug:', JSON.stringify(debug));

        const listings = await page.evaluate(() => {
            // Vivanuncios navent cards — same structure as Inmuebles24
            const cards = document.querySelectorAll('[data-posting-type="PROPERTY"], [class*="postingCardLayout-module__posting-card-layout"]');
            if (cards.length === 0) return [];

            return Array.from(cards).map((card, i) => {
                const id = card.getAttribute('data-id') || `${i}`;
                const detailPath = card.getAttribute('data-to-posting') || '';
                const text = card.textContent || '';

                // Parse price
                const priceMatch = text.match(/MN\s*([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

                // Parse area
                const areaMatch = text.match(/([\d,]+)\s*m[²2]/i);
                const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0;

                // Parse bedrooms
                const bedsMatch = text.match(/(\d+)\s*rec/i);
                const bedrooms = bedsMatch ? parseInt(bedsMatch[1]) : 0;

                // Parse bathrooms
                const bathsMatch = text.match(/(\d+)\s*ba[ñn]/i);
                const bathrooms = bathsMatch ? parseInt(bathsMatch[1]) : 0;

                // Parse parking
                const parkingMatch = text.match(/(\d+)\s*estac/i);
                const parking = parkingMatch ? parseInt(parkingMatch[1]) : 0;

                // Get title
                const titleFromAlt = card.querySelector('img')?.alt || '';
                const link = card.querySelector('a');
                const title = titleFromAlt.split('·').pop()?.trim() || link?.textContent?.trim().substring(0, 120) || 'Propiedad en Vivanuncios';

                // Get location
                const locationEl = card.querySelector('[data-qa="POSTING_CARD_LOCATION"]');
                const location = locationEl?.textContent?.trim() || '';

                // Get images
                const images = Array.from(card.querySelectorAll('img'))
                    .map(img => img.src)
                    .filter(src => src && (src.includes('naventcdn.com') || src.includes('vivanuncios')) && !src.includes('logo'));

                // Detect property type
                let propertyType = 'HOUSE';
                const altLower = titleFromAlt.toLowerCase();
                if (altLower.includes('departamento')) propertyType = 'APARTMENT';
                else if (altLower.includes('terreno') || altLower.includes('lote')) propertyType = 'LAND';
                else if (altLower.includes('local') || altLower.includes('oficina')) propertyType = 'COMMERCIAL';

                const listingType = detailPath.includes('renta') ? 'RENT' : 'SALE';

                return {
                    id: `viva-${id}`,
                    title: title.substring(0, 150),
                    price,
                    currency: 'MXN',
                    area,
                    bedrooms,
                    bathrooms,
                    parking,
                    location,
                    images,
                    url: detailPath ? `https://www.vivanuncios.com.mx${detailPath}` : '',
                    source: 'Vivanuncios',
                    propertyType,
                    listingType,
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
                case 'ml': listings = await scrapeML(targetUrl); break;
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

server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n🏠 MLS Scrape Proxy v2 running on http://127.0.0.1:${PORT}`);
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
