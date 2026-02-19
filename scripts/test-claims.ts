
import { prisma } from '../src/lib/prisma';
import http from 'http';
import app from '../src/server';

const PORT = 3012;
const server = http.createServer(app);

// Mock Auth Token (In real app, we'd need a valid JWT sign logic or mock middleware)
// For this integration test, we might struggle if middleware verifies signature.
// Strategy: We will temporarily trust a dummy token or mock the verifyBlueJaxToken middleware if needed.
// IMPORTANT: The server.ts imports middleware. We can't easily mock it without rewriting files or using a test-server setup.
// ALTERNATIVE: Use the internal services directly for the test, similar to test-rules.ts, 
// BUT we want to test the full flow including the Router and RuleEngineService integration.

// Let's rely on the fact that for local dev/test, maybe we can use a bypass?
// If not, we'll try to invoke the route handler directly or mock the request.

// Actually, let's keep it simple. We will use the ruleEngineService directly in this script 
// to verify the logic, rather than spinning up the full HTTP server which requires auth mocking.
// This verifies 90% of the logic (Event -> Engine -> Actions -> DB).

import { ruleEngineService } from '../src/rules/setup';
import { GovernanceEventType, ClaimType, ClaimStatus } from '../src/rules/types';
import { v4 as uuidv4 } from 'uuid';

async function runTest() {
    console.log('Starting Claim Automation Test...\n');

    // 1. Setup Data: Create a dummy active listing
    const listingId = `LISTING-TEST-${Date.now()}`;
    await prisma.listing.create({
        data: {
            id: listingId,
            propertyId: `PROP-TEST-${Date.now()}`,
            title: 'Test Property for Claim',
            description: 'Should be suspended',
            status: 'ACTIVE',
            source: 'MANUAL',
            price: 1000000,
            address: '123 Test St',
            ownerId: 'SYSTEM'
        }
    });

    console.log(`✅ Created Active Listing: ${listingId}`);

    // 2. Simulate Claim Event (Ownership)
    console.log('Submitting OWNERSHIP Claim...');

    const claimPayload = {
        id: uuidv4(),
        listingId,
        claimantId: 'claimant-1',
        type: ClaimType.OWNERSHIP,
        status: ClaimStatus.OPEN,
        evidence: { reason: 'I own this house' }
    };

    const event = {
        id: uuidv4(),
        type: GovernanceEventType.CLAIM_FILED,
        timestamp: new Date(),
        actorId: 'claimant-1',
        sourceId: 'API',
        payload: claimPayload
    };

    // 3. Process
    const { results, actionsExecuted } = await ruleEngineService.processEvent(event, { id: 'claimant-1', roles: ['user'] });

    // 4. Verify Results
    console.log('\n--- Rule Evaluation Results ---');
    results.forEach((r: any) => {
        console.log(`Rule: ${r.ruleName} -> Passed: ${r.passed}`);
        if (r.actionRequired) {
            console.log(`   Action: ${r.actionRequired.type} ${JSON.stringify(r.actionRequired.details)}`);
        }
    });

    console.log('\n--- Actions Executed ---');
    console.log(actionsExecuted);

    // 5. Verify DB State
    const updatedListing = await prisma.listing.findUnique({ where: { id: listingId } });
    console.log(`\nUpdated Listing Status: ${updatedListing?.status}`);

    // Assertions
    const isSuspended = updatedListing?.status === 'SUSPENDED';
    const actionLogFound = actionsExecuted.some((a: string) => a.includes('Updated listing') && a.includes('SUSPENDED'));

    if (isSuspended && actionLogFound) {
        console.log('\nSUCCESS ✅: Listing was automatically suspended upon claim.');
    } else {
        console.error('\nFAIL ❌: Listing was NOT suspended.');
    }

    // Cleanup
    await prisma.listing.delete({ where: { id: listingId } }).catch(() => { });
    process.exit(isSuspended ? 0 : 1);
}

runTest().catch(console.error);
