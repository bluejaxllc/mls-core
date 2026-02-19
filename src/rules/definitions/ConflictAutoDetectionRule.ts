
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingSource } from '../types';

export const ConflictAutoDetectionRule: Rule = {
    id: 'TRUST_003',
    name: 'Conflict Auto-Detection',
    description: 'Detects significant data drift between conflicting sources of similar trust.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED],
    priority: 50, // Run after blockers

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current;
        const previous = event.payload.previous;

        if (!previous || !current) return {
            ruleId: 'TRUST_003', ruleName: 'Conflict Auto-Detection', passed: true, severity: 'INFO',
            reasons: [], actionRequired: { type: 'NONE', details: {} }
        };

        const previousSource = (previous.source || ListingSource.MANUAL) as ListingSource;
        const currentSource = (current.source || ListingSource.MANUAL) as ListingSource;

        // Only check if sources are effectively the same entity
        // If the sourceId is the same, it's just a standard update, not a conflict between sources.
        if (previous.sourceId === current.sourceId) {
            return {
                ruleId: 'TRUST_003', ruleName: 'Conflict Auto-Detection', passed: true, severity: 'INFO',
                reasons: ['Same source entity update, skipping conflict check'], actionRequired: { type: 'NONE', details: {} }
            };
        }

        const previousTrust = context.services.trustService.getTrustScore(previousSource, previous.sourceId);
        const currentTrust = context.services.trustService.getTrustScore(currentSource, current.sourceId);

        // If trust is similar (within tolerance), we check for drift.
        // If one is much higher, the Hierarchy rule handles it (Block or Allow).
        // Conflict is for ambiguous cases.
        if (Math.abs(currentTrust - previousTrust) <= 20) {

            // Check for Price Drift > 20%
            if (current.price != null && previous.price != null && previous.price > 0) {
                const diff = Math.abs(current.price - previous.price);
                const pcent = diff / previous.price;

                if (pcent > 0.20) {
                    return {
                        ruleId: 'TRUST_003',
                        ruleName: 'Conflict Auto-Detection',
                        passed: true, // It passes validation, but we raise a flag for review
                        severity: 'WARNING',
                        reasons: [`Significant price drift detected (${(pcent * 100).toFixed(1)}%) between similar trust sources`],
                        actionRequired: {
                            type: 'FLAG',
                            details: {
                                issue: 'PRICE_DRIFT',
                                message: `Price changed from ${previous.price} to ${current.price}`,
                                drift: pcent
                            }
                        }
                    };
                }
            }
        }

        return {
            ruleId: 'TRUST_003',
            ruleName: 'Conflict Auto-Detection',
            passed: true,
            severity: 'INFO',
            reasons: ['No conflicts detected'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
