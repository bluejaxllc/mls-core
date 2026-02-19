
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/public/agents
// List agents with optional filtering
router.get('/', async (req, res) => {
    try {
        const { search, city, specialty } = req.query;

        const where: any = {
            roles: { contains: 'agent' } // Assuming 'agent' role exists in comma-sep string
        };

        if (search) {
            where.OR = [
                { firstName: { contains: String(search) } },
                { lastName: { contains: String(search) } },
                { email: { contains: String(search) } }
            ];
        }

        // Filter by location (locationId maps to city in this simple implementation, or we join)
        // For MVP, if we don't have a City model, we might search string fields if available.
        // The User model has 'locationId'. Let's assume for now we filter by exact match if provided.
        if (city) {
            // In a real app, this would query a Location or City table.
            // Here we'll check if locationId matches or if we fallback to some other field.
            // Since User table has 'locationId', let's stick to that for now.
            where.locationId = String(city);
        }

        // Filter by specialty (JSON array stored as string)
        if (specialty) {
            where.specialties = { contains: String(specialty) };
        }

        const agents = await prisma.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true,
                locationId: true,
                bio: true,
                licenseNumber: true,
                specialties: true,
                languages: true,
                phoneNumber: true,
                whatsapp: true,
                instagram: true,
                mlsStatus: true,
                createdAt: true, // "Member since"
            },
            take: 50
        });

        res.json(agents);

    } catch (error) {
        console.error('[AGENTS_LIST] Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/public/agents/:id
// Get details for a specific agent
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const agent = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true,
                locationId: true,
                bio: true,
                licenseNumber: true,
                specialties: true,
                languages: true,
                phoneNumber: true,
                whatsapp: true,
                instagram: true,
                mlsStatus: true,
                createdAt: true,
            }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Get public metrics
        const listingCount = await prisma.listing.count({
            where: {
                ownerId: id,
                status: 'ACTIVE'
            }
        });

        const soldCount = await prisma.listing.count({
            where: {
                ownerId: id,
                status: 'SOLD'
            }
        });

        res.json({
            ...agent,
            stats: {
                activeListings: listingCount,
                soldListings: soldCount
            }
        });

    } catch (error) {
        console.error('[AGENT_DETAILS] Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/public/agents/:id/listings
// Get active listings for a specific agent
router.get('/:id/listings', async (req, res) => {
    try {
        const { id } = req.params;

        const listings = await prisma.listing.findMany({
            where: {
                ownerId: id,
                status: 'ACTIVE'
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                propertyId: true,
                title: true,
                price: true,
                address: true,
                city: true,
                state: true,
                images: true, // Should parse this on frontend
                propertyType: true,
                createdAt: true
            }
        });

        res.json(listings);

    } catch (error) {
        console.error('[AGENT_LISTINGS] Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
