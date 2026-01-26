
import { RuleExecutionLog, GovernanceEvent, RuleResult, RuleContext } from './types';

export class AuditService {
    private logs: RuleExecutionLog[] = [];

    async logExecution(event: GovernanceEvent, results: RuleResult[], context: RuleContext): Promise<void> {
        // Determine overall outcome
        let outcome: 'PASS' | 'BLOCK' | 'FLAG' = 'PASS';

        const hasBlock = results.some(r => r.actionRequired?.type === 'BLOCK' || (r.severity === 'ERROR' && !r.passed));
        const hasFlag = results.some(r => r.severity === 'WARNING' || (r.passed && r.actionRequired?.type === 'FLAG')); // Simplified logic

        // Slightly buggy logic above, let's refine based on "Blocking Actions"
        const blockingActions = ['BLOCK', 'DOWNGRADE_TRUST', 'AUTO_CORRECT']; // Actions that modify or stop flow
        // "AUTO_CORRECT" might be considered a "PASS with Modification" or "BLOCK original intent". 
        // For audit, if we intervened, let's call it 'FLAG' or 'BLOCK' depending on severity.
        // Let's keep it simple: any ERROR that failed is a BLOCK.

        if (results.some(r => !r.passed && r.severity === 'ERROR')) {
            outcome = 'BLOCK';
        } else if (results.some(r => r.severity === 'WARNING' || r.actionRequired?.type !== 'NONE')) {
            outcome = 'FLAG';
        }

        const log: RuleExecutionLog = {
            eventId: event.id,
            eventType: event.type,
            timestamp: new Date(),
            actorId: event.actorId,
            rulesEvaluated: results.length,
            results: results,
            overallOutcome: outcome,
        };

        // In a real app, write to DB or structured log file
        console.log(`[AUDIT] Event ${event.id} processed | Outcome: ${outcome}`);
        this.logs.push(log);
    }

    async getTrace(eventId: string): Promise<RuleExecutionLog | undefined> {
        return this.logs.find(l => l.eventId === eventId);
    }

    // For verification
    async getAllLogs(): Promise<RuleExecutionLog[]> {
        return this.logs;
    }
}
