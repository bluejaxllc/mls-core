import { MercadoLibreAuth } from './auth';
import { MercadoLibreClient } from './client';
import { prismaIntelligence } from '@/lib/prisma-intelligence';
import { normalizeMercadoLibre } from './normalizer';

export class MercadoLibreCrawler {
    private client: MercadoLibreClient;

    constructor(auth: MercadoLibreAuth) {
        this.client = new MercadoLibreClient(auth);
    }

    async crawlChihuahua(limit: number = 50): Promise<number> {
        console.log(`\n🏢 [ML Crawler] Starting Chihuahua real estate crawl (limit: ${limit})...\n`);

        try {
            const source = await prismaIntelligence.sourceProfile.upsert({
                where: { name: 'Mercado Libre Mexico' },
                create: {
                    name: 'Mercado Libre Mexico',
                    type: 'PORTAL',
                    baseUrl: 'https://www.mercadolibre.com.mx',
                    trustScore: 90,
                    isEnabled: true,
                    config: JSON.stringify({ apiEnabled: true, source: 'official_api' })
                },
                update: {
                    trustScore: 90,
                    isEnabled: true
                }
            });

            console.log(`✅ Source profile: ${source.name} (ID: ${source.id})\n`);

            const searchResponse = await this.client.searchRealEstate('Chihuahua', 'MLM-CHH', limit);
            const items = searchResponse.results;

            if (items.length === 0) {
                console.log('⚠️  No listings found for Chihuahua\n');
                return 0;
            }

            let savedCount = 0;
            let skippedCount = 0;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                try {
                    const fullItem = await this.client.getItemDetails(item.id);
                    let description = '';
                    try {
                        description = await this.client.getItemDescription(item.id);
                    } catch (e) { }

                    const existing = await prismaIntelligence.sourceSnapshot.findFirst({
                        where: {
                            sourceId: source.id,
                            externalId: fullItem.id
                        }
                    });

                    if (existing) {
                        skippedCount++;
                        continue;
                    }

                    const normalized = normalizeMercadoLibre(fullItem);
                    if (description) normalized.description = description;

                    const snapshot = await prismaIntelligence.sourceSnapshot.create({
                        data: {
                            sourceId: source.id,
                            externalId: fullItem.id,
                            url: fullItem.permalink,
                            rawHtml: '',
                            rawJson: JSON.stringify(fullItem),
                            contentHash: fullItem.id
                        }
                    });

                    await prismaIntelligence.observedListing.create({
                        data: {
                            snapshotId: snapshot.id,
                            title: normalized.title,
                            description: normalized.description,
                            price: normalized.price,
                            currency: normalized.currency,
                            address: normalized.address,
                            status: normalized.status
                        }
                    });

                    savedCount++;
                } catch (error: any) {
                    console.error(`   ❌ Failed to process ${item.id}:`, error.message);
                }

                if (i < items.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            console.log(`🎉 Crawl completed! Saved: ${savedCount}, Skipped: ${skippedCount}`);
            return savedCount;
        } catch (error: any) {
            console.error('\n❌ Crawler failed:', error.message);
            throw error;
        }
    }
}
