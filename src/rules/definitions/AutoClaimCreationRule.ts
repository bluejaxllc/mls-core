
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus } from '../types';

export const AutoClaimCreationRule: Rule = {
    id: 'CLAIM_001',
    name: 'Auto-Claim Creation',
    description: 'Automatically triggers a claim when a duplicate listing requires resolution.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 70,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload;
        const listingId = current.id || event.payload.id || event.id; // Correctly identifying the listing ID is crucial.
        const propertyId = current.propertyId;
        const actorId = event.actorId;
        const brokerId = current.brokerId;

        if (!propertyId) return { ruleId: 'CLAIM_001', ruleName: 'Auto-Claim Creation', passed: true, severity: 'INFO', reasons: [], actionRequired: { type: 'NONE', details: {} } };

        // Check for duplicates
        // Using the same service as PrimaryActiveListingRule
        const existingActiveId = await context.services.findActiveListingByPropertyId(propertyId);

        if (existingActiveId && existingActiveId !== listingId) {
            // DUPLICATE FOUND.

            // If the brokers are different (implied by checking if actor owns the existing listing, but better to check broker ownership directly if we had that data service)
            // For simulation, let's assume we detect it's a "Hostile" or "Conflicting" duplicate.
            // If we are creating a new active listing that is a duplicate, the PrimaryActiveListing rule BLOCKS it. 
            // So this rule is more for when it is NOT blocked (e.g. maybe it's DRAFT status but we want to warn), OR to actually CREATE the claim object parallel to the block.
            // Let's assume this rule runs to suggest creating a claim record for the dispute.

            return {
                ruleId: 'CLAIM_001',
                ruleName: 'Auto-Claim Creation',
                passed: true,
                severity: 'WARNING',
                reasons: [`Potential duplicate of active listing ${existingActiveId}. A claim should be opened if this is a dispute.`],
                actionRequired: {
                    type: 'CREATE_CLAIM',
                    details: {
                        type: 'DUPLICATE',
                        targetListingId: existingActiveId,
                        claimantId: 'SYSTEM',
                        evidence: { duplicateOf: listingId }
                    }
                }
            };
        }

        return {
            ruleId: 'CLAIM_001',
            ruleName: 'Auto-Claim Creation',
            passed: true,
            severity: 'INFO',
            reasons: ['No claim conditions met'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
