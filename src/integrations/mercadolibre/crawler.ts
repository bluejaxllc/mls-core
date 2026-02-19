import { MercadoLibreAuth } from './auth';
import { MercadoLibreClient } from './client';
import { prismaIntelligence } from '../../lib/intelligencePrisma';
import { normalizeMercadoLibre } from './normalizer';

export class MercadoLibreCrawler {
    private client: MercadoLibreClient;

    constructor(auth: MercadoLibreAuth) {
        this.client = new MercadoLibreClient(auth);
    }

    async crawlChihuahua(limit: number = 50): Promise<number> {
        console.log(`\n🏢 [ML Crawler] Starting Chihuahua real estate crawl (limit: ${limit})...\n`);

        try {
            // Get or create source profile
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

            // Search listings from Chihuahua
            const searchResponse = await this.client.searchRealEstate('Chihuahua', 'MLM-CHH', limit);
            const items = searchResponse.results;

            if (items.length === 0) {
                console.log('⚠️  No listings found for Chihuahua\n');
                return 0;
            }

            console.log(`📊 Found ${items.length} listings from API (${searchResponse.paging.total} total available)\n`);

            let savedCount = 0;
            let skippedCount = 0;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                try {
                    console.log(`\n[${i + 1}/${items.length}] Processing: ${item.id}`);

                    // Get full item details (includes more attributes)
                    const fullItem = await this.client.getItemDetails(item.id);

                    // Try to get description
                    let description = '';
                    try {
                        description = await this.client.getItemDescription(item.id);
                    } catch (e: unknown) {
                        // Description is optional
                    }

                    // Check if already exists
                    const existing = await prismaIntelligence.sourceSnapshot.findFirst({
                        where: {
                            sourceId: source.id,
                            externalId: fullItem.id
                        }
                    });

                    if (existing) {
                        console.log(`   ⏭️  Already exists, skipping`);
                        skippedCount++;
                        continue;
                    }

                    // Normalize data
                    const normalized = normalizeMercadoLibre(fullItem);

                    // Add fetched description if available
                    if (description) {
                        normalized.description = description;
                    }

                    // Create snapshot
                    const snapshot = await prismaIntelligence.sourceSnapshot.create({
                        data: {
                            sourceId: source.id,
                            externalId: fullItem.id,
                            url: fullItem.permalink,
                            rawHtml: '', // API-based, no HTML
                            rawJson: JSON.stringify(fullItem),
                            contentHash: fullItem.id
                        }
                    });

                    // Create observed listing
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
                    console.log(`   ✅ Saved: ${normalized.title.substring(0, 60)}...`);
                    console.log(`      Price: $${normalized.price.toLocaleString()} ${normalized.currency}, Status: ${normalized.status}`);

                } catch (error: unknown) {
                    const err = error as any;
                    console.error(`   ❌ Failed to process ${item.id}:`, err.message);
                }

                // Rate limiting: wait 200ms between requests
                if (i < items.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            console.log(`\n${'='.repeat(60)}`);
            console.log(`🎉 Crawl completed!`);
            console.log(`   ✅ Saved: ${savedCount} listings`);
            console.log(`   ⏭️  Skipped: ${skippedCount} (already existed)`);
            console.log(`   ❌ Failed: ${items.length - savedCount - skippedCount}`);
            console.log(`${'='.repeat(60)}\n`);

            return savedCount;

        } catch (error: unknown) {
            const err = error as any;
            console.error('\n❌ Crawler failed:', err.message);
            throw err;
        }
    }
}
