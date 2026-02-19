import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function fetchAndSaveListings() {
    try {
        console.log('🚀 Fetching Mercado Libre listings (Public API)...\n');

        // Use PUBLIC API - no authentication required!
        console.log('🔍 Searching for real estate in Chihuahua...');
        const response = await axios.get('https://api.mercadolibre.com/sites/MLM/search', {
            params: {
                category: 'MLM1459', // Real Estate
                state: 'MLM-CHH',    // Chihuahua state
                limit: 20
            }
        });

        const results = response.data.results;
        console.log(`✅ Found ${results.length} listings!\n`);

        // Save to database
        let saved = 0;
        let skipped = 0;

        for (const item of results) {
            try {
                // Check if already exists
                const existing = await prisma.listing.findFirst({
                    where: { sourceId: item.id }
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // Prepare images
                const images = JSON.stringify(item.pictures?.map((p: any) => p.secure_url) || []);

                // Create listing
                await prisma.listing.create({
                    data: {
                        propertyId: `ML-${item.id}`,
                        title: item.title,
                        price: item.price || 0,
                        address: item.location?.city?.name || 'Chihuahua',
                        city: item.location?.city?.name || 'Chihuahua',
                        state: item.location?.state?.name || 'Chihuahua',
                        zipCode: '',
                        status: 'OBSERVED',
                        source: 'Mercado Libre',
                        sourceId: item.id,
                        images: images,
                        propertyType: 'HOUSE',
                        trustScore: 70
                    }
                });

                saved++;
                console.log(`✅ ${saved}. ${item.title.substring(0, 55)}...`);
                console.log(`   💰 $${item.price?.toLocaleString()} MXN`);

            } catch (err: any) {
                console.error(`❌ Error saving listing: ${err.message}`);
            }
        }

        console.log(`\n${'='.repeat(70)}`);
        console.log(`🎉 SUCCESS! Saved ${saved} new listings, skipped ${skipped} existing`);
        console.log(`${'='.repeat(70)}\n`);
        console.log('✨ Open http://localhost:3000/listings to see your Mercado Libre data!');

    } catch (error: any) {
        console.error('\n❌ ERROR:', error.message);
        if (error.response) {
            console.error('API Status:', error.response.status);
            console.error('API Response:', JSON.stringify(error.response.data, null, 2));
        }
    } finally {
        await prisma.$disconnect();
    }
}

fetchAndSaveListings();
