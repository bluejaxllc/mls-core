
import express from 'express';
import { prismaIntelligence } from '../lib/intelligencePrisma';

const router = express.Router();

router.get('/debug/seed', async (req, res) => {
    try {
        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        sourceId: 'stub-source',
                        externalId: `debug-${Date.now()}`,
                        url: 'http://debug.com/prop',
                        contentHash: `hash-${Date.now()}`,
                        rawJson: '{"debug": true}'
                    }
                },
                title: 'Detected Property (Debug Seed)',
                price: 7500000,
                address: 'Calle de Prueba 888, Zona Debug',
                geoHash: 'abc',
                addressHash: `addr-${Date.now()}`,
                confidenceScore: 0.95
            }
        });
        res.json({ message: 'Seeded successfully', listing: obs });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Stubs for other endpoints to prevent 404s on frontend
router.get('/sources', (req, res) => res.json([]));
router.post('/sources', (req, res) => res.json({ id: 'stub' }));
router.get('/observed', async (req, res) => {
    try {
        const observed = await prismaIntelligence.observedListing.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { snapshot: true }
        });
        res.json(observed);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});
router.get('/signals', (req, res) => res.json([]));

export default router;
