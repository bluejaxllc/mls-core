
import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/system/config
router.get('/config', async (req, res) => {
    try {
        let config = await prisma.systemConfig.findUnique({
            where: { id: 'default' }
        });

        if (!config) {
            config = await prisma.systemConfig.create({
                data: {
                    id: 'default',
                    region: 'MX-CHH',
                    currency: 'MXN',
                    timezone: 'America/Chihuahua'
                }
            });
        }
        res.json(config);
    } catch (error) {
        console.error('Failed to fetch system config:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/system/config
router.post('/config', async (req, res) => {
    try {
        const { region, currency, timezone } = req.body;

        // Simple validation
        if (!region || !currency || !timezone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const config = await prisma.systemConfig.upsert({
            where: { id: 'default' },
            update: { region, currency, timezone },
            create: { id: 'default', region, currency, timezone }
        });

        // Log the change
        await prisma.auditLog.create({
            data: {
                eventId: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                eventType: 'SYSTEM_CONFIG_CHANGE',
                actorId: 'user', // TODO: Get from req.user
                rulesEvaluated: 0,
                overallOutcome: 'ALLOW',
                source: 'SYSTEM',
                details: `System configuration updated. Region: ${region}, Currency: ${currency}`,
                results: JSON.stringify(config)
            }
        });

        res.json(config);
    } catch (error) {
        console.error('Failed to update system config:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
