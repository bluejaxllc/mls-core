const { PrismaClient } = require('./prisma/generated/client-intelligence');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgres://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
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
