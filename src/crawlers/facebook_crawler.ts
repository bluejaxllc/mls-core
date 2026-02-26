import { ApifyClient } from 'apify-client';
import { BaseCrawler, CrawlerResult } from './base';
import { RawListingData } from '../ingestion/normalizer';

export class FacebookCrawler extends BaseCrawler {

    async run(): Promise<CrawlerResult> {
        const result: CrawlerResult = {
            jobId: this.job.id,
            sourceId: this.job.sourceId,
            success: false,
            items: [],
            errors: [],
        };

        const apifyToken = process.env.APIFY_API_TOKEN;

        if (!apifyToken) {
            result.errors.push("APIFY_API_TOKEN environment variable is not set.");
            return result;
        }

        try {
            console.log(`[FBCrawler-Apify] Starting job ${this.job.id} for ${this.job.url}`);

            const client = new ApifyClient({
                token: apifyToken,
            });

            // We will use a known good Facebook Marketplace scraper from Apify store.
            // Example: 'apify/facebook-marketplace-scraper' or similar.
            // Note: Since URLs can be just the category/city, we pass it as a start URL.

            const input = {
                urls: [this.job.url],
                deepScrape: false,
                strictFiltering: true
            };

            console.log(`[FBCrawler-Apify] Calling Apify Actor with input:`, input);

            const run = await client.actor('Y0QGH7cuqgKtNbEgt').call(input);

            console.log(`[FBCrawler-Apify] Actor finished. Fetching dataset: ${run.defaultDatasetId}`);

            const { items } = await client.dataset(run.defaultDatasetId).listItems();

            // Transform Apify output to our RawListingData format
            result.items = items.map((item: any) => {

                // Read from Apify's specific FB marketplace actor format
                const title = item.marketplace_listing_title || item.custom_title || item.title || item.name || 'Unknown Title';
                const priceStr = item.listing_price?.formatted_amount || item.listing_price?.amount || item.price ? String(item.price) : undefined;

                let url = item.listingUrl || item.url;
                if (!url && item.id) url = `https://www.facebook.com/marketplace/item/${item.id}`;

                let address = item.location?.reverse_geocode?.city;
                if (item.location?.reverse_geocode?.state) {
                    address += `, ${item.location.reverse_geocode.state}`;
                }
                if (!address && item.location) address = item.location;

                const images: string[] = [];
                if (item.primary_listing_photo?.listing_image?.uri) {
                    images.push(item.primary_listing_photo.listing_image.uri);
                }
                if (Array.isArray(item.images)) images.push(...item.images);

                return {
                    externalId: item.id || this.extractFacebookId(url) || this.generatePseudoId(title),
                    url: url || this.job.url,
                    title: title,
                    price: priceStr,
                    address: address || null,
                    images: images,
                    description: item.description || item.custom_sub_titles_with_rendering_flags?.map((x: any) => x.subtitle).join(' | '),
                    rawJson: item
                };
            });

            result.success = true;
            console.log(`[FBCrawler-Apify] Found ${result.items.length} items via Apify.`);

        } catch (error: any) {
            console.error(`[FBCrawler-Apify] Job ${this.job.id} failed:`, error);
            result.errors.push(error.message);
        }

        return result;
    }

    private extractFacebookId(url: string | undefined): string | null {
        if (!url) return null;
        const match = url.match(/\/marketplace\/item\/(\d+)/);
        return match ? match[1] : null;
    }

    private generatePseudoId(str: string): string {
        return Buffer.from(str).toString('base64').substring(0, 16);
    }
}
