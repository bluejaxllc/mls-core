
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingSource } from '../types';

export const SourceTrustHierarchyRule: Rule = {
    id: 'TRUST_001',
    name: 'Source Trust Hierarchy',
    description: 'Prevents lower-trust sources from overwriting data from higher-trust sources.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED],
    priority: 95,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current; // The New State (Proposed)
        const previous = event.payload.previous; // The Old State (Existing)

        // different logic for create vs update
        if (event.type === GovernanceEventType.LISTING_CREATED || !previous) {
            return {
                ruleId: 'TRUST_001',
                ruleName: 'Source Trust Hierarchy',
                passed: true,
                severity: 'INFO',
                reasons: ['New listing or no previous state'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        const previousSource = (previous.source || ListingSource.MANUAL) as ListingSource;
        const currentSource = (current.source || ListingSource.MANUAL) as ListingSource;
        const previousSourceId = previous.sourceId;
        const currentSourceId = current.sourceId;

        const previousTrust = context.services.trustService.getTrustScore(previousSource, previousSourceId);
        const currentTrust = context.services.trustService.getTrustScore(currentSource, currentSourceId);

        // If new trust score is >= old trust score, allow everything.
        if (currentTrust >= previousTrust) {
            return {
                ruleId: 'TRUST_001',
                ruleName: 'Source Trust Hierarchy',
                passed: true,
                severity: 'INFO',
                reasons: [`Source trust ${currentTrust} >= ${previousTrust}`],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        // Trust is LOWER. We must check what changed.
        const changedFields: string[] = [];
        const protectedFields = ['price', 'title', 'description', 'address', 'propertyType'];

        for (const key of protectedFields) {
            const newVal = current[key];
            const oldVal = previous[key];

            // 1. If values are same, no issue.
            if (JSON.stringify(newVal) === JSON.stringify(oldVal)) continue;

            // 2. If old value was empty (null/undefined/empty string), allow enrichment.
            if (oldVal === null || oldVal === undefined || oldVal === '') {
                continue; // Enrichment allowed
            }

            // 3. If old value exists and is different -> BLOCK
            changedFields.push(key);
        }

        if (changedFields.length > 0) {
            return {
                ruleId: 'TRUST_001',
                ruleName: 'Source Trust Hierarchy',
                passed: false,
                severity: 'ERROR',
                reasons: [`Low-trust source (${currentSource}) cannot overwrite existing data from high-trust source (${previousSource}). Fields: ${changedFields.join(', ')}`],
                actionRequired: {
                    type: 'BLOCK',
                    details: {
                        currentTrust,
                        previousTrust,
                        fields: changedFields
                    }
                }
            };
        }

        return {
            ruleId: 'TRUST_001',
            ruleName: 'Source Trust Hierarchy',
            passed: true,
            severity: 'INFO',
            reasons: ['Only enrichment detected or no protected fields changed'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
