
import { prisma } from '../lib/prisma';
import { ruleEngineService } from './setup';
import { GovernanceEventType } from './types';

async function testAutoClaim() {
    console.log('--- Starting Auto-Claim Verification ---');

    const timestamp = Date.now();
    const propertyId = `PROP-DUP-${timestamp}`;
    const originalId = `ORIGINAL-${timestamp}`;
    const duplicateId = `DUP-${timestamp}`;
    const ownerId = `OWNER-${timestamp}`;

    // 1. Setup: Create Owner and Original Active Listing
    console.log('1. Setting up Original Listing...');
    await prisma.user.create({
        data: { id: ownerId, email: `owner-${timestamp}@test.com`, firstName: 'Test', lastName: 'Owner' }
    });

    await prisma.listing.create({
        data: {
            id: originalId,
            propertyId: propertyId,
            title: 'Original Property',
            status: 'ACTIVE',
            source: 'MANUAL',
            ownerId: ownerId,
            price: 1000000,
            images: '[]',
            videos: '[]'
        }
    });

    // 2. Trigger Event: Create Duplicate Listing
    // The PrimaryActiveListingRule might BLOCK it, but we want to see if AutoClaimCreationRule suggests a CLAIM.
    // If PrimaryActiveListingRule blocks it, the Action might still be processed if we designed the engine to allow side effects even on block?
    // Actually, `RuleEngineService.executeActions` iterates over ALL results.
    // Even if one rule blocks, another might return CREATE_CLAIM.
    // Let's verify this behavior.

    console.log('2. Triggering Event with Duplicate Property ID...');
    const duplicatePayload = {
        id: duplicateId,
        propertyId: propertyId, // SAME PROP ID
        title: 'Duplicate Property',
        status: 'ACTIVE',
        source: 'MANUAL', // Different source might trigger different rules, but MANUAL vs MANUAL checks duplicates
        ownerId: ownerId, // Same owner for simplicity, but logic works regardless
    };

    const event = {
        id: `evt-${timestamp}`,
        type: GovernanceEventType.LISTING_CREATED,
        timestamp: new Date(),
        actorId: 'SECOND-AGENT',
        sourceId: 'MANUAL',
        payload: duplicatePayload
    };

    const { results, actionsExecuted } = await ruleEngineService.processEvent(event, { id: 'SECOND-AGENT' } as any);

    console.log('   Results:', results.map(r => `${r.ruleName}: ${r.severity} - ${r.actionRequired?.type}`));
    console.log('   Actions Executed:', actionsExecuted);

    // 3. Verify Claim Creation
    const claims = await prisma.claim.findMany({
        where: { listingId: originalId, type: 'DUPLICATE' }
    });

    console.log(`   Found ${claims.length} claims for Original Listing ${originalId}`);

    if (claims.length > 0) {
        console.log('✅ Auto-Claim Successfully Created!');
        console.log('   Claim Evidence:', claims[0].evidence);
    } else {
        console.error('❌ No Auto-Claim Created.');
    }

    // Cleanup
    await prisma.claim.deleteMany({ where: { listingId: originalId } });
    await prisma.listing.deleteMany({ where: { propertyId: propertyId } });
    await prisma.user.delete({ where: { id: ownerId } });

    console.log('--- Test Complete ---');
}

testAutoClaim()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
