
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus, ClaimType } from '../types';

export const PublishSuspensionRule: Rule = {
    id: 'CLAIM_002',
    name: 'Publish Suspension Rule',
    description: 'Suspends public visibility of listings when serious claims are filed.',
    triggerEvents: [GovernanceEventType.CLAIM_FILED],
    priority: 100,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        // Event payload is the CLAIM object
        const claim = event.payload;
        const claimType = claim.type as ClaimType;
        const targetListingId = claim.listingId;

        if (claimType === ClaimType.OWNERSHIP || claimType === ClaimType.DUPLICATE) {
            return {
                ruleId: 'CLAIM_002',
                ruleName: 'Publish Suspension Rule',
                // Rule logic passed (we successfully identified the action needed, even if the "state" is bad)
                // Or we could say passed=false to indicate "The listing is in a bad state".
                // Let's use passed=false to signal an intervention is needed.
                passed: false,
                severity: 'WARNING',
                reasons: [`Serious claim (${claimType}) filed against listing ${targetListingId}`],
                actionRequired: {
                    type: 'AUTO_CORRECT',
                    details: {
                        targetId: targetListingId,
                        field: 'status',
                        newValue: ListingStatus.SUSPENDED
                    }
                }
            };
        }

        return {
            ruleId: 'CLAIM_002',
            ruleName: 'Publish Suspension Rule',
            passed: true,
            severity: 'INFO',
            reasons: ['Claim type does not warrant automatic suspension'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
