
import { GovernanceEvent, RuleContext, RuleResult, ExternalServices } from './types';
import { RuleRegistry } from './RuleRegistry';

export class RuleEngine {
    constructor(private registry: RuleRegistry, private services: ExternalServices) { }

    async evaluateEvent(event: GovernanceEvent, currentUser: any): Promise<RuleResult[]> {
        const rules = this.registry.getRulesForEvent(event.type);
        const context: RuleContext = {
            executionTime: new Date(),
            services: this.services,
            currentUser: currentUser
        };

        const results: RuleResult[] = [];

        // Deterministic evaluation order is guaranteed by the registry sorting rules by priority
        for (const rule of rules) {
            try {
                console.log(`Evaluating rule: ${rule.name} for event ${event.id}`);
                const result = await rule.evaluate(event, context);
                results.push(result);

                // Logic to stop processing if a critical blocking rule fails? 
                // For now, we evaluate all applicable rules to give a full report.
                // But in a real blocking scenario (like specific API middleware), we might want to fail fast.
                // We will stick to "evaluate all" for the engine, and let the caller decide what to do with the results.

            } catch (error) {
                console.error(`Error evaluating rule ${rule.id}:`, error);
                results.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    passed: false,
                    severity: 'CRITICAL',
                    reasons: [`System error during evaluation: ${(error as Error).message}`],
                    actionRequired: { type: 'BLOCK', details: { error: 'System Error' } }
                });
            }
        }

        // Log the execution before returning
        await this.services.auditService.logExecution(event, results, context);

        return results;
    }
}
