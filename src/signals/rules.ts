// Basic Rule Engine for MLS Signals

export interface Rule {
    id: string;
    name: string;
    description: string;
    condition: (signal: any, context?: any) => boolean;
    action: (signal: any) => 'ESCALATE' | 'NOTIFY_BROKER' | 'AUTO_CLOSE' | 'NONE';
    priority: number;
}

export const RULES: Rule[] = [
    {
        id: 'RULE_PRICE_GAP_20',
        name: 'Significant Price Discrepancy',
        description: 'If price differs by more than 20% from canonical, escalate.',
        priority: 10,
        condition: (signal) => {
            if (signal.type !== 'PRICE_DISCREPANCY') return false;
            const payload = JSON.parse(signal.payload);
            return payload.diffPercentage > 20;
        },
        action: () => 'ESCALATE'
    },
    {
        id: 'RULE_UNREGISTERED_HIGH_CONFIDENCE',
        name: 'High Trust Unregistered Listing',
        description: 'If a high-trust source shows a listing we do not have, notify admin.',
        priority: 5,
        condition: (signal) => {
            if (signal.type !== 'UNREGISTERED_LISTING') return false;
            // In real app, check source trust score here
            return true;
        },
        action: () => 'NOTIFY_BROKER'
    }
];

export class RuleEngine {
    evaluate(signal: any): string[] {
        const actions: string[] = [];

        // Sort rules by priority
        const sortedRules = [...RULES].sort((a, b) => b.priority - a.priority);

        for (const rule of sortedRules) {
            try {
                if (rule.condition(signal)) {
                    const action = rule.action(signal);
                    if (action !== 'NONE') {
                        console.log(`[RuleEngine] Rule ${rule.id} triggered action ${action} for signal ${signal.id}`);
                        actions.push(action);
                    }
                }
            } catch (e) {
                console.error(`[RuleEngine] Error evaluating rule ${rule.id}`, e);
            }
        }

        return actions;
    }
}

export const ruleEngine = new RuleEngine();
