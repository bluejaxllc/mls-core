
import { Rule, GovernanceEventType, RuleResult, GovernanceEvent, RuleContext, ListingStatus } from '../types';

export const PublicExposureRequirementsRule: Rule = {
    id: 'CORE_006',
    name: 'Public Exposure Requirements',
    description: 'Enforces minimum data quality for PUBLIC/ACTIVE listings.',
    triggerEvents: [GovernanceEventType.LISTING_CREATED, GovernanceEventType.LISTING_UPDATED],
    priority: 85,

    evaluate: async (event: GovernanceEvent, context: RuleContext): Promise<RuleResult> => {
        const current = event.payload.current || event.payload;
        const status = current.status;

        if (status !== ListingStatus.ACTIVE && status !== ListingStatus.VERIFIED) {
            return {
                ruleId: 'CORE_006',
                ruleName: 'Public Exposure Requirements',
                passed: true,
                severity: 'INFO',
                reasons: ['Not checked for non-public status'],
                actionRequired: { type: 'NONE', details: {} }
            };
        }

        const errors = [];
        if (!current.price || current.price <= 0) errors.push('Price must be greater than 0');
        if (!current.address || !current.address.street) errors.push('Valid address is required');
        if (!current.photos || !Array.isArray(current.photos) || current.photos.length === 0) errors.push('At least one photo is required');

        if (errors.length > 0) {
            return {
                ruleId: 'CORE_006',
                ruleName: 'Public Exposure Requirements',
                passed: false,
                severity: 'ERROR',
                reasons: errors,
                actionRequired: { type: 'BLOCK', details: { errors } }
            };
        }

        return {
            ruleId: 'CORE_006',
            ruleName: 'Public Exposure Requirements',
            passed: true,
            severity: 'INFO',
            reasons: ['Public exposure requirements met'],
            actionRequired: { type: 'NONE', details: {} }
        };
    }
};
