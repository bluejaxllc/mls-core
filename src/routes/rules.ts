
import { Router } from 'express';
import { ruleEngineService } from '../rules/setup';
import { ruleStateService } from '../rules/ruleStateService';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/rules - Get all rules with their current status + full metadata
router.get('/', async (req, res) => {
    try {
        const rules = await ruleEngineService.getRuleConfig();
        const states = await ruleStateService.getAllRuleStates();

        const mergedRules = rules.map(r => ({
            ...r,
            isEnabled: states[r.id] ?? true // Default true if not in DB
        }));

        res.json(mergedRules);
    } catch (error) {
        console.error('Failed to fetch rules:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/rules/stats - Aggregate real stats from AuditLog
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs, logs] = await Promise.all([
            prisma.auditLog.count(),
            prisma.auditLog.findMany({
                select: {
                    overallOutcome: true,
                    results: true,
                    rulesEvaluated: true
                }
            })
        ]);

        // Aggregate per-rule stats from the results JSON
        const perRuleStats: Record<string, { evaluations: number; blocks: number; passed: number; warnings: number }> = {};
        let totalBlocks = 0;
        let totalPasses = 0;
        let totalWarnings = 0;

        for (const log of logs) {
            if (log.overallOutcome === 'BLOCK') totalBlocks++;
            else if (log.overallOutcome === 'PASS' || log.overallOutcome === 'ALLOW') totalPasses++;
            else if (log.overallOutcome === 'WARN' || log.overallOutcome === 'FLAG') totalWarnings++;

            // Parse per-rule results
            try {
                const results = typeof log.results === 'string' ? JSON.parse(log.results) : log.results;
                if (Array.isArray(results)) {
                    for (const r of results) {
                        if (!r.ruleId) continue;
                        if (!perRuleStats[r.ruleId]) {
                            perRuleStats[r.ruleId] = { evaluations: 0, blocks: 0, passed: 0, warnings: 0 };
                        }
                        perRuleStats[r.ruleId].evaluations++;
                        if (r.passed) {
                            perRuleStats[r.ruleId].passed++;
                        } else if (r.actionRequired?.type === 'BLOCK') {
                            perRuleStats[r.ruleId].blocks++;
                        } else {
                            perRuleStats[r.ruleId].warnings++;
                        }
                    }
                }
            } catch (e) {
                // Skip unparseable results
            }
        }

        res.json({
            totalEvents: totalLogs,
            totalBlocks,
            totalPasses,
            totalWarnings,
            perRuleStats
        });
    } catch (error) {
        console.error('Failed to fetch rule stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/rules/:id - Toggle rule status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isEnabled } = req.body;

        if (typeof isEnabled !== 'boolean') {
            return res.status(400).json({ error: 'isEnabled must be a boolean' });
        }

        const newState = await ruleStateService.toggleRule(id, isEnabled);

        res.json({ id, isEnabled: newState });
    } catch (error) {
        console.error('Failed to toggle rule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
