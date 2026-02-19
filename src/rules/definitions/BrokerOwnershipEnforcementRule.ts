
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

        const user = context.currentUser;

        // 1. System/Admin Bypass
        if (actorId === 'ADMIN_SYSTEM' || (user.roles && user.roles.includes('admin'))) {
            return {
                ruleId: 'CORE_004',
                ruleName: 'Broker Ownership Enforcement',
                passed: true,
                severity: 'INFO',
                reasons: ['Actor is authorized (Admin/System)'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        if (!listingBrokerId) {
            return {
                ruleId: 'CORE_004',
                ruleName: 'Broker Ownership Enforcement',
                passed: false,
                severity: 'ERROR',
                reasons: ['Listing has no owner assigned, cannot verify authorization'],
                actionRequired: { type: 'BLOCK', details: {} }
            };
        }

        // 2. Ownership Check
        // We check if the acting user belongs to the broker that owns the listing
        if (user.brokerId === listingBrokerId) {
            return {
                ruleId: 'CORE_004',
                ruleName: 'Broker Ownership Enforcement',
                passed: true,
                severity: 'INFO',
                reasons: ['Actor belongs to owning broker'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        return {
            ruleId: 'CORE_004',
            ruleName: 'Broker Ownership Enforcement',
            passed: false,
            severity: 'ERROR',
            reasons: [`Actor ${actorId} (Broker: ${user.brokerId}) is not authorized to modify listing owned by ${listingBrokerId}`],
            actionRequired: { type: 'BLOCK', details: { actorId, userBrokerId: user.brokerId, listingBrokerId } }
        };
    }
};
