
import { Rule, GovernanceEventType, RuleStatus } from './types';

export class RuleRegistry {
    private rules: Map<string, Rule> = new Map();
    private rulesByEvent: Map<GovernanceEventType, Rule[]> = new Map();
    private ruleConfigs: Map<string, RuleStatus> = new Map(); // Overrides

    register(rule: Rule): void {
        if (this.rules.has(rule.id)) {
            console.warn(`Rule with ID ${rule.id} already registered. Overwriting.`);
        }
        this.rules.set(rule.id, rule);
        // Default status if not set
        if (!rule.status) rule.status = RuleStatus.ACTIVE;
        this.ruleConfigs.set(rule.id, rule.status);

        for (const eventType of rule.triggerEvents) {
            if (!this.rulesByEvent.has(eventType)) {
                this.rulesByEvent.set(eventType, []);
            }
            const eventRules = this.rulesByEvent.get(eventType)!;
            eventRules.push(rule);
            // Sort by priority descending
            eventRules.sort((a, b) => b.priority - a.priority);
        }
    }

    getRulesForEvent(eventType: GovernanceEventType): Rule[] {
        const allRules = this.rulesByEvent.get(eventType) || [];
        // Filter out inactive rules
        return allRules.filter(r => this.getRuleStatus(r.id) === RuleStatus.ACTIVE);
    }

    getRule(id: string): Rule | undefined {
        return this.rules.get(id);
    }

    getAllRules(): Rule[] {
        return Array.from(this.rules.values());
    }

    // Configuration Management
    setRuleStatus(ruleId: string, status: RuleStatus): void {
        if (this.rules.has(ruleId)) {
            this.ruleConfigs.set(ruleId, status);
        }
    }

    getRuleStatus(ruleId: string): RuleStatus {
        return this.ruleConfigs.get(ruleId) || RuleStatus.INACTIVE;
    }
}
