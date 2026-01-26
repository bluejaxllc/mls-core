
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus, ListingSource } from '../types';

export const ScrapedDataDowngradeRule: Rule = {
    id: 'CORE_003',
    name: 'Scraped Data Downgrade',
    description: 'Automatically downgrades or flags scraped data to ensure manual review.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 80,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload; // fallback for creation where current might be root
        const source = current.source as ListingSource;
        const status = current.status as ListingStatus;

        if (source === ListingSource.SCRAPER) {
            if (status === ListingStatus.VERIFIED || status === ListingStatus.ACTIVE) {
                return {
                    ruleId: 'CORE_003',
                    ruleName: 'Scraped Data Downgrade',
                    passed: false,
                    severity: 'WARNING',
                    reasons: ['Scraped data cannot be immediately VERIFIED or ACTIVE'],
                    actionRequired: {
                        type: 'AUTO_CORRECT',
                        details: {
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
