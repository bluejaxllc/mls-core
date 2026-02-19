
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus } from '../types';

export const PrimaryActiveListingRule: Rule = {
    id: 'CORE_005',
    name: 'Primary Active Listing Enforcement',
    description: 'Ensures only one ACTIVE listing exists per property.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 95,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload;
        const status = current.status;
        const propertyId = current.propertyId;
        const currentListingId = current.id; // Correctly get ID from the listing object

        if (status !== ListingStatus.ACTIVE) {
            return {
                ruleId: 'CORE_005',
                ruleName: 'Primary Active Listing Enforcement',
                passed: true,
                severity: 'INFO',
                reasons: ['Listing is not ACTIVE, skipping duplicate check'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        // Check for existing active listing
        const existingActiveId = await context.services.findActiveListingByPropertyId(propertyId);

        // If an existing ID is found, and it is NOT the current one (in case of update), block.
        // Note: handling 'update' where we are just saving the same active listing needs care if the service returns itself.
        if (existingActiveId && existingActiveId !== currentListingId) {
            return {
                ruleId: 'CORE_005',
                ruleName: 'Primary Active Listing Enforcement',
                passed: false,
                severity: 'ERROR',
                reasons: [`Another ACTIVE listing (${existingActiveId}) already exists for property ${propertyId}`],
                actionRequired: { type: 'BLOCK', details: { existingActiveId } }
            };
        }

        return {
            ruleId: 'CORE_005',
            ruleName: 'Primary Active Listing Enforcement',
            passed: true,
            severity: 'INFO',
            reasons: ['No duplicate active listings found'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
