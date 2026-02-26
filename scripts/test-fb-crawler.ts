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

    console.log("Starting Facebook Crawler Test...");
    const result = await crawler.run();

    console.log("\n--- Extraction Result ---");
    console.log(`Success: ${result.success}`);
    console.log(`Items Found: ${result.items.length}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
        console.error(result.errors);
    }

    if (result.items.length > 0) {
        console.log("\nSample Items (First 3):");
        console.log(JSON.stringify(result.items.slice(0, 3), null, 2));
    } else {
        console.log("No items found. Facebook might be blocking the request or the DOM changed.");
    }
}

main().catch(console.error);
