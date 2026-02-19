
import { prisma } from '../lib/prisma';
import { ruleEngineService } from '../rules/setup';
import { GovernanceEventType, ClaimType, ClaimStatus } from '../rules/types';
import { notificationService } from '../services/NotificationService';
import { v4 as uuidv4 } from 'uuid';

async function testClaimsFlowWithNotifications() {
    console.log('--- Starting Claims System & Notification Verification ---');

    const listingId = `TEST-NOTIFY-LISTING-${Date.now()}`;
    const ownerId = `TEST-OWNER-${Date.now()}`;

    // 1. Create User & Listing
    console.log('1. Creating Test Data...');
    try {
        await prisma.user.create({
            data: {
                id: ownerId,
                email: `owner-${Date.now()}@example.com`,
                firstName: 'Test',
                lastName: 'Owner'
            }
        });

        await prisma.listing.create({
            data: {
                id: listingId,
                propertyId: `PROP-${listingId}`,
                title: 'Notification Test Listing',
                status: 'ACTIVE',
                source: 'MANUAL',
                ownerId: ownerId,
                price: 500000,
                images: '[]',
                videos: '[]'
            }
        });
    } catch (e) {
        console.warn('Setup failed (might already exist):', e);
    }

    // 2. File Claim via Service Logic (simulating API)
    // We manually trigger the notification to test the service itself first, 
    // then we test the RuleEngine integration.

    console.log('2. Testing NotificationService direct call...');
    await notificationService.notifyOwnerClaimFiled(ownerId, listingId, 'OWNERSHIP');

    // 3. Trigger Rule Engine Event (Integration Test)
    console.log('3. Triggering Rule Engine (Suspend + Notify)...');

    // We need an event that causes SUSPENSION. 
    // OWNERSHIP claim triggers PublishSuspensionRule which returns AUTO_CORRECT status=SUSPENDED.
    // RuleEngineService should then see this, update DB, and call notificationService.notifyListingSuspended.

    const claimId = uuidv4();
    const event = {
        id: uuidv4(),
        type: GovernanceEventType.CLAIM_FILED,
        timestamp: new Date(),
        actorId: 'TEST-CLAIMANT',
        sourceId: 'API',
        payload: {
            id: claimId,
            listingId,
            claimantId: 'TEST-CLAIMANT',
            type: ClaimType.OWNERSHIP,
            status: ClaimStatus.OPEN,
            evidence: { notes: 'Mine!' }
        }
    };

    // Spy on console.log to verify output? Or just visual check.
    // Visual check is fine for this context.
    const { results, actionsExecuted } = await ruleEngineService.processEvent(event, { id: 'TEST-CLAIMANT' } as any);

    console.log('   Actions Executed:', actionsExecuted);

    // 4. Verify DB State
    const updated = await prisma.listing.findUnique({ where: { id: listingId } });
    console.log(`   Final Listing Status: ${updated?.status}`);

    if (updated?.status === 'SUSPENDED') {
        console.log('✅ Listing Suspended');
    } else {
        console.error('❌ Listing NOT Suspended');
    }

    // Cleanup
    await prisma.listing.delete({ where: { id: listingId } });
    await prisma.user.delete({ where: { id: ownerId } });

    console.log('--- Test Complete ---');
}

testClaimsFlowWithNotifications()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
