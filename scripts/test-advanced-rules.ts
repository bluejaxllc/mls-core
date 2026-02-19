
import { setupRuleEngine } from '../src/rules/setup';
import { GovernanceEventType, ListingStatus } from '../src/rules/types';
import { prisma } from '../src/lib/prisma';

async function main() {
    const { api: ruleEngineService } = setupRuleEngine();
    const adminUser = { id: 'admin-user', role: 'admin', trustLevel: 100 };

    console.log('--- STARTING ADVANCED RULE VERIFICATION ---');

    try {
        // --- TEST 1: Public Exposure Requirements ---
        console.log('\n--- TEST 1: Public Exposure Requirements ---');

        // 1. Create Incomplete Listing (Missing Price & Photos)
        const incompleteListing = await prisma.listing.create({
            data: {
                propertyId: `TEST-INC-${Date.now()}`,
                title: 'Incomplete Listing',
                description: 'Missing price and photos',
                address: '123 Test St', // Partial address
                price: 0, // Invalid
                status: 'DRAFT',
                source: 'MANUAL',
                images: JSON.stringify([]), // Empty
                ownerId: adminUser.id
            }
        });
        console.log(`Created Incomplete Listing: ${incompleteListing.id}`);

        // 2. Attempt to Publish (Status -> ACTIVE)
        const publishEvent = {
            id: `EVT-PUB-${Date.now()}`,
            type: GovernanceEventType.LISTING_UPDATED,
            timestamp: new Date(),
            actorId: adminUser.id,
            sourceId: 'API',
            payload: {
                listingId: incompleteListing.id,
                current: { ...incompleteListing, status: 'ACTIVE' }, // Target State
                previous: incompleteListing
            }
        };

        console.log('Attempting to publish incomplete listing...');
        const pubResults = await ruleEngineService.processEvent(publishEvent, adminUser);

        // Assert: Should Fail
        const publicRule = pubResults.results.find(r => r.ruleId === 'CORE_006');
        if (publicRule && !publicRule.passed && publicRule.actionRequired?.type === 'BLOCK') {
            console.log('✅ SUCCESS: Public Exposure Rule correctly BLOCKED publishing.');
            console.log('   Reasons:', publicRule.reasons);
        } else {
            console.error('❌ FAILURE: Public Exposure Rule did NOT block publishing.');
            console.log('   Result:', publicRule);
        }


        // --- TEST 2: Listing Version Immutability ---
        console.log('\n--- TEST 2: Listing Version Immutability ---');

        // 1. Create Verified Listing
        const verifiedListing = await prisma.listing.create({
            data: {
                propertyId: `TEST-VER-${Date.now()}`,
                title: 'Verified Luxury Home',
                description: 'Perfect condition',
                address: '456 Verified Blvd, Chihuahua',
                price: 5000000,
                status: 'VERIFIED', // Immutable State
                source: 'MANUAL',
                images: JSON.stringify(['img1.jpg']),
                ownerId: adminUser.id
            }
        });
        console.log(`Created Verified Listing: ${verifiedListing.id}`);

        // 2. Attempt to Modify Price (Immutable Field)
        const previousState = { ...verifiedListing, images: JSON.parse(verifiedListing.images as string) };
        const targetState = { ...previousState, price: 1000 }; // Massive price drop attempt

        const updateEvent = {
            id: `EVT-MUT-${Date.now()}`,
            type: GovernanceEventType.LISTING_UPDATED,
            timestamp: new Date(),
            actorId: adminUser.id, // Even Admin should be warned/blocked depending on config
            sourceId: 'API',
            payload: {
                listingId: verifiedListing.id,
                current: targetState,
                previous: previousState
            }
        };

        console.log('Attempting to modify PRICE on VERIFIED listing...');
        const mutResults = await ruleEngineService.processEvent(updateEvent, adminUser);

        // Assert: Should Fail (or at least Warn/Block)
        // CORE_001 is ListingVersionImmutabilityRule
        const immutabilityRule = mutResults.results.find(r => r.ruleId === 'CORE_001');

        if (immutabilityRule && !immutabilityRule.passed) {
            console.log('✅ SUCCESS: Immutability Rule correctly flagged the change.');
            console.log('   Action:', immutabilityRule.actionRequired?.type);
            console.log('   Reasons:', immutabilityRule.reasons);
        } else {
            console.error('❌ FAILURE: Immutability Rule allowed the change.');
            console.log('   Result:', immutabilityRule);
        }

    } catch (error) {
        console.error('Test execution failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
