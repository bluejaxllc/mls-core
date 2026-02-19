
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
                // Rule logic: Serious claims warrant automatic suspension

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
