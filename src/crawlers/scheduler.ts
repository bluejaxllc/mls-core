import { CrawlJob, SourceConfig } from './types';
import { PuppeteerCrawler } from './puppeteer_crawler';
import { normalizerService } from '../ingestion/normalizer';
import { sourceProfileService } from './profiles/service';
import { fingerprintService } from '../ingestion/fingerprint';
import { prismaIntelligence } from '../lib/intelligencePrisma';
import { v4 as uuidv4 } from 'uuid';

export class CrawlScheduler {
    private queue: CrawlJob[] = [];
    private activeJobs: Map<string, CrawlJob> = new Map();

    async scheduleJob(sourceId: string, url: string) {
        const profile = await sourceProfileService.getProfile(sourceId);
        if (!profile) throw new Error('Source not found');

        const job: CrawlJob = {
            id: uuidv4(),
            sourceId,
            url,
            profileName: profile.name,
            config: profile.config,
            status: 'PENDING',
            attempt: 0,
        };

        this.queue.push(job);
        console.log(`[Scheduler] Job ${job.id} scheduled for ${profile.name}`);
        this.processQueue();
        return job.id;
    }

    private async processQueue() {
        if (this.queue.length === 0) return;
        if (this.activeJobs.size >= 2) return; // Limit concurrency

        const job = this.queue.shift();
        if (!job) return;

        this.activeJobs.set(job.id, job);
        job.status = 'RUNNING';
        job.startedAt = new Date();

        // Start asynchronously
        this.runJob(job);
    }

    private async runJob(job: CrawlJob) {
        try {
            // 1. Create Crawler
            const crawler = new PuppeteerCrawler(job);

            // 2. Run Crawl
            const result = await crawler.run();

            // 3. Log Event
            await prismaIntelligence.crawlEvent.create({
                data: {
                    sourceId: job.sourceId,
                    status: result.success ? 'COMPLETED' : 'FAILED',
                    itemsFound: result.items.length,
                    itemsNew: 0, // Calculated later
                    errors: JSON.stringify(result.errors),
                }
            });

            if (result.success) {
                console.log(`[Scheduler] Job ${job.id} success. Ingesting ${result.items.length} items.`);

                // 4. Ingest & Normalize
                for (const rawItem of result.items) {
                    const normalized = normalizerService.normalize(rawItem);

                    // 5. Store Snapshot & Intelligene
                    // This transaction ensures we have the snapshot and the observed listing
                    const contentHash = fingerprintService.generateAttributeHash({
                        // Simple hash of content for change detection
                        type: JSON.stringify(rawItem)
                    });

                    await prismaIntelligence.$transaction(async (tx: any) => {
                        // Create Snapshot
                        const snapshot = await tx.sourceSnapshot.create({
                            data: {
                                sourceId: job.sourceId,
                                externalId: rawItem.externalId,
                                url: rawItem.url,
                                rawHtml: result.rawHtmlSnapshot, // Maybe too big? Store null for now if undefined
                                rawJson: JSON.stringify(rawItem.rawJson),
                                contentHash,
                            }
                        });

                        // Create Observed Listing
                        await tx.observedListing.create({
                            data: {
                                snapshotId: snapshot.id,
                                title: normalized.title,
                                description: normalized.description,
                                price: normalized.price,
                                address: normalized.address,
                                lat: normalized.lat,
                                lng: normalized.lng,
                                geoHash: normalized.geoHash,
                                addressHash: normalized.addressHash,
                            }
                        });
                    });
                }
            }

            job.status = 'COMPLETED';
        } catch (e) {
            console.error(`[Scheduler] Job ${job.id} crashed`, e);
            job.status = 'FAILED';
        } finally {
            job.completedAt = new Date();
            this.activeJobs.delete(job.id);
            this.processQueue(); // Pick up next
        }
    }
}

export const crawlScheduler = new CrawlScheduler();
