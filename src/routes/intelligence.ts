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

// --- Facebook Drip Crawl (On-Demand) ---
// In-memory cache to rate-limit FB crawls (10 min)
let fbLastCrawl = 0;
let fbCachedItems: any[] = [];
const FB_CACHE_TTL = 10 * 60 * 1000;
const FB_PAGE_SIZE = 12;

router.get('/fb/drip', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string || '0', 10);

        // Find FB source profile
        const fbSource = await prismaIntelligence.sourceProfile.findFirst({
            where: {
                OR: [
                    { name: { contains: 'Facebook' } },
                    { name: { contains: 'facebook' } },
                    { baseUrl: { contains: 'facebook.com' } }
                ]
            }
        });

        if (!fbSource) {
            return res.json({ items: [], total: 0, page, hasMore: false, error: 'No FB source profile found' });
        }

        // Pagination from DB for page > 0
        if (page > 0) {
            const skip = page * FB_PAGE_SIZE;
            const [items, total] = await Promise.all([
                prismaIntelligence.observedListing.findMany({
                    where: { snapshot: { is: { sourceId: fbSource.id } } },
                    include: { snapshot: { include: { source: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: FB_PAGE_SIZE,
                    skip,
                }),
                prismaIntelligence.observedListing.count({
                    where: { snapshot: { is: { sourceId: fbSource.id } } }
                })
            ]);
            return res.json({
                items: items.map(enrichImage),
                total,
                page,
                hasMore: skip + FB_PAGE_SIZE < total,
                cached: true,
            });
        }

        // Check cache for page 0
        const cacheAge = Date.now() - fbLastCrawl;
        if (cacheAge < FB_CACHE_TTL && fbCachedItems.length > 0) {
            console.log(`[FB_DRIP] Cache hit (${Math.round(cacheAge / 1000)}s old)`);
            return res.json({
                items: fbCachedItems.slice(0, FB_PAGE_SIZE),
                total: fbCachedItems.length,
                page: 0,
                hasMore: fbCachedItems.length > FB_PAGE_SIZE,
                cached: true,
            });
        }

        // Trigger drip crawl
        console.log(`[FB_DRIP] Starting on-demand drip crawl...`);
        const { FacebookCrawler } = await import('../crawlers/facebook_crawler');
        const { facebookConfig } = await import('../crawlers/facebook_config');

        const job = {
            id: 'drip-' + Date.now(),
            sourceId: fbSource.id,
            url: fbSource.baseUrl || 'https://www.facebook.com/marketplace/chihuahua/propertyrentals/',
            profileName: fbSource.name,
            config: facebookConfig,
            status: 'PENDING' as const,
            attempt: 1,
        };

        const crawler = new FacebookCrawler(job);
        const result = await crawler.run();

        if (!result.success || result.items.length === 0) {
            // Return whatever we have from DB
            const dbItems = await prismaIntelligence.observedListing.findMany({
                where: { snapshot: { is: { sourceId: fbSource.id } } },
                include: { snapshot: { include: { source: true } } },
                orderBy: { createdAt: 'desc' },
                take: FB_PAGE_SIZE,
            });
            const total = await prismaIntelligence.observedListing.count({
                where: { snapshot: { is: { sourceId: fbSource.id } } }
            });
            return res.json({
                items: dbItems.map(enrichImage),
                total,
                page: 0,
                hasMore: total > FB_PAGE_SIZE,
                cached: true,
                crawlErrors: result.errors,
            });
        }

        // Store new items in DB with dedup
        const storedItems: any[] = [];
        for (const item of result.items) {
            const externalId = item.externalId || 'unknown';

            const existing = await prismaIntelligence.sourceSnapshot.findFirst({
                where: { sourceId: fbSource.id, externalId },
                include: { observedListing: true }
            });

            if (existing?.observedListing) {
                storedItems.push({ ...existing.observedListing, imageUrl: item.images?.[0] });
                continue;
            }

            const snapshot = await prismaIntelligence.sourceSnapshot.create({
                data: {
                    sourceId: fbSource.id,
                    externalId,
                    url: item.url || job.url,
                    rawJson: JSON.stringify(item.rawJson || item),
                    contentHash: externalId + '-' + Date.now(),
                }
            });

            const observed = await prismaIntelligence.observedListing.create({
                data: {
                    snapshotId: snapshot.id,
                    title: item.title,
                    price: item.price ? parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || null : null,
                    currency: 'MXN',
                    address: item.address,
                    status: 'active',
                    confidenceScore: 0.7,
                }
            });

            storedItems.push({ ...observed, imageUrl: item.images?.[0] });
        }

        // Update cache
        fbCachedItems = storedItems;
        fbLastCrawl = Date.now();

        console.log(`[FB_DRIP] ✅ Stored ${storedItems.length} FB listings`);
        res.json({
            items: storedItems.slice(0, FB_PAGE_SIZE),
            total: storedItems.length,
            page: 0,
            hasMore: storedItems.length > FB_PAGE_SIZE,
            cached: false,
        });
    } catch (e: any) {
        console.error('[FB_DRIP] Error:', e);
        res.status(500).json({ error: e.message, items: [], total: 0 });
    }
});

function enrichImage(item: any) {
    let imageUrl = null;
    if (item.snapshot?.rawJson) {
        try {
            const parsed = JSON.parse(item.snapshot.rawJson);
            imageUrl = parsed.imageUrl || parsed.images?.[0] || parsed.primary_listing_photo?.listing_image?.uri || null;
        } catch (_e) { /* ignore */ }
    }
    return {
        ...item,
        imageUrl,
        snapshot: { ...item.snapshot, rawJson: undefined },
    };
}

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
