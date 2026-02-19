
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingSource } from '../types';

export const CanonicalDataPrecedenceRule: Rule = {
    id: 'CORE_002',
    name: 'Canonical Data Precedence',
    description: 'Ensures trusted sources are not overwritten by lower-trust sources.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED],
    priority: 90,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current;
        const previous = event.payload.previous;

        if (!previous || !current) return {
            ruleId: 'CORE_002',
            ruleName: 'Canonical Data Precedence',
            passed: true,
            severity: 'INFO',
            reasons: ['Not enough context'],
            actionRequired: { type: 'NONE', details: {} }
        };

        const previousSource = previous.source as ListingSource;
        const currentSource = current.source as ListingSource;

        // Hierarchy: MLS_FEED > MANUAL > SCRAPER
        // Simplified: If previous is MLS_FEED and current is SCRAPER, BLOCK.

        if (previousSource === ListingSource.MLS_FEED && currentSource === ListingSource.SCRAPER) {
            return {
                ruleId: 'CORE_002',
                ruleName: 'Canonical Data Precedence',
                passed: false,
                severity: 'ERROR',
                reasons: [`Blocked overwrite of high-trust source (${previousSource}) by low-trust source (${currentSource})`],
                actionRequired: { type: 'BLOCK', details: { source: currentSource, target: previousSource } }
            };
        }

        return {
            ruleId: 'CORE_002',
            ruleName: 'Canonical Data Precedence',
            passed: true,
            severity: 'INFO',
            reasons: [`Source transition ${previousSource} -> ${currentSource} is permitted`],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
