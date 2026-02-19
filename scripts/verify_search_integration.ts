
import { prisma as prismaCore } from '../src/lib/prisma';
import { prismaIntelligence } from '../src/lib/intelligencePrisma';
import { sourceProfileService } from '../src/crawlers/profiles/service';

async function verifySearch() {
    console.log('--- STARTING SEARCH VERIFICATION ---');

    const uniqueId = Date.now();

    try {
        // 1. Create Source Profile
        console.log('1. Creating Source Profile...');
        const profile = await sourceProfileService.createProfile({
            name: `SearchTestSource-${uniqueId}`,
            type: 'PORTAL' as any,
            baseUrl: 'http://test.com',
            trustScore: 50,
            config: { selectors: {} } as any
        });
        console.log('   Profile Created:', profile.id);

        // 2. Create Observed Listing
        console.log('2. Creating Observed Listing...');
        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        sourceId: profile.id,
                        externalId: `ext-${uniqueId}`,
                        url: `http://test.com/p/${uniqueId}`,
                        contentHash: `hash-${uniqueId}`,
                        rawJson: '{}'
                    }
                },
                title: `Observed Villa ${uniqueId}`,
                price: 5000000,
                address: 'Calle Falsa 123',
                geoHash: 'xyz',
                addressHash: 'abc'
            }
        });
        console.log('   Observed Listing Created:', obs.id);

        // 3. Create Canonical Listing (Core)
        console.log('3. Creating Canonical Listing...');
        const canon = await prismaCore.listing.create({
            data: {
                propertyId: `PROP-${uniqueId}`,
                title: `Canonical Mansion ${uniqueId}`,
                description: 'A verified property',
                address: 'Av. Verdadera 456',
                propertyType: 'residential',
                status: 'ACTIVE',
                source: 'MANUAL',
                price: 8000000,
                ownerId: 'user-1' // user-1 usually exists or we assume loose FK in sqlite for dev
            }
        });
        console.log('   Canonical Listing Created:', canon.id);

        // 4. Simulate Search Logic
        console.log('4. Simulating Search...');

        // Core Fetch
        const canonicalResults = await prismaCore.listing.findMany({
            where: { title: { contains: String(uniqueId) } },
            take: 10
        });

        // Intelligence Fetch
        const observedResults = await prismaIntelligence.observedListing.findMany({
            where: { title: { contains: String(uniqueId) } },
            include: { snapshot: { include: { source: true } } }
        });

        // Unify
        const unified = [
            ...canonicalResults.map(c => ({
                id: c.id,
                type: 'CANONICAL',
                title: c.title,
                source: c.source
            })),
            ...observedResults.map(o => ({
                id: o.id,
                type: 'OBSERVED',
                title: o.title,
                source: o.snapshot?.source?.name
            }))
        ];

        console.log('--- SEARCH RESULTS ---');
        console.log(JSON.stringify(unified, null, 2));

        if (unified.length === 2) {
            console.log('SUCCESS: Retrieved both Canonical and Observed listings.');
        } else {
            console.error(`FAILURE: Expected 2 results, got ${unified.length}`);
        }

    } catch (e) {
        console.error('VERIFICATION FAILED', e);
    } finally {
        process.exit(0);
    }
}

verifySearch();
