import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GovernanceEventType, ListingStatus, GovernanceEvent } from './rules/types';
import { webhookHandler } from './auth/bluejaxWebhooks';
import { verifyBlueJaxToken } from './auth/middleware';
import { provisionHandler } from './provisioning/handler';
import { ruleEngineService, coreServices } from './rules/setup';
import { prisma } from './lib/prisma';
import { prismaIntelligence } from './lib/intelligencePrisma';
import { imageEnrichmentService } from './crawlers/enrichment_service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3005', // Dev Port 1
        'http://localhost:3006', // Dev Port 2
        'https://mls-governance-web.vercel.app', // Placeholder - actual URL should be in env
        /\.vercel\.app$/ // Allow all Vercel previews
    ],
    credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'MLS API is running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'MLS Core API' });
});

// Provisioning Endpoint (Protected by Blue Jax JWT)
app.post('/api/provision', verifyBlueJaxToken, provisionHandler);

// Intelligence API (Layer 5 Integration)
import intelligenceRouter from './routes/intelligence';
app.use('/api/intelligence', intelligenceRouter);

// Search API (Unified) — Protected + Public
import searchRouter from './routes/search';
app.use('/api/protected/search', searchRouter);
app.use('/api/public/search', searchRouter);

// Market Stats (Public)
import marketStatsRouter from './routes/market-stats';
app.use('/api/public/market-stats', marketStatsRouter);

// Mercado Libre OAuth
import mercadolibreRouter from './routes/mercadolibre';
app.use('/api/auth/mercadolibre', mercadolibreRouter); // TODO: Re-add auth after fixing frontend session

// Import/Ingestion API
// Import/Ingestion API
import importRouter from './routes/import';
// Router handles its own auth (Template is public, Upload is protected)
app.use('/api/import', importRouter);

// System API (Config)
// System API (Config)
import systemRouter from './routes/system';
app.use('/api/system', verifyBlueJaxToken, systemRouter);

// Rules API (Governance)
import rulesRouter from './routes/rules';
app.use('/api/rules', verifyBlueJaxToken, rulesRouter);

// Governance API (Claims) - Phase 7
import governanceRouter from './routes/governance';
app.use('/api/governance', verifyBlueJaxToken, governanceRouter);

// Audit Logs API
// Audit Logs API
import auditRouter from './routes/audit';
app.use('/api/audit-logs', verifyBlueJaxToken, auditRouter);

// Public Agent Directory API
import agentsRouter from './routes/agents';
app.use('/api/public/agents', agentsRouter);

// Ingestion API
import ingestRouter from './routes/ingest';
app.use('/api/ingest', verifyBlueJaxToken, ingestRouter);

// Messaging API
import messagesRouter from './routes/messages';
app.use('/api/protected/messages', verifyBlueJaxToken, messagesRouter);

// Favorites & Collections API
import favoritesRouter from './routes/favorites';
app.use('/api/protected/favorites', verifyBlueJaxToken, favoritesRouter);

// Reviews API (Public + Protected)
import reviewsRouter from './routes/reviews';
app.use('/api/public/reviews', reviewsRouter);
import reviewsProtectedRouter from './routes/reviews-protected';
app.use('/api/protected/reviews', verifyBlueJaxToken, reviewsProtectedRouter);

// Leads API (Protected + Public)
import leadsRouter, { publicLeadsRouter } from './routes/leads';
app.use('/api/protected/leads', verifyBlueJaxToken, leadsRouter);
app.use('/api/public/leads', publicLeadsRouter);

// Appointments API (Protected)
import appointmentsRouter from './routes/appointments';
app.use('/api/protected/appointments', verifyBlueJaxToken, appointmentsRouter);

// Saved Searches API (Protected)
import savedSearchesRouter from './routes/saved-searches';
app.use('/api/protected/saved-searches', verifyBlueJaxToken, savedSearchesRouter);

// Notifications API (Protected)
import notificationsRouter from './routes/notifications';
app.use('/api/protected/notifications', verifyBlueJaxToken, notificationsRouter);

// Analytics API (Protected)
import analyticsRouter from './routes/analytics';
app.use('/api/protected/analytics', verifyBlueJaxToken, analyticsRouter);

// Context API (Protected) - Live trust score, rule evals, activity feed
import contextRouter from './routes/context';
app.use('/api/protected/context', verifyBlueJaxToken, contextRouter);

// Public Listing Detail (No Auth - for property showcase page)
app.get('/api/public/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Try Canonical Listing
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (listing) {
            const parsedListing = {
                id: listing.id,
                propertyId: listing.propertyId,
                title: listing.title,
                description: listing.description,
                address: listing.address,
                city: listing.city,
                state: listing.state,
                zipCode: listing.zipCode,
                propertyType: listing.propertyType,
                status: listing.status,
                price: listing.price,
                source: listing.source,
                trustScore: listing.trustScore,
                mapUrl: listing.mapUrl,
                images: listing.images ? JSON.parse(listing.images) : [],
                videos: listing.videos ? JSON.parse(listing.videos) : [],
                lastVerifiedAt: listing.lastVerifiedAt,
                createdAt: listing.createdAt,
                updatedAt: listing.updatedAt,
                // Resolve agent info
                agent: null as any
            };

            // Fetch agent if ownerId exists
            if (listing.ownerId) {
                const agent = await prisma.user.findUnique({ where: { id: listing.ownerId } });
                if (agent) {
                    parsedListing.agent = {
                        id: agent.id,
                        name: `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Agente MLS',
                        email: agent.email,
                        phone: agent.phoneNumber,
                        whatsapp: agent.whatsapp,
                        bio: agent.bio,
                        licenseNumber: agent.licenseNumber,
                        languages: agent.languages,
                        specialties: agent.specialties
                    };
                }
            }
            return res.json(parsedListing);
        }

        // 2. Try Observed Listing (Intelligence)
        const observed = await prismaIntelligence.observedListing.findUnique({
            where: { id },
            include: { snapshot: { include: { source: true } } }
        });

        if (observed) {
            let imgArray: string[] = [];
            let mapUrl = null;
            let rawData: any = {};

            try {
                if (observed.snapshot?.rawHtml && observed.snapshot.rawHtml.startsWith('{')) {
                    rawData = JSON.parse(observed.snapshot.rawHtml);
                    if (rawData.images && Array.isArray(rawData.images)) {
                        imgArray = rawData.images.filter((img: string) => img && img.trim());
                    } else if (rawData.image) {
                        imgArray = [rawData.image];
                    }
                    mapUrl = rawData.mapUrl || rawData.map_url;
                    if (!mapUrl && observed.address) {
                        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(observed.address)}`;
                    }
                }
            } catch (e) {
                console.warn('[API] Failed to parse observed listing rawHtml:', e);
            }

            const isRent = observed.status === 'DETECTED_RENT' || observed.title?.toLowerCase().includes('rent');
            const isLand = observed.description?.includes('LAND') || observed.title?.toLowerCase().includes('terreno');
            const USD_TO_MXN_RATE = 18;
            const priceInMXN = observed.currency === 'USD'
                ? Math.round((observed.price || 0) * USD_TO_MXN_RATE)
                : observed.price;

            return res.json({
                id: observed.id,
                propertyId: `DETECTED-${observed.id.substring(0, 8)}`,
                title: observed.title || 'Propiedad Detectada',
                description: observed.description || `Detectado via ${observed.snapshot?.source?.name || 'Scraper'}`,
                address: observed.address,
                propertyType: isLand ? 'land' : 'commercial',
                status: isRent ? 'RENT' : 'SALE',
                price: priceInMXN,
                source: observed.snapshot?.source?.name || 'SCRAPER',
                images: imgArray,
                videos: [],
                mapUrl,
                isObserved: true,
                agent: null
            });
        }

        return res.status(404).json({ error: 'Not found' });
    } catch (error: unknown) {
        console.error('[API] Public listing fetch failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Public Listing Version History (No Auth)
app.get('/api/public/listings/:id/history', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch audit logs that mention this listing ID
        const logs = await prisma.auditLog.findMany({
            where: {
                OR: [
                    { details: { contains: id } },
                    { results: { contains: id } }
                ]
            },
            orderBy: { timestamp: 'desc' },
            take: 20
        });

        // Map to timeline-friendly format
        const history = logs.map((log, index) => {
            let parsedResults: any = {};
            try { parsedResults = JSON.parse(log.results || '{}'); } catch { }

            return {
                id: `v${logs.length - index}`,
                date: log.timestamp,
                author: log.actorId === 'SYSTEM' ? 'Sistema' : log.source === 'RULE_ENGINE' ? 'Motor de Reglas' : 'Broker',
                action: log.eventType.replace(/_/g, ' ').replace(/LISTING /i, ''),
                outcome: log.overallOutcome,
                details: log.details,
                rulesEvaluated: log.rulesEvaluated,
                highlight: log.overallOutcome === 'BLOCK' || log.overallOutcome === 'FLAG'
            };
        });

        res.json(history);
    } catch (error: unknown) {
        console.error('[API] Listing history fetch failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Similar Listings (Public - for showcase page)
app.get('/api/public/listings/:id/similar', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await prisma.listing.findUnique({ where: { id } });
        if (!listing) return res.json([]);

        const similar = await prisma.listing.findMany({
            where: {
                id: { not: id },
                status: 'ACTIVE',
                OR: [
                    { city: listing.city },
                    { propertyType: listing.propertyType }
                ]
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });

        const parsed = similar.map((l: any) => ({
            id: l.id,
            title: l.title,
            address: l.address,
            price: l.price,
            propertyType: l.propertyType,
            status: l.status,
            images: l.images ? JSON.parse(l.images) : []
        }));

        res.json(parsed);
    } catch (error: unknown) {
        console.error('[API] Similar listings fetch failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Auth Webhook (Blue Jax -> MLS)
// Protected by shared secret signature verification (TODO)
app.post('/api/webhooks/bluejax/users', webhookHandler);

// Secured Routes Example
// All /api/protected routes require a valid Blue Jax token
app.use('/api/protected', verifyBlueJaxToken);

app.get('/api/protected/me', (req: any, res) => {
    res.json({
        message: 'You are authenticated via Blue Jax',
        user: req.user
    });
});

app.patch('/api/protected/me/profile', async (req: any, res) => {
    try {
        const { bio, licenseNumber, phoneNumber, whatsapp, instagram, specialties, firstName, lastName, locationId } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                bio,
                licenseNumber,
                phoneNumber,
                whatsapp,
                instagram,
                specialties, // Stored as JSON string
                firstName,
                lastName,
                locationId
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// === Dashboard Endpoints ===

// GET /api/protected/dashboard/stats
app.get('/api/protected/dashboard/stats', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const [activeListings, newLeads, pendingAppointments] = await Promise.all([
            prisma.listing.count({ where: { ownerId: userId, status: 'ACTIVE' } }),
            prisma.lead.count({ where: { status: 'NEW' } }),
            prisma.appointment.count({ where: { agentId: userId, status: 'PENDING' } }),
        ]);
        res.json({ activeListings, newLeads, pendingAppointments });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

// GET /api/protected/dashboard/feed
app.get('/api/protected/dashboard/feed', async (req: any, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 20,
            select: { eventType: true, details: true, timestamp: true }
        });
        const feed = logs.map(l => ({
            message: l.details || l.eventType,
            timestamp: l.timestamp
        }));
        res.json(feed);
    } catch (error) {
        console.error('Dashboard feed error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard feed' });
    }
});

// GET /api/protected/dashboard/chart-data
app.get('/api/protected/dashboard/chart-data', async (req: any, res) => {
    try {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const result: { name: string; views: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            const count = await prisma.listingView.count({
                where: { createdAt: { gte: start, lt: end } }
            });
            result.push({ name: days[start.getDay()], views: count });
        }
        res.json(result);
    } catch (error) {
        console.error('Dashboard chart error:', error);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req: any, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the full URL to the file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Listing Management
app.get('/api/protected/listings', async (req: any, res) => {
    try {
        const { status } = req.query;
        const where: any = {};

        if (status) {
            where.status = status;
        }

        const listings = await prisma.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // SQLite: Parse JSON strings back to arrays
        const parsedListings = listings.map((l: any) => ({
            ...l,
            images: l.images ? JSON.parse(l.images) : [],
            videos: l.videos ? JSON.parse(l.videos) : []
        }));

        res.json(parsedListings);
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Fetch listings failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/protected/listings', async (req: any, res) => {
    try {
        const { title, price, description, address, type, mapUrl, images, videos } = req.body;

        // Simple validation
        if (!title || !price || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // --- RULE ENGINE INTEGRATION (CREATION) ---
        const tempId = `TEMP-${Date.now()}`;
        const proposedListing = {
            id: tempId,
            propertyId: `PROP-${Date.now()}`, // Temporary Prop ID to check against
            title,
            description,
            address,
            propertyType: type,
            status: 'ACTIVE', // Default to ACTIVE for check
            source: 'MANUAL',
            price: parseFloat(price),
            mapUrl: mapUrl || null,
            images: images || [], // Keep as array for rule check
            videos: videos || [],
            ownerId: req.user.id,
            brokerId: req.user.brokerId
        };

        const event: GovernanceEvent = {
            id: `evt-${Date.now()}`,
            type: GovernanceEventType.LISTING_CREATED,
            timestamp: new Date(),
            actorId: req.user.id,
            sourceId: 'MANUAL',
            payload: proposedListing
        };

        // Execute Rules
        const { results } = await ruleEngineService.processEvent(event, req.user);

        // Check for Blockers
        const blockingErrors = results.filter(r => !r.passed && r.actionRequired?.type === 'BLOCK');
        if (blockingErrors.length > 0) {
            console.warn(`[GOVERNANCE] Blocked listing creation for user ${req.user.id}:`, blockingErrors);
            return res.status(400).json({
                error: 'Governance Validation Failed',
                details: blockingErrors.map(e => e.reasons).flat()
            });
        }

        // Check for Auto-Correct (e.g., Downgrade status)
        const statusUpdates = results
            .filter(r => !r.passed && r.actionRequired?.type === 'AUTO_CORRECT' && r.actionRequired.details.field === 'status')
            .map(r => r.actionRequired?.details.newValue);

        const finalStatus = statusUpdates.length > 0 ? statusUpdates[0] : 'ACTIVE'; // Take first correction

        // --- END RULE ENGINE ---

        const newListing = await prisma.listing.create({
            data: {
                propertyId: `PROP-${Date.now()}`,
                title,
                description,
                address,
                propertyType: type,
                status: finalStatus,
                source: 'MANUAL',
                price: parseFloat(price),
                mapUrl: mapUrl || null,
                images: JSON.stringify(images || []),
                videos: JSON.stringify(videos || []),
                ownerId: req.user.id,
                brokerId: req.user.brokerId
            }
        });

        console.log(`[API] Created listing ${newListing.id} for user ${req.user.id} (Status: ${finalStatus})`);
        res.json(newListing);

    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Create listing failed:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

app.get('/api/protected/listings/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        console.log(`[API] Fetching listing details for ID: ${id}`);

        // 1. Try Canonical Listing First
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (listing) {
            console.log(`[API] Found canonical listing: ${listing.title}`);
            // SQLite: Parse JSON
            const parsedListing = {
                ...listing,
                images: listing.images ? JSON.parse(listing.images) : [],
                videos: listing.videos ? JSON.parse(listing.videos) : []
            };
            return res.json(parsedListing);
        }

        // 2. Try Observed Listing (Intelligence)
        console.log(`[API] Canonical not found. Checking ObservedListing...`);
        const observed = await prismaIntelligence.observedListing.findUnique({
            where: { id },
            include: { snapshot: { include: { source: true } } }
        });

        if (observed) {
            console.log(`[API] Found observed listing: ${observed.title}`);

            // Extract data from crawler JSON
            let imgUrl = null;
            let imgArray: string[] = [];
            let mapUrl = null;
            let rawData: any = {};

            try {
                if (observed.snapshot?.rawHtml && observed.snapshot.rawHtml.startsWith('{')) {
                    rawData = JSON.parse(observed.snapshot.rawHtml);
                    imgUrl = rawData.image || (rawData.images && rawData.images[0]) || null;

                    // Build images array
                    if (rawData.images && Array.isArray(rawData.images)) {
                        imgArray = rawData.images.filter((img: string) => img && img.trim());
                    } else if (rawData.image) {
                        imgArray = [rawData.image];
                    }

                    // Extract or construct map URL
                    mapUrl = rawData.mapUrl || rawData.map_url;
                    if (!mapUrl && observed.address) {
                        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(observed.address)}`;
                    }
                }
            } catch (e: unknown) {
                console.warn('[API] Failed to parse observed listing rawHtml:', e);
            }

            // Auto-trigger image enrichment if not already done (fire-and-forget)
            if (!observed.snapshot?.imagesEnriched) {
                console.log(`[API] Auto-triggering image enrichment for listing ${id}`);
                imageEnrichmentService.enrichListingImages(id).catch(err => {
                    console.warn(`[API] Background enrichment failed for ${id}:`, err.message);
                });
            }

            // Determine Rent vs Sale
            const isRent = observed.status === 'DETECTED_RENT' || observed.title?.toLowerCase().includes('rent') || observed.description?.includes('RENT');

            // Determine Property Type (Land)
            const isLand = observed.description?.includes('LAND') || observed.description?.includes('TERRENO') ||
                observed.title?.toLowerCase().includes('terreno') || observed.title?.toLowerCase().includes('lot');

            // Convert USD to MXN (approx exchange rate: 1 USD = 18 MXN)
            const USD_TO_MXN_RATE = 18;
            const priceInMXN = observed.currency === 'USD'
                ? Math.round((observed.price || 0) * USD_TO_MXN_RATE)
                : observed.price;

            // Map to Listing format for UI
            const mappedListing = {
                id: observed.id,
                propertyId: `DETECTED-${observed.id.substring(0, 8)}`, // Virtual prop ID
                title: observed.title || 'Detected Property',
                description: observed.description || `Detected via ${observed.snapshot?.source?.name || 'Scraper'}. \n\nOriginal URL: ${observed.snapshot?.url}`,
                address: observed.address,
                price: priceInMXN, // Converted price
                currency: 'MXN', // Always return MXN after conversion
                propertyType: isLand ? 'land' : 'commercial', // Map type
                status: isRent ? 'RENT' : 'SALE', // UI badge status
                source: observed.snapshot?.source?.name || 'SCRAPER',
                images: imgArray, // Actual images from crawler
                videos: [],
                mapUrl: mapUrl, // Auto-generated or extracted
                isObserved: true, // Flag for UI if needed
                imagesEnriched: observed.snapshot?.imagesEnriched || false // Track enrichment status
            };
            return res.json(mappedListing);
        }

        console.log(`[API] Listing not found in either DB: ${id}`);
        return res.status(404).json({ error: 'Not found' });

    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Fetch single listing failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/protected/listings/:id — Update listing
app.patch('/api/protected/listings/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        const { title, description, address, city, state, zipCode, propertyType, status, price, mapUrl, images, videos } = req.body;

        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Listing not found' });

        const updatedListing = await prisma.listing.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(state !== undefined && { state }),
                ...(zipCode !== undefined && { zipCode }),
                ...(propertyType !== undefined && { propertyType }),
                ...(status !== undefined && { status }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(mapUrl !== undefined && { mapUrl }),
                ...(images !== undefined && { images: JSON.stringify(images) }),
                ...(videos !== undefined && { videos: JSON.stringify(videos) }),
            }
        });

        res.json({
            ...updatedListing,
            images: updatedListing.images ? JSON.parse(updatedListing.images) : [],
            videos: updatedListing.videos ? JSON.parse(updatedListing.videos) : [],
        });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Update listing failed:', err);
        res.status(500).json({ error: err.message || 'Failed to update listing' });
    }
});

// DELETE /api/protected/listings/:id — Delete listing
app.delete('/api/protected/listings/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Listing not found' });

        await prisma.listing.delete({ where: { id } });
        res.json({ success: true, id });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Delete listing failed:', err);
        res.status(500).json({ error: err.message || 'Failed to delete listing' });
    }
});

// POST /api/public/listings/:id/view — Track listing views (feeds dashboard chart)
app.post('/api/public/listings/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const { viewerId, device } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

        await prisma.listingView.create({
            data: {
                listingId: id,
                viewerId: viewerId || null,
                ip: typeof ip === 'string' ? ip : null,
                device: device || null,
            }
        });
        res.json({ tracked: true });
    } catch (error) {
        console.error('[API] Track view error:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
});

// Manual image enrichment endpoint
app.post('/api/intelligence/enrich-images/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        console.log(`[API] Manual enrichment requested for listing ${listingId}`);

        const images = await imageEnrichmentService.enrichListingImages(listingId);

        res.json({
            success: true,
            images,
            count: images.length
        });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Manual enrichment failed:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.put('/api/protected/listings/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        const { title, price, description, address, type, mapUrl, images, videos } = req.body;

        // Check if it exists in Canonical
        const existing = await prisma.listing.findUnique({ where: { id } });

        if (existing) {
            // Parse existing images for rule context
            const previousImages = existing.images ? JSON.parse(existing.images as string) : [];

            // Construct "Previous" State
            const previousState = {
                ...existing,
                images: previousImages,
                price: existing.price // Ensure number
            };

            // Construct "Current" State (Merged)
            const currentState = {
                ...previousState,
                title: title ?? existing.title,
                description: description ?? existing.description,
                address: address ?? existing.address,
                propertyType: type ?? existing.propertyType,
                price: price ? parseFloat(price) : existing.price,
                images: images ?? previousImages,
                status: req.body.status || existing.status
            };

            // --- RULE ENGINE INTEGRATION (UPDATE) ---
            const event: GovernanceEvent = {
                id: `evt-${Date.now()}`,
                type: GovernanceEventType.LISTING_UPDATED,
                timestamp: new Date(),
                actorId: req.user.id,
                sourceId: 'MANUAL',
                payload: {
                    previous: previousState,
                    current: currentState
                }
            };

            const { results } = await ruleEngineService.processEvent(event, req.user);

            const blockingErrors = results.filter(r => !r.passed && r.actionRequired?.type === 'BLOCK');
            if (blockingErrors.length > 0) {
                console.warn(`[GOVERNANCE] Blocked listing update ${id}:`, blockingErrors);
                return res.status(400).json({
                    error: 'Governance Validation Failed',
                    details: blockingErrors.map(e => e.reasons).flat()
                });
            }
            // --- END RULE ENGINE ---

            const updated = await prisma.listing.update({
                where: { id },
                data: {
                    title,
                    description,
                    address,
                    propertyType: type,
                    price: price ? parseFloat(price) : undefined,
                    mapUrl,
                    images: images ? JSON.stringify(images) : undefined,
                    videos: videos ? JSON.stringify(videos) : undefined
                }
            });
            return res.json(updated);
        }

        // If not, PROMOTION (Import from Observed)
        // We reuse the ID from ObservedListing to keep URL valid
        console.log(`[API] Promoting ObservedListing ${id} to Canonical Listing`);

        // --- RULE ENGINE INTEGRATION (PROMOTION/CREATION) ---
        const tempId = `TEMP-${Date.now()}`;
        const proposedListing = {
            id: tempId,
            propertyId: `PROP-${Date.now()}`,
            title: title || 'Untitled',
            description: description || '',
            address: address || '',
            propertyType: type || 'commercial',
            status: 'ACTIVE',
            source: 'SCRAPER',
            sourceId: id,
            price: parseFloat(price) || 0,
            mapUrl: mapUrl || null,
            images: images || [],
            videos: videos || [],
            ownerId: req.user.id,
            brokerId: req.user.brokerId
        };

        const event: GovernanceEvent = {
            id: `evt-${Date.now()}`,
            type: GovernanceEventType.LISTING_CREATED,
            timestamp: new Date(),
            actorId: req.user.id,
            sourceId: 'MANUAL',
            payload: proposedListing
        };

        const { results } = await ruleEngineService.processEvent(event, req.user);
        const blockingErrors = results.filter(r => !r.passed && r.actionRequired?.type === 'BLOCK');

        if (blockingErrors.length > 0) {
            console.warn(`[GOVERNANCE] Blocked listing promotion ${id}:`, blockingErrors);
            return res.status(400).json({
                error: 'Governance Validation Failed',
                details: blockingErrors.map(e => e.reasons).flat()
            });
        }
        // --- END RULE ENGINE ---

        const newListing = await prisma.listing.create({
            data: {
                id: id, // KEEP SAME ID
                propertyId: `PROP-${Date.now()}`,
                title: title || 'Untitled',
                description: description || '',
                address: address || '',
                propertyType: type || 'commercial',
                status: 'ACTIVE',
                source: 'SCRAPER',
                sourceId: id, // Link back
                price: parseFloat(price) || 0,
                mapUrl: mapUrl || null,
                images: JSON.stringify(images || []),
                videos: JSON.stringify(videos || []),
                ownerId: req.user.id,
                brokerId: req.user.brokerId
            }
        });

        // Optional: Delete from Observed or Mark Processed?
        res.json(newListing);

    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Update listing failed:', err);
        res.status(500).json({ error: 'Failed to update listing' });
    }
});

app.delete('/api/protected/listings/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        await prisma.listing.delete({ where: { id } });
        res.json({ message: 'Listing deleted' });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Delete listing failed:', err);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

// Dashboard Data (Protected)
app.get('/api/protected/dashboard/stats', async (req, res) => {
    try {
        const [blockCount, rules, activeCount, pendingCount, claimCount] = await Promise.all([
            prisma.auditLog.count({ where: { overallOutcome: 'BLOCK' } }),
            ruleEngineService.getRuleConfig(),
            prisma.listing.count({ where: { status: 'ACTIVE' } }),
            prisma.listing.count({ where: { status: 'PENDING_REVIEW' } }),
            prisma.claim.count({ where: { status: 'OPEN' } })
        ]);

        res.json({
            activeListings: activeCount,
            pendingReview: pendingCount,
            governanceAlerts: blockCount,
            openClaims: claimCount,
            systemHealth: '100%',
            activeRules: rules.filter(r => r.status === 'ACTIVE').length
        });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Dashboard stats failed:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/protected/dashboard/feed', async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' }
        });
        res.json(logs);
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] Dashboard feed failed:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// AI Content Generation: title, price, type, city, zipCode, description, and lat/lng for Street View + satellite photos
app.post('/api/ai/generate', verifyBlueJaxToken, async (req: any, res) => {
    try {
        const { address, type, lat, lng, city: bodyCity, zipCode: bodyZip } = req.body;
        if (!address || !type) {
            return res.status(400).json({ error: 'address and type required' });
        }

        let latRes = lat;
        let lngRes = lng;
        let cityRes = bodyCity || '';
        let zipCodeRes = bodyZip || '';

        // Fallback: Infer city from address string if not provided/geocoding failed
        if (!cityRes) {
            const lowerAddr = address.toLowerCase();
            if (lowerAddr.includes('chihuahua')) cityRes = 'Chihuahua';
            else if (lowerAddr.includes('juarez') || lowerAddr.includes('juárez')) cityRes = 'Juárez';
            else if (lowerAddr.includes('delicias')) cityRes = 'Delicias';
            else if (lowerAddr.includes('cuauhtemoc') || lowerAddr.includes('cuauhtémoc')) cityRes = 'Cuauhtémoc';
            else if (lowerAddr.includes('parral')) cityRes = 'Parral';
            else if (lowerAddr.includes('aldama')) cityRes = 'Aldama';
        }

        // Fallback: Infer zip if still missing (approximate defaults for demo)
        if (!zipCodeRes) {
            if (cityRes === 'Chihuahua') zipCodeRes = '31000';
            else if (cityRes === 'Juárez') zipCodeRes = '32000';
            else if (cityRes === 'Delicias') zipCodeRes = '33000';
            else if (cityRes === 'Cuauhtémoc') zipCodeRes = '31500';
            else if (cityRes === 'Parral') zipCodeRes = '33800';
            else if (cityRes === 'Aldama') zipCodeRes = '32900';
        }

        // COORDINATE FALLBACK (Runs independently of Zip/Geocode status)
        if (cityRes === 'Chihuahua') {
            console.log('[API] Hardcoding coords for Chihuahua');
            latRes = 28.6353; lngRes = -106.0889;
            if (!zipCodeRes) zipCodeRes = '31000';
        }
        else if (cityRes === 'Juárez' || cityRes === 'Cd Juarez') {
            latRes = 31.6904; lngRes = -106.4245;
            if (!zipCodeRes) zipCodeRes = '32000';
        }
        else if (cityRes === 'Delicias') {
            latRes = 28.1925; lngRes = -105.4716;
            if (!zipCodeRes) zipCodeRes = '33000';
        }
        else if (cityRes === 'Cuauhtémoc') {
            latRes = 28.4046; lngRes = -106.8622;
            if (!zipCodeRes) zipCodeRes = '31500';
        }
        else if (cityRes === 'Parral') {
            latRes = 26.9316; lngRes = -105.6660;
            if (!zipCodeRes) zipCodeRes = '33800';
        }
        else if (cityRes === 'Aldama') {
            latRes = 28.8411; lngRes = -105.9126;
            if (!zipCodeRes) zipCodeRes = '32900';
        }

        // Geocode if we don't have lat/lng (or want to resolve city/zip from Google)
        const apiKey = process.env.GOOGLE_MAPS_KEY || process.env.GOOGLE_API_KEY;
        if (apiKey) {
            try {
                const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();
                if (geoData.status === 'OK' && geoData.results?.[0]) {
                    const result = geoData.results[0];
                    const loc = result.geometry?.location;
                    if (loc) {
                        latRes = loc.lat;
                        lngRes = loc.lng;
                    }
                    if (result.address_components) {
                        for (const c of result.address_components) {
                            if (c.types.includes('locality')) cityRes = cityRes || c.long_name;
                            if (!cityRes && c.types.includes('sublocality')) cityRes = c.long_name;
                            if (!cityRes && c.types.includes('administrative_area_level_2')) cityRes = c.long_name;
                            if (!cityRes && c.types.includes('administrative_area_level_1')) cityRes = cityRes || c.long_name;
                            if (c.types.includes('postal_code')) zipCodeRes = zipCodeRes || c.short_name;
                        }
                    }
                } else if (geoData.status !== 'OK') {
                    console.warn('[API] Geocode API returned status:', geoData.status, geoData.error_message);
                }
            } catch (e: unknown) {
                console.warn('[API] Geocode failed, using address/body only:', (e as Error).message);
            }
        }

        // Simulated AI Generation (template-based; in production use OpenAI/Gemini)
        const adjectives = ['Impresionante', 'Exclusivo', 'Moderno', 'Espacioso', 'Lujoso', 'Premium'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const typeEs: { [key: string]: string } = {
            'commercial': 'Comercial',
            'residential': 'Residencial',
            'industrial': 'Industrial',
            'land': 'Terreno',
            'office': 'Oficinas'
        };
        const typeName = typeEs[type] || type;
        const firstPart = address.split(',')[0]?.trim() || address;
        const rest = address.split(',').slice(1).join(',').trim();

        const title = `${adj} Propiedad ${typeName} en ${firstPart}`;
        const description = `Bienvenido a esta excepcional oportunidad ${typeName.toLowerCase()} ubicada en ${rest || (cityRes || 'la zona')}. \n\nEsta propiedad ${adj.toLowerCase()} ofrece: \n- Ubicación premium con alta visibilidad \n- Amenidades modernas y espacios versátiles \n- Excelente potencial de crecimiento y retorno de inversión \n\nNo pierda esta oportunidad. Programe su visita privada hoy mismo.`;

        // Price Logic
        let basePrice = 5000000;
        if (type === 'land') basePrice = 3500000;
        else if (type === 'commercial') basePrice = 15000000;
        else if (type === 'industrial') basePrice = 8000000;
        else if (type === 'office') basePrice = 6000000;

        const variance = Math.floor(Math.random() * 2000000);
        const price = basePrice + variance;

        await new Promise(resolve => setTimeout(resolve, 800));

        res.json({
            title,
            description,
            price,
            detectedType: type,
            city: cityRes,
            zipCode: zipCodeRes,
            lat: latRes,
            lng: lngRes
        });
    } catch (error: unknown) {
        const err = error as any;
        console.error('[API] AI Generation failed:', err);
        res.status(500).json({ error: 'AI Generation Failed' });
    }
});

// Start Server
// Start Server only if run directly (not imported)
if (require.main === module) {
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`[STARTUP] MLS Core API v2 (Edit Listing Enabled) running on port ${PORT}`);
    });
}

export default app;

