const { PrismaClient } = require('@prisma/client-core');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgres://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
        }
    }
});

async function verify() {
    try {
        const count = await prisma.listing.count({
            where: { mapUrl: { not: null, not: '' } }
        });
        const total = await prisma.listing.count();

        console.log(`✅ VERIFICATION SUCCESS:`);
        console.log(`   Properties with coordinates: ${count} / ${total}`);

        const sample = await prisma.listing.findFirst({
            where: { mapUrl: { not: null, not: '' } },
            select: { title: true, mapUrl: true }
        });
        console.log(`   Sample: ${sample.title} -> ${sample.mapUrl}`);
    } catch (e) {
        console.error("Verification failed:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
