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
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { fileURLToPath } from 'url';
puppeteerExtra.use(StealthPlugin());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PROXY_PORT || 3007;
const SECRET = process.env.PROXY_SECRET || 'bluejax-ml-proxy-2026';

// ── Shared Browser Pool ──────────────────────────────────────────────────
let browser = null;
async function getBrowser() {
    if (!browser || !browser.connected) {
        console.log('[Proxy] Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage'],
        });
        console.log('[Proxy] Browser launched.');
    }
    return browser;
}
// ── ML (Mercado Libre) Scraper — uses Puppeteer and Regex extraction ──
async function scrapeMLSinglePage(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) req.abort();
            else req.continue();
        });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const html = await page.content();
        const marker = '_n.ctx.r=';
        const startIdx = html.indexOf(marker);
        if (startIdx === -1) return [];
        const jsonStart = startIdx + marker.length;
        let openBraces = 0, inString = false, escape = false, validJson = '';
        for (let i = jsonStart; i < html.length; i++) {
            const char = html[i]; validJson += char;
            if (inString) { if (char === '\\') escape = !escape; else if (char === '"' && !escape) inString = false; else if (escape) escape = false; }
            else { if (char === '"') inString = true; else if (char === '{' || char === '[') openBraces++; else if (char === '}' || char === ']') openBraces--; if (openBraces === 0 && validJson.trim().length > 0) break; }
        }
        const state = JSON.parse(validJson);
        const polycards = state.appProps?.pageProps?.initialState?.results || [];
        return polycards.map(r => {
            const pc = r.polycard; if (!pc) return null;
            const comps = pc.components || [], meta = pc.metadata || {};
            const titleC = comps.find(c => c.type === 'title'), priceC = comps.find(c => c.type === 'price');
            const locC = comps.find(c => c.type === 'location'), attrsC = comps.find(c => c.type === 'attributes_list');
            const pics = pc.pictures?.pictures || [];
            const images = pics.map(p => `https://http2.mlstatic.com/D_NQ_NP_${p.id || ''}-O.webp`);
            const price = priceC?.price?.current_price?.value || 0, title = titleC?.title?.text || '';
            if (!title || price <= 0) return null;
            const rawUrl = meta.url || '';
            return { id: meta.id || `ML-${Math.random().toString(36).substring(7)}`, title, price, currency: priceC?.price?.current_price?.currency || 'MXN', location: locC?.location?.text || '', url: rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`, images, imageUrl: images[0] || '', attributes: attrsC?.attributes_list?.texts || [], source: 'Mercado Libre' };
        }).filter(Boolean);
    } catch (err) { console.error(`[Proxy] ML Error:`, err.message); return []; }
    finally { await page.close(); }
}

async function scrapeML(url, maxPages = 5) {
    const allListings = new Map();
    for (let p = 0; p < maxPages; p++) {
        const offset = p * 48 + 1; // ML uses 48 items per page
        const pageUrl = p === 0 ? url : url.replace(/\/?$/, `_Desde_${offset}_NoIndex_True`);
        console.log(`[ML] Page ${p + 1}/${maxPages}: ${pageUrl}`);
        const listings = await scrapeMLSinglePage(pageUrl);
        if (listings.length === 0) { console.log(`[ML] Page ${p + 1} returned 0 results, stopping.`); break; }
        for (const l of listings) allListings.set(l.id, l);
        console.log(`[ML] Page ${p + 1}: ${listings.length} new, ${allListings.size} total`);
        if (p < maxPages - 1) await new Promise(r => setTimeout(r, 1500)); // Rate limit
    }
    console.log(`[ML] ✅ Total: ${allListings.size} unique listings from ${maxPages} max pages`);
    return Array.from(allListings.values());
}

// ── Inmuebles24 Scraper ──────────────────────────────────────────────────
async function scrapeInmuebles24SinglePage(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        try { await page.waitForSelector('[data-posting-type], [class*="postingCard"]', { timeout: 10000 }); } catch (_) { }
        const listings = await page.evaluate(() => {
            const cards = document.querySelectorAll('[data-posting-type="PROPERTY"]');
            if (cards.length === 0) return [];
            return Array.from(cards).map(card => {
                const id = card.getAttribute('data-id') || '';
                const detailPath = card.getAttribute('data-to-posting') || '';
                const text = card.textContent || '';
                const priceMatch = text.match(/MN\s*([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
                const areaMatch = text.match(/([\d,]+)\s*m[²2]\s*(?:lote|const|total)?/i);
                const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0;
                const bedsMatch = text.match(/(\d+)\s*rec/i);
                const bathsMatch = text.match(/(\d+)\s*ba[ñn]/i);
                const parkingMatch = text.match(/(\d+)\s*estac/i);
                const link = card.querySelector('a[data-qa="posting PROPERTY"]') || card.querySelector('a');
                const titleFromAlt = card.querySelector('img')?.alt || '';
                const titleFromLink = link?.textContent?.trim().substring(0, 200) || '';
                let title = titleFromAlt.split('·').pop()?.trim() || titleFromLink.substring(0, 120) || 'Propiedad en Inmuebles24';
                const locationEl = card.querySelector('[data-qa="POSTING_CARD_LOCATION"]');
                let location = locationEl?.textContent?.trim() || '';
                if (!location) { const locMatch = text.match(/(?:Fraccionamiento|Col\.|Colonia|Zona)\s+([^,]+),?\s*Chihuahua/i); location = locMatch ? `${locMatch[1]}, Chihuahua` : 'Chihuahua'; }
                const images = Array.from(card.querySelectorAll('img')).map(img => img.src).filter(src => src && src.includes('naventcdn.com') && !src.includes('logo'));
                let propertyType = 'HOUSE'; const altLower = titleFromAlt.toLowerCase();
                if (altLower.includes('departamento')) propertyType = 'APARTMENT';
                else if (altLower.includes('terreno') || altLower.includes('lote')) propertyType = 'LAND';
                else if (altLower.includes('local') || altLower.includes('oficina')) propertyType = 'COMMERCIAL';
                else if (altLower.includes('bodega')) propertyType = 'INDUSTRIAL';
                const listingType = detailPath.includes('renta') ? 'RENT' : 'SALE';
                return { id: `i24-${id}`, title: title.substring(0, 150), price, currency: 'MXN', area, bedrooms: bedsMatch ? parseInt(bedsMatch[1]) : 0, bathrooms: bathsMatch ? parseInt(bathsMatch[1]) : 0, parking: parkingMatch ? parseInt(parkingMatch[1]) : 0, location, images, url: detailPath ? `https://www.inmuebles24.com${detailPath}` : '', source: 'Inmuebles24', propertyType, listingType };
            });
        });
        console.log(`[Inmuebles24] Page: ${listings.length} listings from ${url}`);
        return listings;
    } finally { await page.close(); }
}

async function scrapeInmuebles24(url, maxPages = 5) {
    const allListings = new Map();
    for (let p = 1; p <= maxPages; p++) {
        const pageUrl = p === 1 ? url : url.replace(/\.html$/, `-pagina-${p}.html`);
        console.log(`[Inmuebles24] Page ${p}/${maxPages}: ${pageUrl}`);
        const listings = await scrapeInmuebles24SinglePage(pageUrl);
        if (listings.length === 0) { console.log(`[Inmuebles24] Page ${p} returned 0, stopping.`); break; }
        for (const l of listings) allListings.set(l.id, l);
        console.log(`[Inmuebles24] Running total: ${allListings.size} unique`);
        if (p < maxPages) await new Promise(r => setTimeout(r, 2000));
    }
    console.log(`[Inmuebles24] ✅ Total: ${allListings.size} unique listings`);
    return Array.from(allListings.values());
}

// ── Lamudi Scraper ───────────────────────────────────────────────────────
async function scrapeLamudiSinglePage(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        try { await page.waitForSelector('.snippet[data-idanuncio], [data-test="serp-project"]', { timeout: 10000 }); } catch (_) { }
        const listings = await page.evaluate((targetUrl) => {
            const cards = document.querySelectorAll('.snippet[data-idanuncio]');
            return Array.from(cards).map((card, i) => {
                const id = card.getAttribute('data-idanuncio') || `${i}`;
                const titleEl = card.querySelector('[class*="snippet__title"], h2, a[class*="info"] span');
                const title = titleEl?.textContent?.trim() || '';
                const priceEl = card.querySelector('[class*="price"], [data-test*="price"]');
                const priceText = priceEl?.textContent || '';
                const priceMatch = priceText.match(/([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
                const locationEl = card.querySelector('[class*="location"], [class*="address"]');
                const location = locationEl?.textContent?.trim() || '';
                const attrText = card.textContent || '';
                const bedsMatch = attrText.match(/(\d+)\s*(?:rec|hab)/i);
                const bathsMatch = attrText.match(/(\d+)\s*ba.o/i);
                const areaMatch = attrText.match(/([\d,]+)\s*m/i);
                const images = Array.from(card.querySelectorAll('img')).map(img => img.src || img.getAttribute('data-src') || '').filter(src => src && src.includes('lamudi'));
                const link = card.querySelector('a[href*="lamudi"]');
                const detailUrl = link?.href || '';
                let propertyType = 'HOUSE'; const textLower = (title + ' ' + attrText).toLowerCase();
                if (textLower.includes('departamento') || textLower.includes('apartment')) propertyType = 'APARTMENT';
                else if (textLower.includes('terreno') || textLower.includes('lote')) propertyType = 'LAND';
                else if (textLower.includes('local') || textLower.includes('oficina')) propertyType = 'COMMERCIAL';
                return { id: `lamudi-${id}`, title: title.substring(0, 150) || 'Propiedad en Lamudi', price, currency: 'MXN', area: areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0, bedrooms: bedsMatch ? parseInt(bedsMatch[1]) : 0, bathrooms: bathsMatch ? parseInt(bathsMatch[1]) : 0, parking: 0, location, images, url: detailUrl, source: 'Lamudi', propertyType, listingType: targetUrl.includes('for-rent') ? 'RENT' : 'SALE' };
            });
        }, url);
        console.log(`[Lamudi] Page: ${listings.length} listings from ${url}`);
        return listings;
    } finally { await page.close(); }
}

async function scrapeLamudi(url, maxPages = 5) {
    const allListings = new Map();
    for (let p = 1; p <= maxPages; p++) {
        const pageUrl = p === 1 ? url : `${url.replace(/\/$/, '')}?page=${p}`;
        console.log(`[Lamudi] Page ${p}/${maxPages}: ${pageUrl}`);
        const listings = await scrapeLamudiSinglePage(pageUrl);
        if (listings.length === 0) { console.log(`[Lamudi] Page ${p} returned 0, stopping.`); break; }
        for (const l of listings) allListings.set(l.id, l);
        console.log(`[Lamudi] Running total: ${allListings.size} unique`);
        if (p < maxPages) await new Promise(r => setTimeout(r, 2000));
    }
    console.log(`[Lamudi] ✅ Total: ${allListings.size} unique listings`);
    return Array.from(allListings.values());
}

// ── Vivanuncios Scraper ──────────────────────────────────────────────────
async function scrapeVivanunciosSinglePage(url) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        try { await page.waitForSelector('[class*="postingCardLayout"], [data-posting-type]', { timeout: 10000 }); } catch (_) { }
        const listings = await page.evaluate(() => {
            const cards = document.querySelectorAll('[data-posting-type="PROPERTY"], [class*="postingCardLayout-module__posting-card-layout"]');
            if (cards.length === 0) return [];
            return Array.from(cards).map((card, i) => {
                const id = card.getAttribute('data-id') || `${i}`;
                const detailPath = card.getAttribute('data-to-posting') || '';
                const text = card.textContent || '';
                const priceMatch = text.match(/MN\s*([\d,]+(?:\.\d+)?)/);
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
                const areaMatch = text.match(/([\d,]+)\s*m[²2]/i);
                const bedsMatch = text.match(/(\d+)\s*rec/i);
                const bathsMatch = text.match(/(\d+)\s*ba[ñn]/i);
                const parkingMatch = text.match(/(\d+)\s*estac/i);
                const titleFromAlt = card.querySelector('img')?.alt || '';
                const link = card.querySelector('a');
                const title = titleFromAlt.split('·').pop()?.trim() || link?.textContent?.trim().substring(0, 120) || 'Propiedad en Vivanuncios';
                const locationEl = card.querySelector('[data-qa="POSTING_CARD_LOCATION"]');
                const location = locationEl?.textContent?.trim() || '';
                const images = Array.from(card.querySelectorAll('img')).map(img => img.src).filter(src => src && (src.includes('naventcdn.com') || src.includes('vivanuncios')) && !src.includes('logo'));
                let propertyType = 'HOUSE'; const altLower = titleFromAlt.toLowerCase();
                if (altLower.includes('departamento')) propertyType = 'APARTMENT';
                else if (altLower.includes('terreno') || altLower.includes('lote')) propertyType = 'LAND';
                else if (altLower.includes('local') || altLower.includes('oficina')) propertyType = 'COMMERCIAL';
                const listingType = detailPath.includes('renta') ? 'RENT' : 'SALE';
                return { id: `viva-${id}`, title: title.substring(0, 150), price, currency: 'MXN', area: areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 0, bedrooms: bedsMatch ? parseInt(bedsMatch[1]) : 0, bathrooms: bathsMatch ? parseInt(bathsMatch[1]) : 0, parking: parkingMatch ? parseInt(parkingMatch[1]) : 0, location, images, url: detailPath ? `https://www.vivanuncios.com.mx${detailPath}` : '', source: 'Vivanuncios', propertyType, listingType };
            });
        });
        console.log(`[Vivanuncios] Page: ${listings.length} listings from ${url}`);
        return listings;
    } finally { await page.close(); }
}

async function scrapeVivanuncios(url, maxPages = 5) {
    const allListings = new Map();
    for (let p = 1; p <= maxPages; p++) {
        const pageUrl = p === 1 ? url : url.replace(/\.html$/, `-pagina-${p}.html`);
        console.log(`[Vivanuncios] Page ${p}/${maxPages}: ${pageUrl}`);
        const listings = await scrapeVivanunciosSinglePage(pageUrl);
        if (listings.length === 0) { console.log(`[Vivanuncios] Page ${p} returned 0, stopping.`); break; }
        for (const l of listings) allListings.set(l.id, l);
        console.log(`[Vivanuncios] Running total: ${allListings.size} unique`);
        if (p < maxPages) await new Promise(r => setTimeout(r, 2000));
    }
    console.log(`[Vivanuncios] ✅ Total: ${allListings.size} unique listings`);
    return Array.from(allListings.values());
}

// ── Facebook Marketplace Scraper via Puppeteer Stealth ──────────────────
const FB_PROFILE_DIR = path.join(__dirname, 'fb-profile');

let stealthBrowser = null;
async function getStealthBrowser() {
    if (!stealthBrowser || !stealthBrowser.connected) {
        console.log(`[Facebook] Launching stealth browser with profile: ${FB_PROFILE_DIR}`);
        stealthBrowser = await puppeteerExtra.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1920,1080',
                `--user-data-dir=${FB_PROFILE_DIR}`,
            ],
            ignoreDefaultArgs: ['--enable-automation'],
        });
        console.log('[Facebook] Stealth browser launched with dedicated profile.');
    }
    return stealthBrowser;
}

async function scrapeFacebook(url, limit = 100) {
    console.log(`[Facebook] Stealth Puppeteer scraping: ${url}`);
    const b = await getStealthBrowser();
    const page = await b.newPage();
    const collectedListings = new Map();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5' });
        await page.setViewport({ width: 1920, height: 1080 });

        // Intercept network responses to capture listing data from Facebook's internal API
        page.on('response', async (response) => {
            try {
                const resUrl = response.url();
                // Facebook uses /api/graphql/ for paginated marketplace data
                if (resUrl.includes('/api/graphql') || resUrl.includes('marketplace')) {
                    const ct = response.headers()['content-type'] || '';
                    if (!ct.includes('json') && !ct.includes('text')) return;
                    const text = await response.text().catch(() => '');
                    // Extract marketplace item IDs from the response body
                    const itemIdRegex = /marketplace\/item\/(\d{10,})/g;
                    let match;
                    while ((match = itemIdRegex.exec(text)) !== null) {
                        const id = match[1];
                        if (!collectedListings.has(id)) {
                            collectedListings.set(id, {
                                id,
                                title: 'Propiedad #' + id.slice(0, 6),
                                price: null,
                                address: '',
                                imageUrl: null,
                                url: 'https://www.facebook.com/marketplace/item/' + id,
                                source: 'Facebook Marketplace',
                            });
                        }
                    }
                    // Try to extract structured listing data (prices, titles, images)
                    try {
                        // Facebook GraphQL responses contain listing_title, listing_price, etc.
                        const priceRegex = /"formatted_amount"\s*:\s*"([^"]+)"/g;
                        const titleRegex = /"marketplace_listing_title"\s*:\s*"([^"]+)"/g;
                        const imageRegex = /"uri"\s*:\s*"(https:\/\/[^"]*?fbcdn[^"]*?)"/g;

                        let pm, tm, im;
                        const prices = []; const titles = []; const images = [];
                        while ((pm = priceRegex.exec(text)) !== null) prices.push(pm[1]);
                        while ((tm = titleRegex.exec(text)) !== null) titles.push(tm[1]);
                        while ((im = imageRegex.exec(text)) !== null) images.push(im[1]);

                        // Match extracted data to listings in order
                        let idx = 0;
                        for (const [id, listing] of collectedListings) {
                            if (!listing._enriched && idx < Math.max(prices.length, titles.length, images.length)) {
                                if (prices[idx]) listing.price = prices[idx];
                                if (titles[idx]) listing.title = titles[idx];
                                if (images[idx]) listing.imageUrl = images[idx];
                                listing._enriched = true;
                                idx++;
                            }
                        }
                    } catch { /* enrichment is best-effort */ }
                }
            } catch { /* ignore response read errors */ }
        });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));
        console.log(`[Facebook] After initial load: ${collectedListings.size} listings from network`);

        // Also scrape the DOM for whatever is visible
        const domScrape = async () => {
            return page.evaluate(() => {
                const results = [];
                document.querySelectorAll('a[href*="/marketplace/item/"]').forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const m = href.match(/\/marketplace\/item\/(\d+)/);
                    if (!m) return;
                    const id = m[1];
                    const c = link.closest('[class]') || link;
                    const spans = c.querySelectorAll('span');
                    const texts = [];
                    spans.forEach(s => { const t = s.textContent?.trim(); if (t && t.length > 0 && t.length < 300) texts.push(t); });
                    const price = texts.find(t => t.includes('$')) || null;
                    const title = texts.find(t => t.length > 8 && !t.includes('$')) || 'Propiedad #' + id.slice(0, 6);
                    const loc = texts.find(t => (t.includes(',') || t.length > 3) && !t.includes('$') && t !== title) || null;
                    // Comprehensive image extraction for Facebook's lazy-loaded images
                    let imgUrl = null;
                    // Check all img elements in the card
                    const imgs = c.querySelectorAll('img');
                    for (const img of imgs) {
                        // Try src first
                        if (img.src && !img.src.startsWith('data:') && !img.src.includes('.svg') && img.src.startsWith('http')) {
                            imgUrl = img.src; break;
                        }
                        // Try srcset (Facebook often uses this)
                        const srcset = img.getAttribute('srcset');
                        if (srcset) {
                            const firstSrc = srcset.split(',')[0].trim().split(' ')[0];
                            if (firstSrc && firstSrc.startsWith('http')) { imgUrl = firstSrc; break; }
                        }
                        // Try data-src
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc && dataSrc.startsWith('http')) { imgUrl = dataSrc; break; }
                    }
                    // Fallback: check CSS background-image on card elements
                    if (!imgUrl) {
                        const bgEls = c.querySelectorAll('[style*="background"]');
                        for (const el of bgEls) {
                            const bgMatch = el.style.backgroundImage?.match(/url\(["']?(https:\/\/[^"')]+)["']?\)/);
                            if (bgMatch) { imgUrl = bgMatch[1]; break; }
                        }
                    }
                    results.push({ id, title, price, address: loc || '', imageUrl: imgUrl, url: 'https://www.facebook.com/marketplace/item/' + id, source: 'Facebook Marketplace' });
                });
                return results;
            });
        };

        // Merge initial DOM scrape
        for (const item of await domScrape()) {
            if (!collectedListings.has(item.id) || !collectedListings.get(item.id)._enriched) {
                collectedListings.set(item.id, item);
            }
        }
        console.log(`[Facebook] After DOM merge: ${collectedListings.size} listings`);

        // Scroll 12 times to trigger Facebook's lazy loading and network requests
        for (let i = 0; i < 12; i++) {
            await page.evaluate(() => {
                const items = document.querySelectorAll('a[href*="/marketplace/item/"]');
                if (items.length > 0) items[items.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' });
                window.scrollBy(0, 1000);
            });
            await new Promise(r => setTimeout(r, 2000));
            // Also scrape DOM after each scroll
            for (const item of await domScrape()) {
                if (!collectedListings.has(item.id) || !collectedListings.get(item.id)._enriched) {
                    collectedListings.set(item.id, item);
                }
            }
            console.log(`[Facebook] Scroll ${i + 1}/12 — total: ${collectedListings.size} listings`);
        }

        // Final result
        const listings = Array.from(collectedListings.values())
            .map(({ _enriched, ...item }) => {
                let priceNum = 0;
                if (item.price) {
                    const clean = String(item.price).replace(/[^0-9.]/g, '');
                    const parsed = parseFloat(clean);
                    if (!isNaN(parsed)) priceNum = parsed;
                }
                return { ...item, price: priceNum, currency: 'MXN', status: 'active' };
            })
            .slice(0, limit);

        console.log(`[Facebook] ✅ ${listings.length} listings extracted (network + DOM hybrid)`);
        return listings;
        return listings;
    } catch (e) {
        console.error(`[Facebook] ❌ Failed:`, e.message);
        return [];
    } finally {
        await page.close();
    }
}


// ── HTTP Server ──────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-proxy-secret, bypass-tunnel-reminder, content-type');

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

    // ── Portal scraper endpoint (/scrape?portal=inmuebles24&url=...&maxPages=5) ──
    if (req.url.startsWith('/scrape')) {
        const portal = params.get('portal');
        const targetUrl = params.get('url');
        const maxPages = parseInt(params.get('maxPages') || '5');

        if (!portal || !targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing portal or url param' }));
            return;
        }

        console.log(`[Proxy] Scraping ${portal}: ${targetUrl} (maxPages: ${maxPages})`);
        const start = Date.now();

        try {
            let listings = [];
            switch (portal) {
                case 'inmuebles24': listings = await scrapeInmuebles24(targetUrl, maxPages); break;
                case 'lamudi': listings = await scrapeLamudi(targetUrl, maxPages); break;
                case 'vivanuncios': listings = await scrapeVivanuncios(targetUrl, maxPages); break;
                case 'facebook': listings = await scrapeFacebook(targetUrl); break;
                case 'ml': listings = await scrapeML(targetUrl, maxPages); break;
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

server.keepAliveTimeout = 120_000; // 2 min keep-alive

const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
    console.log(`\n🏠 MLS Scrape Proxy v2 running on http://${HOST}:${PORT}`);
    console.log(`   Health:  GET /health`);
    console.log(`   ML:      GET /?url=<ml_url>  (direct fetch)`);
    console.log(`   I24:     GET /scrape?portal=inmuebles24&url=<url>`);
    console.log(`   Lamudi:  GET /scrape?portal=lamudi&url=<url>`);
    console.log(`   Viva:    GET /scrape?portal=vivanuncios&url=<url>\n`);
});

// Note: tunnel keep-alive removed — proxy runs directly on Railway now

// Graceful shutdown
process.on('SIGINT', async () => {
    if (browser) await browser.close();
    process.exit(0);
});
