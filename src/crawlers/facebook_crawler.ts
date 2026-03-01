import puppeteer, { Browser, Page } from 'puppeteer';
import { BaseCrawler, CrawlerResult } from './base';
import { RawListingData } from '../ingestion/normalizer';

/**
 * Facebook Marketplace Drip Crawler
 * 
 * Uses Puppeteer directly for zero-cost on-demand scraping.
 * Strategy: Open FB Marketplace, wait for listings to render,
 * extract what's visible, close. Gentle drip with 2-10s delays.
 * 
 * Falls back to Apify if Puppeteer extraction fails.
 */
export class FacebookCrawler extends BaseCrawler {

    // Apify fallback
    private static readonly APIFY_ACTOR_ID = 'Y0QGH7cuqgKtNbEgt';

    async run(): Promise<CrawlerResult> {
        const result: CrawlerResult = {
            jobId: this.job.id,
            sourceId: this.job.sourceId,
            success: false,
            items: [],
            errors: [],
        };

        // Try Puppeteer drip first (zero cost)
        try {
            console.log(`[FBDrip] Starting Puppeteer drip crawl for ${this.job.url}`);
            const items = await this.dripCrawl();

            if (items.length > 0) {
                result.items = items;
                result.success = true;
                console.log(`[FBDrip] ✅ Puppeteer drip got ${items.length} listings`);
                return result;
            }

            console.warn(`[FBDrip] Puppeteer returned 0 items, trying Apify fallback...`);
        } catch (e: any) {
            console.warn(`[FBDrip] Puppeteer failed: ${e.message}. Trying Apify fallback...`);
            result.errors.push(`Puppeteer: ${e.message}`);
        }

        // Fallback: Apify (if token is set)
        const apifyToken = process.env.APIFY_API_TOKEN;
        if (apifyToken) {
            try {
                const items = await this.apifyFallback(apifyToken);
                if (items.length > 0) {
                    result.items = items;
                    result.success = true;
                    console.log(`[FBDrip] ✅ Apify fallback got ${items.length} listings`);
                    return result;
                }
            } catch (e: any) {
                result.errors.push(`Apify: ${e.message}`);
            }
        }

        return result;
    }

    /**
     * Primary: Puppeteer drip crawl
     * Opens a headless browser, navigates to FB Marketplace, 
     * waits for listings to load, extracts data from the DOM.
     */
    private async dripCrawl(): Promise<RawListingData[]> {
        let browser: Browser | null = null;

        try {
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

            // Stealth: realistic viewport + user agent
            await page.setViewport({ width: 1280, height: 900 });
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            // Block unnecessary resources for speed
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const type = req.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            // Drip delay before navigating (2-5s random)
            await this.delay(this.getRandomDelay());

            console.log(`[FBDrip] Navigating to ${this.job.url}...`);
            await page.goto(this.job.url, {
                waitUntil: 'networkidle2',
                timeout: 45000,
            });

            // Wait for marketplace content to render
            await this.delay(3000);

            // Scroll once to trigger lazy-loading (gentle drip)
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight * 2);
            });
            await this.delay(2000);

            // Extract listing data from the page
            const items = await page.evaluate(() => {
                const listings: any[] = [];

                // Strategy 1: Find marketplace item links
                const links = document.querySelectorAll('a[href*="/marketplace/item/"]');

                links.forEach((link) => {
                    const href = link.getAttribute('href') || '';
                    const idMatch = href.match(/\/marketplace\/item\/(\d+)/);
                    if (!idMatch) return;

                    const id = idMatch[1];
                    const container = link.closest('div') || link;

                    // Get all text content within the link area
                    const spans = container.querySelectorAll('span');
                    const texts: string[] = [];
                    spans.forEach(s => {
                        const text = s.textContent?.trim();
                        if (text && text.length > 0 && text.length < 200) {
                            texts.push(text);
                        }
                    });

                    // Heuristic: first text is usually price, second is title, third is location
                    let price = texts.find(t => t.includes('$') || t.includes('MX'));
                    let title = texts.find(t => t.length > 10 && !t.includes('$'));
                    let address = texts.find(t =>
                        (t.includes('Chihuahua') || t.includes('Juárez') || t.includes(',')) &&
                        !t.includes('$') && t !== title
                    );

                    // Get image
                    const img = container.querySelector('img');
                    const imageUrl = img?.getAttribute('src') || null;

                    listings.push({
                        id,
                        title: title || `Propiedad #${id.substring(0, 6)}`,
                        price,
                        address: address || 'Chihuahua',
                        imageUrl: imageUrl && !imageUrl.startsWith('data:') ? imageUrl : null,
                        url: `https://www.facebook.com/marketplace/item/${id}`,
                    });
                });

                // Deduplicate by ID
                const seen = new Set<string>();
                return listings.filter(l => {
                    if (seen.has(l.id)) return false;
                    seen.add(l.id);
                    return true;
                });
            });

            // Also try to extract from embedded JSON (Facebook inlines listing data)
            const jsonItems = await this.extractFromPageJson(page);

            // Merge results, preferring JSON data (richer)
            const mergedMap = new Map<string, any>();

            for (const item of items) {
                mergedMap.set(item.id, item);
            }
            for (const item of jsonItems) {
                // JSON data is richer, so it overwrites DOM data
                if (item.id) mergedMap.set(item.id, item);
            }

            // Convert to RawListingData
            return [...mergedMap.values()].map(item => this.transformDripItem(item));

        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    /**
     * Extract listings from Facebook's inline JSON data in the page source.
     * FB embeds listing data as JSON in script tags.
     */
    private async extractFromPageJson(page: Page): Promise<any[]> {
        try {
            const html = await page.content();
            const listings: any[] = [];

            // Find JSON blobs with listing data
            const regex = /\{"id"\s*:\s*"(\d+)"[^}]*?"marketplace_listing_title"\s*:\s*"([^"]*)"[^}]*?\}/g;
            const matches = [...html.matchAll(regex)];

            for (const match of matches) {
                const [fullJson, id, title] = match;

                let price: string | null = null;
                const priceMatch = fullJson.match(/"formatted_amount"\s*:\s*"([^"]*)"/);
                if (priceMatch) price = priceMatch[1];

                let imageUrl: string | null = null;
                const imgMatch = fullJson.match(/"uri"\s*:\s*"(https:[^"]*)"/);
                if (imgMatch) imageUrl = imgMatch[1].replace(/\\\//g, '/');

                let city: string | null = null;
                const cityMatch = fullJson.match(/"city"\s*:\s*"([^"]*)"/);
                if (cityMatch) city = cityMatch[1];

                listings.push({
                    id,
                    title: this.decodeUnicode(title),
                    price,
                    address: city || 'Chihuahua',
                    imageUrl,
                    url: `https://www.facebook.com/marketplace/item/${id}`,
                });
            }

            // Deduplicate
            const seen = new Set<string>();
            return listings.filter(l => {
                if (seen.has(l.id)) return false;
                seen.add(l.id);
                return true;
            });
        } catch (_e) {
            return [];
        }
    }

    /**
     * Transform a drip-extracted item into RawListingData format.
     */
    private transformDripItem(item: any): RawListingData {
        // Parse price string to get numeric value
        let priceStr = item.price;
        if (!priceStr && item.priceFormatted) priceStr = item.priceFormatted;

        return {
            externalId: item.id || this.generatePseudoId(item.title || 'unknown'),
            url: item.url || this.job.url,
            title: item.title || 'Propiedad Detectada',
            price: priceStr,
            address: item.address,
            images: item.imageUrl ? [item.imageUrl] : [],
            description: item.description,
            rawJson: item,
        };
    }

    /**
     * Fallback: Apify-based scraping (costs money but more reliable)
     */
    private async apifyFallback(token: string): Promise<RawListingData[]> {
        const { ApifyClient } = await import('apify-client');
        const client = new ApifyClient({ token });

        const run = await client.actor(FacebookCrawler.APIFY_ACTOR_ID).call({
            urls: [this.job.url],
            deepScrape: false,
            strictFiltering: true,
            maxConcurrency: 1,
            requestDelay: 5000,
        }, {
            timeout: 120,
            memory: 1024,
        } as any);

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        if (!items || items.length === 0) return [];

        return items.map((item: any) => this.transformApifyItem(item));
    }

    /**
     * Transform Apify item to RawListingData.
     */
    private transformApifyItem(item: any): RawListingData {
        const title = item.marketplace_listing_title || item.custom_title || item.title || 'Unknown Title';

        let price: string | undefined;
        if (item.listing_price?.formatted_amount) {
            price = item.listing_price.formatted_amount;
        } else if (item.listing_price?.amount) {
            price = String(item.listing_price.amount);
        } else if (item.price != null) {
            price = String(item.price);
        }

        let url = item.listingUrl || item.url;
        if (!url && item.id) url = `https://www.facebook.com/marketplace/item/${item.id}`;

        let address: string | undefined;
        if (item.location?.reverse_geocode?.city) {
            address = item.location.reverse_geocode.city;
            if (item.location.reverse_geocode.state) {
                address += `, ${item.location.reverse_geocode.state}`;
            }
        }

        const images: string[] = [];
        if (item.primary_listing_photo?.listing_image?.uri) {
            images.push(item.primary_listing_photo.listing_image.uri);
        }

        return {
            externalId: item.id || this.generatePseudoId(title),
            url: url || this.job.url,
            title,
            price,
            address,
            images,
            description: item.description,
            rawJson: item,
        };
    }

    private decodeUnicode(str: string): string {
        return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code: string) =>
            String.fromCharCode(parseInt(code, 16))
        );
    }

    private generatePseudoId(str: string): string {
        return Buffer.from(str).toString('base64').substring(0, 16);
    }
}
