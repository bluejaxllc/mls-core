const { PrismaClient } = require('./src/generated/client-core');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Resetting newagent@test.com...");
        const user = await prisma.user.updateMany({
            where: { email: 'newagent@test.com' },
            data: { isCertified: false, accountStatus: 'pending' }
        });
        console.log(`Updated ${user.count} users.`);

        const listings = await prisma.listing.deleteMany({
            where: { ownerId: 'agent-123' }
        });
        console.log(`Deleted ${listings.count} listings.`);

        console.log("Reset complete.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
