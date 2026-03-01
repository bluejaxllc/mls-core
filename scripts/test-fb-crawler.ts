import 'dotenv/config';
import { FacebookCrawler } from '../src/crawlers/facebook_crawler';
import { CrawlJob, SourceType } from '../src/crawlers/types';
import { facebookConfig } from '../src/crawlers/facebook_config';

async function main() {
    const job: CrawlJob = {
        id: 'test-fb-job-' + Date.now(),
        sourceId: SourceType.CLASSIFIEDS,
        url: 'https://www.facebook.com/marketplace/chihuahua/propertyrentals/',
        profileName: 'Facebook Marketplace',
        config: facebookConfig,
        status: 'PENDING',
        attempt: 1
    };

    const crawler = new FacebookCrawler(job);

    console.log("Starting Facebook Crawler Test (throttled + proxied)...\n");
    const startTime = Date.now();
    const result = await crawler.run();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n--- Extraction Result ---");
    console.log(`Success: ${result.success}`);
    console.log(`Items Found: ${result.items.length}`);
    console.log(`Errors: ${result.errors.length}`);
    console.log(`Time: ${elapsed}s`);

    if (result.errors.length > 0) {
        console.error("\nErrors:", result.errors);
    }

    if (result.items.length > 0) {
        console.log("\nSample Items (First 3):");
        const samples = result.items.slice(0, 3).map(item => ({
            externalId: item.externalId,
            title: item.title,
            price: item.price,         // Should now show "MX$15,000,000" not "undefined"
            address: item.address,
            images: item.images?.length || 0,
            url: item.url,
        }));
        console.log(JSON.stringify(samples, null, 2));
    } else {
        console.log("\nNo items found. Facebook might be blocking or the actor needs updating.");
    }
}

main().catch(console.error);
