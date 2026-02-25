import { prismaIntelligence } from '../lib/prisma-intelligence';

async function main() {
    try {
        console.log('--- Database Verification ---');

        // Find or create source
        const profile = await prismaIntelligence.sourceProfile.upsert({
            where: { name: 'Verification-Source' },
            update: {},
            create: {
                name: 'Verification-Source',
                type: 'DEBUG',
                baseUrl: 'http://verification.com',
                trustScore: 100,
                config: '{}'
            }
        });

        console.log('Source Profile created/found:', profile.id);

        const listingCountBefore = await prismaIntelligence.observedListing.count();
        console.log('Listings before seed:', listingCountBefore);

        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        source: { connect: { id: profile.id } },
                        externalId: `verify-${Date.now()}`,
                        url: 'http://verification.com/test',
                        contentHash: `v-hash-${Date.now()}`,
                        rawJson: '{"verified": true}'
                    }
                },
                title: 'Verified Property ' + Math.floor(Math.random() * 100),
                price: 1000000,
                address: 'Verification St 123',
                confidenceScore: 1.0
            }
        });

        console.log('New listing created:', obs.id);
        const listingCountAfter = await prismaIntelligence.observedListing.count();
        console.log('Listings after seed:', listingCountAfter);

        if (listingCountAfter > listingCountBefore) {
            console.log('\n✅ SEED SUCCESSFUL');
        } else {
            console.error('\n❌ SEED FAILED');
        }

    } catch (e) {
        console.error('\n❌ ERROR during verification:', e);
        process.exit(1);
    } finally {
        await prismaIntelligence.$disconnect();
    }
}

main();
