
import { RuleExecutionLog, GovernanceEvent, RuleResult, RuleContext } from './types';
import { prisma } from '../lib/prisma';

export class AuditService {
    async logExecution(event: GovernanceEvent, results: RuleResult[], context: RuleContext): Promise<void> {
        // Determine overall outcome
        let outcome: 'PASS' | 'BLOCK' | 'FLAG' = 'PASS';

        if (results.some(r => !r.passed && r.severity === 'ERROR')) {
            outcome = 'BLOCK';
        } else if (results.some(r => r.severity === 'WARNING' || (r.actionRequired && r.actionRequired.type !== 'NONE'))) {
            outcome = 'FLAG';
        }

        try {
            await prisma.auditLog.create({
                data: {
                    eventId: event.id,
                    eventType: event.type,
                    timestamp: new Date(),
                    actorId: event.actorId,
                    rulesEvaluated: results.length,
                    results: JSON.stringify(results), // Store as string for SQLite
                    overallOutcome: outcome,
                }
            });
            console.log(`[AUDIT] Event ${event.id} persisted to database | Outcome: ${outcome}`);
        } catch (error: any) {
            console.error('[AUDIT] Failed to persist log:', error.message);
        }
    }

    async getTrace(eventId: string): Promise<RuleExecutionLog | undefined> {
        const log = await prisma.auditLog.findUnique({
            where: { eventId }
        });
        return log ? (log as unknown as RuleExecutionLog) : undefined;
    }

    // For dashboard and verification
    async getAllLogs(): Promise<RuleExecutionLog[]> {
        const logs = await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' }
        });
        return logs as unknown as RuleExecutionLog[];
    }
}
