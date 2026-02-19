import { SourceConfig, CrawlJob } from './types';
import { RawListingData } from '../ingestion/normalizer';

export interface CrawlerResult {
    jobId: string;
    sourceId: string;
    success: boolean;
    items: RawListingData[];
    errors: string[];
    rawHtmlSnapshot?: string; // Optional: path or content of full page snapshot
}

export abstract class BaseCrawler {
    protected config: SourceConfig;
    protected job: CrawlJob;

    constructor(job: CrawlJob) {
        this.job = job;
        this.config = job.config;
    }

    /**
     * Main entry point for the crawl job
     */
    abstract run(): Promise<CrawlerResult>;

    protected async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected getRandomDelay(): number {
        const [min, max] = this.config.antiBot.delayRange;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
