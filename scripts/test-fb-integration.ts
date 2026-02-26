import 'dotenv/config';
import { crawlScheduler } from '../src/crawlers/scheduler';
import { prismaIntelligence } from '../src/lib/intelligencePrisma';

async function main() {
    console.log("Fetching the newly seeded Facebook source...");
    const profile = await prismaIntelligence.sourceProfile.findFirst({
        where: { name: 'Facebook Marketplace (Apify)' }
    });

    if (!profile) {
        console.error("Facebook source profile not found! Please run seed-fb-source.ts first.");
        return;
    }

    console.log(`Triggering crawl job for source: ${profile.id}...`);

    // We expect the scheduler to process it async, so we'll wait a bit.
    // However, the test script will exit if we just fire and forget.
    // For this test, we will temporarily hook into activeJobs logic.
    const jobId = await crawlScheduler.scheduleJob(profile.id, profile.baseUrl);

    console.log(`Job scheduled with ID: ${jobId}. Please wait while Apify runs (could take ~15 seconds)...`);

    // Poll the DB to see if CrawlEvent finishes
    let attempts = 0;
    while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000));
        attempts++;

        const event = await prismaIntelligence.crawlEvent.findFirst({
            where: { sourceId: profile.id },
            orderBy: { startTime: 'desc' }
        });

        if (event && event.status !== 'RUNNING') {
            console.log(`Crawl event completed with status: ${event.status}`);
            console.log(`Items found: ${event.itemsFound}`);

            // Check Observed Listings
            const listings = await prismaIntelligence.observedListing.findMany({
                where: { snapshot: { sourceId: profile.id } },
                take: 5
            });

            console.log("\nSample Inserted Properties:");
            for (const l of listings) {
                console.log(`- ${l.title} | ${l.price} | ${l.address}`);
            }

            break;
        } else {
            process.stdout.write(".");
        }
    }

    if (attempts >= 30) {
        console.log("\nTimed out waiting for crawl job to complete.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaIntelligence.$disconnect();
    });
