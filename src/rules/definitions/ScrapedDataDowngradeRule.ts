
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus, ListingSource } from '../types';

export const ScrapedDataDowngradeRule: Rule = {
    id: 'CORE_003',
    name: 'Scraped Data Downgrade',
    description: 'Automatically downgrades or flags scraped data to ensure manual review.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 80,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        // For creation, payload is the listing. For update, payload has { previous, current }.
        const listing = event.payload.current ? event.payload.current : event.payload;

        const source = listing.source as ListingSource;
        const status = listing.status as ListingStatus;

        if (source === ListingSource.SCRAPER) {
            // Scraped data must always be reviewed before becoming ACTIVE or VERIFIED
            if (status === ListingStatus.VERIFIED || status === ListingStatus.ACTIVE) {
                return {
                    ruleId: 'CORE_003',
                    ruleName: 'Scraped Data Downgrade',
                    passed: false,
                    severity: 'WARNING',
                    reasons: ['Scraped data validation: Downgrading to PENDING_REVIEW for manual verification'],
                    actionRequired: {
                        type: 'AUTO_CORRECT',
                        details: {
                            targetId: listing.id,
                            field: 'status',
                            oldValue: status,
                            newValue: ListingStatus.PENDING_REVIEW
                        }
                    }
                };
            }
        }

        return {
            ruleId: 'CORE_003',
            ruleName: 'Scraped Data Downgrade',
            passed: true,
            severity: 'INFO',
            reasons: ['Source trust level acceptable for current status'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
