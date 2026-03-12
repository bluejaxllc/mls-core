import { PrismaClient } from '../prisma/generated/client-intelligence';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.MLS_INTELLIGENCE_URL || 'postgres://default:P7A4rOhTqFoc@ep-shiny-dew-a4tz15a9.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
        }
    }
});

async function main() {
    console.log('Connecting to Intelligence DB...');
    await prisma.$connect();
    console.log('Upserting new sources into intelligence DB...');

    await prisma.sourceProfile.upsert({
        where: { name: 'Inmuebles24' },
        update: { isEnabled: true },
        create: { name: 'Inmuebles24', type: 'PORTAL', baseUrl: 'https://www.inmuebles24.com', trustScore: 75, isEnabled: true, config: '{}' }
    });
    console.log('✅ Inmuebles24 upserted');

    await prisma.sourceProfile.upsert({
        where: { name: 'Lamudi' },
        update: { isEnabled: true },
        create: { name: 'Lamudi', type: 'PORTAL', baseUrl: 'https://www.lamudi.com.mx', trustScore: 70, isEnabled: true, config: '{}' }
    });
    console.log('✅ Lamudi upserted');

    await prisma.sourceProfile.upsert({
        where: { name: 'Vivanuncios' },
        update: { isEnabled: true },
        create: { name: 'Vivanuncios', type: 'PORTAL', baseUrl: 'https://www.vivanuncios.com.mx', trustScore: 70, isEnabled: true, config: '{}' }
    });
    console.log('✅ Vivanuncios upserted');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
