const { PrismaClient } = require('./src/generated/client-core');
const { hashSync } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Seeding uncertified test user...");
        const hashedPassword = hashSync('test1234', 10);

        await prisma.user.upsert({
            where: { email: 'uncertified@bluejax.test' },
            create: {
                id: 'agent-uncertified-999',
                name: 'Uncertified Tester',
                email: 'uncertified@bluejax.test',
                password: hashedPassword,
                role: 'user',
                isCertified: false,
                accountStatus: 'pending'
            },
            update: {
                password: hashedPassword,
                isCertified: false,
                accountStatus: 'pending'
            }
        });

        // Ensure they have NO listings so they hit the wall.
        await prisma.listing.deleteMany({
            where: { ownerId: 'agent-uncertified-999' }
        });

        console.log("Test user `uncertified@bluejax.test` / `test1234` is ready and UNLOCKED for testing.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
