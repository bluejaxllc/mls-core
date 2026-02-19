
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

let syncJob: { id: string, status: string, startTime: number, progress: number } | null = null;

// POST /api/ingest/sync - Trigger a sync operation
router.post('/sync', async (req, res) => {
    try {
        if (syncJob && syncJob.status === 'RUNNING') {
            return res.status(409).json({ error: 'Sync already in progress', job: syncJob });
        }

        const jobId = `SYNC-${Date.now()}`;
        syncJob = {
            id: jobId,
            status: 'RUNNING',
            startTime: Date.now(),
            progress: 0
        };

        // Simulate background process
        simulateSync(jobId);

        // Audit Log
        await prisma.auditLog.create({
            data: {
                eventId: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                eventType: 'SYNC_STARTED',
                actorId: req.user?.id || 'user',
                rulesEvaluated: 0,
                overallOutcome: 'ALLOW',
                source: 'USER',
                details: 'Manual sync triggered via Ingestion Dashboard',
                results: JSON.stringify({ jobId })
            }
        });

        res.json({ message: 'Sync started', job: syncJob });
    } catch (error) {
        console.error('Failed to start sync:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/ingest/status - Get current sync status
router.get('/status', (req, res) => {
    res.json(syncJob || { status: 'IDLE' });
});

function simulateSync(jobId: string) {
    let progress = 0;
    const interval = setInterval(() => {
        if (!syncJob || syncJob.id !== jobId) {
            clearInterval(interval);
            return;
        }

        progress += 10;
        syncJob.progress = progress;

        if (progress >= 100) {
            syncJob.status = 'COMPLETED';
            clearInterval(interval);
            // Log completion
            prisma.auditLog.create({
                data: {
                    eventId: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    eventType: 'SYNC_COMPLETED',
                    actorId: 'system',
                    rulesEvaluated: 150, // Mock stats
                    overallOutcome: 'PASS',
                    source: 'SYSTEM',
                    details: 'Sync job completed successfully.',
                    results: JSON.stringify({ jobId, records: 150 })
                }
            }).catch(console.error);
        }
    }, 1000); // 10 seconds to complete
}

export default router;
