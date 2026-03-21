// Quick geocoding script - uses POSTGRES_PRISMA_URL or DATABASE_URL directly
import { PrismaClient } from '@prisma/client-core';

const prisma = new PrismaClient();

async function main() {
    console.log('🌍 FREE Geocoding Sweep (Nominatim/OpenStreetMap)');
    console.log('================================================\n');

    const ungeocoded = await prisma.listing.findMany({
        where: {
            OR: [{ mapUrl: null }, { mapUrl: '' }],
            address: { not: null },
            status: { not: 'EXPIRED' },
        },
        select: { id: true, address: true, city: true, state: true, title: true },
    });

    console.log(`Found ${ungeocoded.length} properties without coordinates.\n`);

    let geocoded = 0;
    let failed = 0;

    for (const listing of ungeocoded) {
        const addr = [listing.address, listing.city, listing.state, 'Mexico'].filter(Boolean).join(', ');
        try {
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addr)}`,
                { headers: { 'User-Agent': 'BlueJax-MLS/1.0 (edgar@bluejax.ai)' } }
            );
            const geoData = await geoRes.json();
            if (geoData?.[0]?.lat && geoData?.[0]?.lon) {
                const lat = parseFloat(geoData[0].lat);
                const lng = parseFloat(geoData[0].lon);
                await prisma.listing.update({
                    where: { id: listing.id },
                    data: { mapUrl: `${lat},${lng}` },
                });
                geocoded++;
                console.log(`📍 ${listing.title?.slice(0, 50) || listing.id} → ${lat}, ${lng}`);
            } else {
                failed++;
                console.log(`❌ No result for: ${addr}`);
            }
            // Nominatim requires 1 request per second
            await new Promise(r => setTimeout(r, 1100));
        } catch (e) {
            failed++;
            console.log(`⚠️  Error: ${e.message}`);
        }
    }

    console.log(`\n================================================`);
    console.log(`✅ Geocoded: ${geocoded}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`================================================`);
    await prisma.$disconnect();
    process.exit(0);
}

main().catch(async e => {
    console.error('Script error:', e);
    await prisma.$disconnect();
    process.exit(1);
});
