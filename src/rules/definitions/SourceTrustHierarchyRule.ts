
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingSource } from '../types';

export const SourceTrustHierarchyRule: Rule = {
    id: 'TRUST_001',
    name: 'Source Trust Hierarchy',
    description: 'Prevents lower-trust sources from overwriting data from higher-trust sources.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED],
    priority: 95,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current;
        const previous = event.payload.previous;

        if (!previous || !current) return {
            ruleId: 'TRUST_001', ruleName: 'Source Trust Hierarchy', passed: true, severity: 'INFO',
            reasons: ['No previous state'], actionRequired: { type: 'NONE', details: {} }
        };

        const previousSource = (previous.source || ListingSource.MANUAL) as ListingSource;
        const currentSource = (current.source || ListingSource.MANUAL) as ListingSource;

        const previousTrust = context.services.trustService.getTrustScore(previousSource, previous.sourceId);
        const currentTrust = context.services.trustService.getTrustScore(currentSource, current.sourceId);

        // If new trust score is LOWER than old trust score, we potentially BLOCK.
        if (currentTrust < previousTrust) {
            // Detect what changed.
            const changedFields = [];
            for (const key in current) {
                // Simplification: checking top-level keys. In real app need deep diff.
                // Also need to ignore metadata like 'updatedAt', 'source', etc.
                if (key !== 'source' && key !== 'updatedAt' && JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
                    // EXCEPTION: If the previous value was null/undefined/empty, we ALLOW enrichment.
                    const oldVal = previous[key];
                    if (oldVal !== null && oldVal !== undefined && oldVal !== '') {
                        changedFields.push(key);
                    }
                }
            }

            if (changedFields.length > 0) {
                return {
                    ruleId: 'TRUST_001',
                    ruleName: 'Source Trust Hierarchy',
                    passed: false,
                    severity: 'ERROR',
                    reasons: [`Source with trust ${currentTrust} cannot overwrite non-empty fields from source with trust ${previousTrust}`],
                    actionRequired: {
                        type: 'BLOCK',
                        details: {
                            currentTrust,
                            previousTrust,
                            fields: changedFields,
                            message: 'To update this data, use a source of equal or higher trust.'
                        }
                    }
                };
            }
        }

        return {
            ruleId: 'TRUST_001',
            ruleName: 'Source Trust Hierarchy',
            passed: true,
            severity: 'INFO',
            reasons: ['Trust hierarchy respected'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
