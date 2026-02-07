import puppeteer, { Browser, Page } from 'puppeteer';
import { BaseCrawler, CrawlerResult } from './base';
import { RawListingData } from '../ingestion/normalizer';

export class PuppeteerCrawler extends BaseCrawler {

    async run(): Promise<CrawlerResult> {
        const result: CrawlerResult = {
            jobId: this.job.id,
            sourceId: this.job.sourceId,
            success: false,
            items: [],
            errors: [],
        };

        let browser: Browser | null = null;
        try {
            console.log(`[Crawler] Starting job ${this.job.id} for ${this.job.url}`);

            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();

            // Anti-bot: User Agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Navigate
            await page.goto(this.job.url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Snapshot
            const content = await page.content();
            result.rawHtmlSnapshot = content;

            // Extract based on selectors
            const selectors = this.config.selectors;

            // Evaluate within browser context
            const extractedItems = await page.evaluate((sel) => {
                const items: any[] = [];
                const elements = document.querySelectorAll(sel.listWrapper + ' ' + sel.listItem);

                elements.forEach(el => {
                    const titleEl = el.querySelector(sel.listingTitle);
                    let title: string | undefined;

                    // Special handling: if title selector points to an img, use alt text
                    if (titleEl?.tagName === 'IMG') {
                        title = (titleEl as HTMLImageElement).alt?.trim();
                    } else {
                        title = titleEl?.textContent?.trim();
                    }

                    if (!title) return;

                    const price = el.querySelector(sel.listingPrice)?.textContent?.trim();
                    const address = sel.listingAddress ? el.querySelector(sel.listingAddress)?.textContent?.trim() : undefined;

                    // Robust Image Extraction: Check src, data-src, srcset
                    let img = sel.listingImage ? el.querySelector(sel.listingImage)?.getAttribute('src') : undefined;
                    if (!img || img.startsWith('data:')) {
                        const imgEl = sel.listingImage ? el.querySelector(sel.listingImage) : null;
                        if (imgEl) {
                            img = imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || imgEl.getAttribute('srcset')?.split(' ')[0] || img;
                        }
                    }

                    const link = sel.detailLink ? el.querySelector(sel.detailLink)?.getAttribute('href') : undefined;

                    items.push({
                        title,
                        price,
                        address,
                        image: img,
                        url: link,
                        // Heuristic for type detection from text content
                        textContent: el.textContent // Store all text to analyze for "Land", "Rent" etc.
                    });
                });
                return items;
            }, selectors);

            // Post-process extracted items
            result.items = extractedItems.map(item => ({
                externalId: item.url || this.generatePseudoId(item.title), // Fallback ID
                url: item.url ? new URL(item.url, this.job.url).href : this.job.url,
                title: item.title,
                price: item.price,
                address: item.address,
                images: item.image ? [item.image] : [],
                rawJson: item
            }));

            result.success = true;
            console.log(`[Crawler] Found ${result.items.length} items.`);

        } catch (error: any) {
            console.error(`[Crawler] Job ${this.job.id} failed:`, error);
            result.errors.push(error.message);
        } finally {
            if (browser) await browser.close();
        }

        return result;
    }

    private generatePseudoId(str: string): string {
        return Buffer.from(str).toString('base64').substring(0, 16);
    }
}
