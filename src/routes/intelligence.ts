import express from 'express';
import { sourceProfileService } from '../crawlers/profiles/service';
import { crawlScheduler } from '../crawlers/scheduler';
import { prismaIntelligence } from '../lib/intelligencePrisma';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// --- Sources ---

router.get('/sources', async (req, res) => {
    try {
        const profiles = await sourceProfileService.listProfiles();
        res.json(profiles);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/sources', async (req, res) => {
    try {
        const profile = await sourceProfileService.createProfile(req.body);
        res.json(profile);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

router.put('/sources/:id/config', async (req, res) => {
    try {
        const profile = await sourceProfileService.updateConfig(req.params.id, req.body);
        res.json(profile);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

// --- Crawling ---

router.post('/crawl/trigger', async (req, res) => {
    try {
        const { sourceId, url } = req.body;
        const jobId = await crawlScheduler.scheduleJob(sourceId, url);
        res.json({ jobId, message: 'Crawl scheduled' });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/crawl/events', async (req, res) => {
    try {
        const events = await prismaIntelligence.crawlEvent.findMany({
            orderBy: { startTime: 'desc' },
            take: 50,
            include: { source: true }
        });
        res.json(events);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// --- Intelligence / Signals ---

router.get('/signals', async (req, res) => {
    try {
        const signals = await prismaIntelligence.signal.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                observedListing: {
                    include: { snapshot: { include: { source: true } } }
                }
            }
        });

        // Parse payload
        const enriched = signals.map((s: any) => ({
            ...s,
            payload: JSON.parse(s.payload)
        }));

        res.json(enriched);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/observed', async (req, res) => {
    try {
        const observed = await prismaIntelligence.observedListing.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { snapshot: { include: { source: true } } }
        });
        res.json(observed);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// --- Debug / Seed ---
router.get('/debug/seed', async (req, res) => {
    try {
        const { sourceId } = req.query;
        let finalSourceId = sourceId ? String(sourceId) : undefined;

        if (!finalSourceId) {
            const profile = await sourceProfileService.createProfile({
                name: `DebugSource-${Date.now()}`,
                type: 'PORTAL' as any,
                baseUrl: 'http://debug.com',
                trustScore: 80,
                config: {
                    selectors: {
                        listWrapper: '.listing-grid',
                        listItem: '.property-card',
                        listingTitle: '.card-title',
                        listingPrice: '.price-tag'
                    }
                } as any
            });
            finalSourceId = profile.id;
        }

        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        source: { connect: { id: finalSourceId as string } },
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

export default router;
