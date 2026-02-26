import { prismaIntelligence as prisma } from '../src/lib/intelligencePrisma';

async function main() {
    console.log("Seeding Facebook Marketplace Source...");

    // Check if the source profile already exists
    const existing = await prisma.sourceProfile.findFirst({
        where: { name: 'Facebook Marketplace (Apify)' }
    });

    if (existing) {
        console.log("Source already exists:", existing.id);
        return;
    }

    // Create the Facebook profile so the UI can trigger it
    const profile = await prisma.sourceProfile.create({
        data: {
            name: 'Facebook Marketplace (Apify)',
            type: 'CLASSIFIEDS',
            baseUrl: 'https://www.facebook.com/marketplace/chihuahua/propertyrentals/',
            isEnabled: true,
            trustScore: 85,
            config: JSON.stringify({
                selectors: {
                    listWrapper: '.marketplace-mock',
                    listItem: 'div',
                    listingTitle: 'span',
                    listingPrice: 'span'
                },
                pagination: {
                    strategy: 'SCROLL',
                    maxPages: 2
                },
                antiBot: {
                    useProxies: true,
                    delayRange: [3000, 8000],
                    stealthMode: true
                }
            })
        }
    });

    console.log(`Successfully created source profile: ${profile.id}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
