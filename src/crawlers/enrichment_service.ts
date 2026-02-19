// Stubbed for Vercel Deployment (Puppeteer is too heavy for serverless functions)
// import puppeteer from 'puppeteer'; 
import { prismaIntelligence } from '../lib/intelligencePrisma';

export class ImageEnrichmentService {

    async enrichListingImages(listingId: string): Promise<string[]> {
        console.log(`[Enrichment] Service disabled for Vercel deployment (Listing: ${listingId})`);
        return [];
    }
}

export const imageEnrichmentService = new ImageEnrichmentService();
