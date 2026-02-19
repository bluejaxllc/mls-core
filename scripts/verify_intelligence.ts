
// Scripts to verify Intelligence Layer
import app from '../src/server_intelligence_test';
import { prismaIntelligence } from '../src/lib/intelligencePrisma';
import { sourceProfileService } from '../src/crawlers/profiles/service';
import { normalizerService } from '../src/ingestion/normalizer';
import { fingerprintService } from '../src/ingestion/fingerprint';

const PORT = 3006;

async function runVerification() {
    console.log('--- STARTING VERIFICATION ---');

    // 1. Start Server
    const server = app.listen(PORT, () => {
        console.log(`Test Server running on ${PORT}`);
    });

    try {
        // 2. Create Source Profile
        console.log('2. Creating Source Profile...');
        const profile = await sourceProfileService.createProfile({
            name: `TestBroker-${Date.now()}`,
            type: 'BROKERAGE' as any,
            baseUrl: 'http://example.com',
            trustScore: 80,
            config: {
                selectors: {
                    listWrapper: '.list',
                    listItem: '.item',
                    listingTitle: '.title',
                    listingPrice: '.price'
                }
            } as any
        });
        console.log('   Profile Created:', profile.id);

        // 3. Simulate Ingestion (Directly calling logic, bypassing full Puppeteer for speed)
        console.log('3. Simulating Ingestion...');
        const rawData = {
            externalId: 'ext-123',
            url: 'http://example.com/property/1',
            title: 'Luxury Villa in Chihuahua',
            price: '$12,500,000',
            address: 'Av. Vallarta 123',
            lat: 28.6353,
            lng: -106.0889
        };

        const normalized = normalizerService.normalize(rawData);
        console.log('   Normalized:', normalized);

        // 4. Store Observation
        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        sourceId: profile.id,
                        externalId: rawData.externalId,
                        url: rawData.url,
                        contentHash: 'hash-123',
                        rawJson: JSON.stringify(rawData)
                    }
                },
                title: normalized.title,
                price: normalized.price,
                address: normalized.address,
                geoHash: normalized.geoHash,
                addressHash: normalized.addressHash
            }
        });
        console.log('   Observed Listing Created:', obs.id);

        // 5. Verify Signal Logic (Manual Trigger)
        // In real flow, scheduler triggers this. Here we verify DB state.
        const stored = await prismaIntelligence.observedListing.findUnique({
            where: { id: obs.id },
            include: { snapshot: true }
        });

        if (stored?.title === 'Luxury Villa in Chihuahua') {
            console.log('   SUCCESS: Data persisted correctly.');
        } else {
            console.error('   FAILURE: Data mismatch.');
        }

    } catch (e) {
        console.error('VERIFICATION FAILED', e);
    } finally {
        server.close();
        console.log('--- VERIFICATION COMPLETE ---');
        process.exit(0);
    }
}

runVerification();
