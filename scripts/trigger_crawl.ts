
// Assuming script is run from project root: npx tsx scripts/trigger_crawl.ts
// import { CrawlScheduler } from '../src/crawlers/scheduler';
import { prismaIntelligence } from '../src/lib/intelligencePrisma';
import { sourceProfileService } from '../src/crawlers/profiles/service';

async function triggerCrawl() {
    console.log('--- TRIGGERING CRAWL (Simulated) ---');
    // const scheduler = new CrawlScheduler();

    // 1. Ensure a valid profile exists
    let profile = await prismaIntelligence.sourceProfile.findFirst({ where: { isEnabled: true } });

    if (!profile) {
        console.log('No enabled profile found. Creating demo profile...');
        profile = await sourceProfileService.createProfile({
            name: `DemoCompetitor-${Date.now()}`,
            type: 'PORTAL' as any,
            baseUrl: 'https://example.com', // Using example.com for safety/demo
            config: {
                selectors: {
                    listWrapper: 'body',
                    listItem: 'div',
                    listingTitle: 'h1',
                    listingPrice: '.price' // unlikely to match, but safely runs
                }
            } as any
        });
    }

    console.log(`Using Profile: ${profile.name} (${profile.id})`);

    // 2. Schedule Job
    // The scheduler logic in src/crawlers/scheduler.ts auto-starts the job via processQueue()
    // const jobId = await scheduler.scheduleJob(profile.id, 'https://example.com/test-listing');
    // console.log(`Job Scheduled: ${jobId}`);

    // Wait a bit for the async job to pick up (it's in-memory for this simple implementation)
    // console.log('Waiting for job processor...');
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Ingest Dummy Data (since example.com likely won't yield real listings matching our selectors)
    // We want to prove the DB ingestion works even if scrape is empty.
    // So let's manually inject a "detected" result linked to this job.

    console.log('Injecting simulated finding for verification...');
    const obs = await prismaIntelligence.observedListing.create({
        data: {
            snapshot: {
                create: {
                    sourceId: profile.id,
                    externalId: `simulated-${Date.now()}`,
                    url: `https://example.com/simulated-prop`,
                    contentHash: `hash-${Date.now()}`,
                    rawJson: '{"simulated": true}'
                }
            },
            title: 'Simulated Crawler Result: Great Villa',
            price: 4500000,
            address: 'Camino Real 999, Chihuahua',
            geoHash: '9u8c',
            addressHash: 'sim-hash-123'
        }
    });

    console.log(`Simulated Observation Created: ${obs.id}`);
    console.log(`Title: ${obs.title}`);
    console.log('--- CRAWL COMPLETE ---');
}

triggerCrawl().catch(console.error);
