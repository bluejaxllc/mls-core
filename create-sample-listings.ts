import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample Chihuahua real estate data (realistic MX listings)
const sampleListings = [
    {
        title: "Casa en Venta Residencial Campestre Chihuahua",
        price: 3500000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Residencial Campestre, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_123456-MLM12345678910-012023-F.webp"]
    },
    {
        title: "Departamento en Venta Centro Chihuahua 2 Recámaras",
        price: 1850000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Centro, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_234567-MLM23456789012-022023-F.webp"]
    },
    {
        title: "Terreno Comercial en Venta Periferico de la Juventud",
        price: 5200000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Periférico de la Juventud, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_345678-MLM34567890123-032023-F.webp"]
    },
    {
        title: "Casa en Venta Col. San Felipe 3 Recámaras Amplia",
        price: 2750000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Col. San Felipe, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_456789-MLM45678901234-042023-F.webp"]
    },
    {
        title: "Local Comercial en Renta Zona Centro Chihuahua",
        price: 850000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Av. Juárez, Centro, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_567890-MLM56789012345-052023-F.webp"]
    },
    {
        title: "Casa Nueva en Venta Fracc. Quintas del Valle",
        price: 4200000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Quintas del Valle, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_678901-MLM67890123456-062023-F.webp"]
    },
    {
        title: "Departamento Amueblado en Renta Col. Nombre de Dios",
        price: 1250000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Col. Nombre de Dios, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_789012-MLM78901234567-072023-F.webp"]
    },
    {
        title: "Casa en Venta Valle Escondido 4 Recámaras Jardín",
        price: 5800000,
        city: "Chihuahua",
        state: "Chihuahua",
        address: "Valle Escondido, Chihuahua",
        images: ["https://http2.mlstatic.com/D_NQ_NP_2X_890123-MLM89012345678-082023-F.webp"]
    }
];

async function createSampleListings() {
    try {
        console.log('🏗️  Creating sample Mercado Libre listings...\n');

        let created = 0;

        for (const listing of sampleListings) {
            try {
                await prisma.listing.create({
                    data: {
                        propertyId: `ML-SAMPLE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        title: listing.title,
                        price: listing.price,
                        address: listing.address,
                        city: listing.city,
                        state: listing.state,
                        zipCode: '',
                        status: 'OBSERVED',
                        source: 'Mercado Libre (Sample)',
                        sourceId: `SAMPLE-${created + 1}`,
                        images: JSON.stringify(listing.images),
                        propertyType: 'HOUSE',
                        trustScore: 75
                    }
                });

                created++;
                console.log(`✅ ${created}. ${listing.title}`);
                console.log(`   💰 $${listing.price.toLocaleString()} MXN\n`);

            } catch (err: any) {
                if (err.code === 'P2002') {
                    console.log(`⏭️  Skipped (duplicate): ${listing.title}\n`);
                } else {
                    console.error(`❌ Error: ${err.message}\n`);
                }
            }
        }

        console.log(`${'='.repeat(70)}`);
        console.log(`🎉 Created ${created} sample listings!`);
        console.log(`${'='.repeat(70)}\n`);
        console.log('✨ Open http://localhost:3000/listings to see them NOW!');
        console.log('\n📝 Note: These are SAMPLE listings since ML API is currently blocked.');
        console.log('   Once ML access is restored, run fetch-ml-listings.ts for real data.');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createSampleListings();
