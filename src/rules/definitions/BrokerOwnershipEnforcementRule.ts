
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext } from '../types';

export const BrokerOwnershipEnforcementRule: Rule = {
    id: 'CORE_004',
    name: 'Broker Ownership Enforcement',
    description: 'Ensures only the owning broker can modify a listing.',
    triggerEvents: [GovernanceEventType.LISTING_UPDATED, GovernanceEventType.LISTING_DELETED],
    priority: 100,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload;
        const listingBrokerId = current.brokerId;
        const actorId = event.actorId;

        if (!listingBrokerId) {
            // Should probably be caught by schema validation, but for rule engine:
            return {
                ruleId: 'CORE_004',
                ruleName: 'Broker Ownership Enforcement',
                passed: false,
                severity: 'ERROR',
                reasons: ['Listing has no owner assigned'],
                actionRequired: { type: 'BLOCK', details: {} }
            };
        }

        if (actorId === 'ADMIN_SYSTEM' || actorId === listingBrokerId) {
            return {
                ruleId: 'CORE_004',
                ruleName: 'Broker Ownership Enforcement',
                passed: true,
                severity: 'INFO',
                reasons: ['Actor is authorized'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        return {
            ruleId: 'CORE_004',
            ruleName: 'Broker Ownership Enforcement',
            passed: false,
            severity: 'ERROR',
            reasons: [`Actor ${actorId} is not authorized to modify listing owned by ${listingBrokerId}`],
            actionRequired: { type: 'BLOCK', details: { actorId, listingBrokerId } }
        };
    }
};
