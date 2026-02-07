
const { PrismaClient: IntelligenceClient } = require('@prisma/client-intelligence');
const prisma = new IntelligenceClient({
    datasources: { db: { url: "file:C:/Users/edgar/OneDrive/Desktop/AI APPS/MLS/prisma/intelligence.db" } }
});

async function run() {
    try {
        console.log('Connecting...');
        const obs = await prisma.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        sourceId: 'debug-script',
                        externalId: `debug-${Date.now()}`,
                        url: 'http://debug.com',
                        contentHash: `hash-${Date.now()}`,
                        rawJson: '{}'
                    }
                },
                title: 'Script Verified Listing',
                price: 12345,
                address: '123 Debug St',
                geoHash: 'abc',
                addressHash: `addr-${Date.now()}`
            }
        });
        console.log('SUCCESS:', obs.id);
    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
