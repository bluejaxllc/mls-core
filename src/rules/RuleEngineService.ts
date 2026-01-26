
import { RuleEngine } from './RuleEngine';
import { RuleRegistry } from './RuleRegistry';
import { GovernanceEvent, RuleStatus, ExternalServices } from './types';

export class RuleEngineService {
    constructor(
        private engine: RuleEngine,
        private registry: RuleRegistry,
        private services: ExternalServices
    ) { }

    // Public API for event processing
    async processEvent(event: GovernanceEvent, currentUser: any): Promise<any> {
        return this.engine.evaluateEvent(event, currentUser);
    }

    // Admin API: List all rules and their status
    getRuleConfig(): { id: string, name: string, status: RuleStatus }[] {
        return this.registry.getAllRules().map(r => ({
            id: r.id,
            name: r.name,
            status: this.registry.getRuleStatus(r.id)
        }));
    }

    // Admin API: Enable/Disable rules
    updateRuleStatus(ruleId: string, status: RuleStatus): boolean {
        const rule = this.registry.getRule(ruleId);
        if (!rule) return false;

        this.registry.setRuleStatus(ruleId, status);
        console.log(`[ADMIN] Rule ${ruleId} status updated to ${status}`);
        return true;
    }
}
