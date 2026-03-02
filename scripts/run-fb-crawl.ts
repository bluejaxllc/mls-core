#!/usr/bin/env node
/**
 * Facebook Marketplace Crawler — Standalone Runner
 * 
 * Run: npx ts-node scripts/run-fb-crawl.ts [--city Chihuahua] [--limit 50]
 * 
 * Requirements:
 *   npm install puppeteer (one-time, downloads Chromium ~170MB)
 *   INTELLIGENCE_DATABASE_URL env var must be set
 * 
 * This script:
 *   1. Opens headless Chrome → navigates to FB Marketplace
 *   2. Extracts listing data from the DOM + inline JSON
 *   3. Saves results to the intelligence DB (ObservedListing)
 *   4. Logs summary to console
 * 
 * Schedule: Run via Windows Task Scheduler or cron every 6 hours
 */

import puppeteer, { Browser, Page } from 'puppeteer';

// ─── Config ─────────────────────────────────────────────
interface CrawlConfig {
    city: string;
    category: string;
    limit: number;
    delayMin: number;
    delayMax: number;
}

const FB_MARKETPLACE_URL = (city: string, category: string) =>
    `https://www.facebook.com/marketplace/${city}/${category}/?exact=false`;

// ─── CLI Args ───────────────────────────────────────────
function parseArgs(): CrawlConfig {
    const args = process.argv.slice(2);
    const config: CrawlConfig = {
        city: 'chihuahua',
        category: 'propertyrentals',
        limit: 50,
        delayMin: 3000,
        delayMax: 8000,
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--city' && args[i + 1]) config.city = args[++i];
        if (args[i] === '--category' && args[i + 1]) config.category = args[++i];
        if (args[i] === '--limit' && args[i + 1]) config.limit = parseInt(args[++i]);
    }

    return config;
}

// ─── Delay Utility ──────────────────────────────────────
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Listing Interface ─────────────────────────────────
interface FBListing {
    id: string;
    title: string;
    price: string | null;
    address: string | null;
    imageUrl: string | null;
    url: string;
}

// ─── DOM Extraction ─────────────────────────────────────
async function extractListingsFromDOM(page: Page): Promise<FBListing[]> {
    return page.evaluate(() => {
        const listings: any[] = [];
        const links = document.querySelectorAll('a[href*="/marketplace/item/"]');

        links.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const idMatch = href.match(/\/marketplace\/item\/(\d+)/);
            if (!idMatch) return;

            const id = idMatch[1];
            const container = link.closest('div') || link;

            const spans = container.querySelectorAll('span');
            const texts: string[] = [];
            spans.forEach(s => {
                const text = s.textContent?.trim();
                if (text && text.length > 0 && text.length < 200) {
                    texts.push(text);
                }
            });

            const price = texts.find(t => t.includes('$') || t.includes('MX')) || null;
            const title = texts.find(t => t.length > 10 && !t.includes('$')) || `Propiedad #${id.substring(0, 6)}`;
            const address = texts.find(t =>
                (t.includes('Chihuahua') || t.includes('Juárez') || t.includes(',')) &&
                !t.includes('$') && t !== title
            ) || null;

            const img = container.querySelector('img');
            const imageUrl = img?.getAttribute('src') || null;

            listings.push({
                id,
                title,
                price,
                address: address || 'Chihuahua',
                imageUrl: imageUrl && !imageUrl.startsWith('data:') ? imageUrl : null,
                url: `https://www.facebook.com/marketplace/item/${id}`,
            });
        });

        // Deduplicate
        const seen = new Set<string>();
        return listings.filter(l => {
            if (seen.has(l.id)) return false;
            seen.add(l.id);
            return true;
        });
    });
}

// ─── JSON Extraction (FB inlines listing data) ──────────
async function extractListingsFromJSON(page: Page): Promise<FBListing[]> {
    try {
        const html = await page.content();
        const listings: FBListing[] = [];

        const regex = /\{"id"\s*:\s*"(\d+)"[^}]*?"marketplace_listing_title"\s*:\s*"([^"]*)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const [fullMatch, id, title] = match;

            // Extract surrounding context for price/city
            const contextStart = Math.max(0, match.index - 500);
            const contextEnd = Math.min(html.length, match.index + fullMatch.length + 500);
            const context = html.substring(contextStart, contextEnd);

            let price: string | null = null;
            const priceMatch = context.match(/"formatted_amount"\s*:\s*"([^"]*)"/);
            if (priceMatch) price = priceMatch[1];

            let imageUrl: string | null = null;
            const imgMatch = context.match(/"uri"\s*:\s*"(https:[^"]*)"/);
            if (imgMatch) imageUrl = imgMatch[1].replace(/\\\//g, '/');

            let city: string | null = null;
            const cityMatch = context.match(/"city"\s*:\s*"([^"]*)"/);
            if (cityMatch) city = cityMatch[1];

            listings.push({
                id,
                title: decodeUnicode(title),
                price,
                address: city || 'Chihuahua',
                imageUrl,
                url: `https://www.facebook.com/marketplace/item/${id}`,
            });
        }

        const seen = new Set<string>();
        return listings.filter(l => {
            if (seen.has(l.id)) return false;
            seen.add(l.id);
            return true;
        });
    } catch {
        return [];
    }
}

function decodeUnicode(str: string): string {
    return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code: string) =>
        String.fromCharCode(parseInt(code, 16))
    );
}

// ─── Save to Intelligence DB ────────────────────────────
async function saveToDatabase(listings: FBListing[]): Promise<number> {
    let saved = 0;
    try {
        // Dynamic import to avoid errors if prisma isn't generated
        const { prismaIntelligence } = await import('../src/lib/intelligencePrisma');
        const { fingerprintService } = await import('../src/ingestion/fingerprint');

        for (const listing of listings) {
            try {
                const contentHash = fingerprintService.generateAttributeHash({
                    type: JSON.stringify(listing)
                });

                // Check for duplicate
                const existing = await prismaIntelligence.sourceSnapshot.findFirst({
                    where: {
                        externalId: listing.id,
                        sourceId: 'facebook-marketplace'
                    },
                    orderBy: { fetchedAt: 'desc' }
                });

                if (existing && existing.contentHash === contentHash) {
                    console.log(`  ⏭️  Skip duplicate: ${listing.id}`);
                    continue;
                }

                // Parse price
                let priceNum: number | null = null;
                if (listing.price) {
                    const clean = listing.price.replace(/[^0-9.]/g, '');
                    const parsed = parseFloat(clean);
                    if (!isNaN(parsed)) priceNum = parsed;
                }

                // Create snapshot + observed listing
                await prismaIntelligence.$transaction(async (tx: any) => {
                    const snapshot = await tx.sourceSnapshot.create({
                        data: {
                            sourceId: 'facebook-marketplace',
                            externalId: listing.id,
                            url: listing.url,
                            rawJson: JSON.stringify(listing),
                            contentHash,
                        }
                    });

                    await tx.observedListing.create({
                        data: {
                            snapshotId: snapshot.id,
                            title: listing.title,
                            price: priceNum,
                            address: listing.address,
                        }
                    });
                });

                saved++;
                console.log(`  ✅ Saved: ${listing.title} (${listing.price || 'N/A'})`);
            } catch (e: any) {
                console.error(`  ❌ Failed to save ${listing.id}: ${e.message}`);
            }
        }

        await prismaIntelligence.$disconnect();
    } catch (e: any) {
        console.error(`[DB] Failed to connect: ${e.message}`);
        console.log('[DB] Listings will be printed to console only.');
    }

    return saved;
}

// ─── Main ───────────────────────────────────────────────
async function main() {
    const config = parseArgs();
    const url = FB_MARKETPLACE_URL(config.city, config.category);

    console.log('');
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║   🏠 Facebook Marketplace Crawler             ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log(`  City:     ${config.city}`);
    console.log(`  Category: ${config.category}`);
    console.log(`  Limit:    ${config.limit}`);
    console.log(`  URL:      ${url}`);
    console.log('');

    let browser: Browser | null = null;

    try {
        console.log('[1/5] Launching Chromium...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1280,900',
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        );

        // Block heavy resources
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Drip delay
        const d = randomDelay(config.delayMin, config.delayMax);
        console.log(`[2/5] Drip delay: ${d}ms...`);
        await delay(d);

        console.log(`[3/5] Navigating to FB Marketplace...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await delay(3000);

        // Scroll to trigger lazy loading
        console.log('[4/5] Scrolling to load listings...');
        for (let scroll = 0; scroll < 3; scroll++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
            await delay(randomDelay(1500, 3000));
        }

        // Extract from DOM
        console.log('[5/5] Extracting listings...');
        const domListings = await extractListingsFromDOM(page);
        console.log(`  DOM extraction: ${domListings.length} listings`);

        // Extract from inline JSON
        const jsonListings = await extractListingsFromJSON(page);
        console.log(`  JSON extraction: ${jsonListings.length} listings`);

        // Merge (JSON data is richer, overwrites DOM)
        const merged = new Map<string, FBListing>();
        for (const item of domListings) merged.set(item.id, item);
        for (const item of jsonListings) if (item.id) merged.set(item.id, item);

        const allListings = Array.from(merged.values()).slice(0, config.limit);
        console.log(`\n📊 Total unique listings: ${allListings.length}`);

        if (allListings.length === 0) {
            console.log('⚠️  No listings found. FB may require login or changed their DOM.');
            console.log('   Try running with a logged-in session or use Apify fallback.');
            return;
        }

        // Print summary
        console.log('\n─── Results ───');
        for (const l of allListings.slice(0, 10)) {
            console.log(`  ${l.title} | ${l.price || 'N/A'} | ${l.address}`);
        }
        if (allListings.length > 10) {
            console.log(`  ... and ${allListings.length - 10} more`);
        }

        // Save to DB
        console.log('\n─── Saving to Database ───');
        const saved = await saveToDatabase(allListings);
        console.log(`\n✅ Done! Saved ${saved}/${allListings.length} listings to intelligence DB.`);

    } catch (e: any) {
        console.error(`\n❌ Crawler failed: ${e.message}`);
        if (e.message.includes('Could not find expected browser')) {
            console.log('\n💡 Run: npm install puppeteer');
            console.log('   This will download Chromium (~170MB, one-time).');
        }
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

main();
