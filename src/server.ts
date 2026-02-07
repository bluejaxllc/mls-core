import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GovernanceEventType, ListingStatus } from './rules/types';
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

// Search API (Unified)
import searchRouter from './routes/search';
app.use('/api/protected/search', searchRouter);

// Mercado Libre OAuth
import mercadolibreRouter from './routes/mercadolibre';
app.use('/api/auth/mercadolibre', mercadolibreRouter); // TODO: Re-add auth after fixing frontend session

// Import/Ingestion API
import importRouter from './routes/import';
// Router handles its own auth (Template is public, Upload is protected)
app.use('/api/import', importRouter);

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

        const newListing = await prisma.listing.create({
            data: {
                propertyId: `PROP-${Date.now()}`,
                title,
                description,
                address,
                propertyType: type,
                status: 'ACTIVE',
                source: 'MANUAL',
                price: parseFloat(price),
                mapUrl: mapUrl || null,
                images: JSON.stringify(images || []),
                videos: JSON.stringify(videos || []),
                ownerId: req.user.id,
            }
        });

        console.log(`[API] Created listing ${newListing.id} for user ${req.user.id}`);
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
            // Normal Update
            const updated = await prisma.listing.update({
                where: { id },
                data: {
                    title,
                    description,
                    address,
                    propertyType: type,
                    price: parseFloat(price),
                    mapUrl,
                    images: JSON.stringify(images || []),
                    videos: JSON.stringify(videos || [])
                }
            });
            return res.json(updated);
        }

        // If not, PROMOTION (Import from Observed)
        // We reuse the ID from ObservedListing to keep URL valid
        console.log(`[API] Promoting ObservedListing ${id} to Canonical Listing`);

        const newListing = await prisma.listing.create({
            data: {
                id: id, // KEEP SAME ID
                propertyId: `PROP-${Date.now()}`,
                title: title || 'Untitled',
                description: description || '',
                address: address || '',
                propertyType: type || 'commercial',
                status: 'ACTIVE', // Promote to ACTIVE immediately on save? Or PENDING? User clicked save...
                source: 'SCRAPER',
                sourceId: id, // Link back
                price: parseFloat(price) || 0,
                mapUrl: mapUrl || null,
                images: JSON.stringify(images || []),
                videos: JSON.stringify(videos || []),
                ownerId: req.user.id,
            }
        });

        // Optional: Delete from Observed or Mark Processed?
        // For now, we leave it. The Search logic might need adjustment to prefer Canonical if both exist.

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
        const [blockCount, rules, activeCount, pendingCount] = await Promise.all([
            prisma.auditLog.count({ where: { overallOutcome: 'BLOCK' } }),
            ruleEngineService.getRuleConfig(),
            prisma.listing.count({ where: { status: 'ACTIVE' } }),
            prisma.listing.count({ where: { status: 'PENDING_REVIEW' } })
        ]);

        res.json({
            activeListings: activeCount,
            pendingReview: pendingCount,
            governanceAlerts: blockCount,
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
app.post('/api/ai/generate', async (req: any, res) => {
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

