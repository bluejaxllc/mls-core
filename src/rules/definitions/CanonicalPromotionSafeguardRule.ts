
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus, TrustLevel, ListingSource } from '../types';

export const CanonicalPromotionSafeguardRule: Rule = {
    id: 'TRUST_002',
    name: 'Canonical Promotion Safeguard',
    description: 'Prevents low-trust sources from creating VERIFIED or CANONICAL listings.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 90,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload;
        const source = (current.source || ListingSource.MANUAL) as ListingSource;
        const status = current.status as ListingStatus;

        const trustScore = context.services.trustService.getTrustScore(source, current.sourceId);

        // If source is below TRUSTED level (e.g. Scraper or Unverified user), it cannot set STATUS to VERIFIED.
        if (trustScore < TrustLevel.TRUSTED) {
            if (status === ListingStatus.VERIFIED) {
                return {
                    ruleId: 'TRUST_002',
                    ruleName: 'Canonical Promotion Safeguard',
                    passed: false,
                    severity: 'WARNING',
                    reasons: [`Source with trust score ${trustScore} is insufficient for VERIFIED status (min ${TrustLevel.TRUSTED})`],
                    actionRequired: {
                        type: 'AUTO_CORRECT', // Prefer auto-downgrade over blocking if possible, but BLOCK is safer for integrity.
                        // Let's use BLOCK for explicit status setting, or logic to change it.
                        // The previous rule 'ScrapedDataDowngrade' does similar, but this is broader based on Score.
                        details: {
                            field: 'status',
                            allowedStatus: ListingStatus.PENDING_REVIEW
                        }
                    }
                };
            }
        }

        return {
            ruleId: 'TRUST_002',
            ruleName: 'Canonical Promotion Safeguard',
            passed: true,
            severity: 'INFO',
            reasons: ['Trust score sufficient for status'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
