
import { prisma } from '../lib/prisma';
import { Rule } from './types';

export class RuleStateService {
    async getRuleState(ruleId: string): Promise<boolean> {
        const state = await prisma.ruleState.findUnique({
            where: { id: ruleId }
        });
        // Default to enabled if not found
        return state ? state.isEnabled : true;
    }

    async toggleRule(ruleId: string, isEnabled: boolean, actorId: string = 'system'): Promise<boolean> {
        const state = await prisma.ruleState.upsert({
            where: { id: ruleId },
            update: { isEnabled },
            create: { id: ruleId, isEnabled }
        });

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                eventId: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                eventType: 'RULE_TOGGLE',
                actorId,
                rulesEvaluated: 1, // 1 rule affected
                overallOutcome: 'ALLOW', // The action was allowed
                source: 'USER',
                details: `Rule ${ruleId} changed to ${isEnabled ? 'Enabled' : 'Disabled'}`,
                results: JSON.stringify({ ruleId, isEnabled })
            }
        });

        return state.isEnabled;
    }

    async getAllRuleStates(): Promise<Record<string, boolean>> {
        const states = await prisma.ruleState.findMany();
        const stateMap: Record<string, boolean> = {};
        states.forEach(s => {
            stateMap[s.id] = s.isEnabled;
        });
        return stateMap;
    }
}

export const ruleStateService = new RuleStateService();
