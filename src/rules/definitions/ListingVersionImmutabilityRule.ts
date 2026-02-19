
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus } from '../types';

export const ListingVersionImmutabilityRule: Rule = {
    id: 'CORE_001',
    name: 'Listing Version Immutability',
    description: 'Prevents modification of critical fields on VERIFIED or ACTIVE listings without versioning.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED],
    priority: 100,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current;
        const previous = event.payload.previous;

        if (!previous || !current) {
            // If we don't have previous state for an update, we can't enforce immutability strictly, 
            // assuming it's an integrity error or a non-standard call.
            return {
                ruleId: 'CORE_001',
                ruleName: 'Listing Version Immutability',
                passed: true, // Allow for now, or could BLOCK
                severity: 'WARNING',
                reasons: ['Missing previous or current state in update event'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        if (previous.status !== ListingStatus.VERIFIED && previous.status !== ListingStatus.ACTIVE) {
            return {
                ruleId: 'CORE_001',
                ruleName: 'Listing Version Immutability',
                passed: true,
                severity: 'INFO',
                reasons: [`Previous status was ${previous.status}, immutability check skipped`],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        const immutableFields = ['price', 'address', 'legalDescription'];
        const violations = [];

        for (const field of immutableFields) {
            if (JSON.stringify(current[field]) !== JSON.stringify(previous[field])) {
                violations.push(field);
            }
        }

        if (violations.length > 0) {
            return {
                ruleId: 'CORE_001',
                ruleName: 'Listing Version Immutability',
                passed: false,
                severity: 'ERROR',
                reasons: [`Attempted to modify immutable fields: ${violations.join(', ')} on a ${previous.status} listing`],
                actionRequired: { type: 'BLOCK', details: { fields: violations } }
            };
        }

        return {
            ruleId: 'CORE_001',
            ruleName: 'Listing Version Immutability',
            passed: true,
            severity: 'INFO',
            reasons: ['No immutable fields modified'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
