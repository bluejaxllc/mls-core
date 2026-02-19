
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ClaimResolution, ListingStatus } from '../types';

export const ClaimResolutionRule: Rule = {
    id: 'CLAIM_003',
    name: 'Claim Resolution Enforcement',
    description: 'Enforces actions based on claim resolution outcomes.',
    triggerEvents: [GovernanceEventType.CLAIM_RESOLVED],
    priority: 100,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const claim = event.payload;
        const resolution = claim.resolution as ClaimResolution;
        const targetListingId = claim.listingId;

        if (resolution === ClaimResolution.UPHOLD_CLAIM) {
            // Claimant won. The target listing is invalid/infringing.
            return {
                ruleId: 'CLAIM_003',
                ruleName: 'Claim Resolution Enforcement',
                passed: false, // Action required
                severity: 'CRITICAL',
                reasons: [`Claim upheld against listing ${targetListingId}`],
                actionRequired: {
                    type: 'AUTO_CORRECT', // Could be BLOCK if this was an update, but this is a lifecycle event.
                    details: {
                        targetId: targetListingId,
                        field: 'status',
                        newValue: ListingStatus.ARCHIVED // Or DELETE
                    }
                }
            };
        } else if (resolution === ClaimResolution.REJECT_CLAIM) {
            // Claim rejected. Restore listing if it was suspended.
            return {
                ruleId: 'CLAIM_003',
                ruleName: 'Claim Resolution Enforcement',
                passed: false,
                severity: 'INFO',
                reasons: ['Claim rejected, restoring listing'],
                actionRequired: {
                    type: 'AUTO_CORRECT',
                    details: {
                        targetId: targetListingId,
                        field: 'status',
                        newValue: ListingStatus.ACTIVE // TODO: In V2, restore to previous status from audit log
                    }
                }
            };
        }

        return {
            ruleId: 'CLAIM_003',
            ruleName: 'Claim Resolution Enforcement',
            passed: true,
            severity: 'INFO',
            reasons: ['No resolution action defined'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
