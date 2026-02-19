import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/protected/favorites - List user's favorites
router.get('/', async (req: any, res) => {
    try {
        const userId = req.user.id;

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with listing data
        const enriched = await Promise.all(
            favorites.map(async (fav) => {
                const listing = await prisma.listing.findUnique({
                    where: { id: fav.listingId },
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        address: true,
                        city: true,
                        images: true,
                        propertyType: true,
                        status: true,
                    }
                });
                return { ...fav, listing };
            })
        );

        // Filter out favorites where listing was deleted
        res.json(enriched.filter(f => f.listing));
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// POST /api/protected/favorites - Toggle favorite
router.post('/', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { listingId, notes } = req.body;

        if (!listingId) return res.status(400).json({ error: 'listingId is required' });

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: { userId_listingId: { userId, listingId } }
        });

        if (existing) {
            // Remove favorite
            await prisma.favorite.delete({ where: { id: existing.id } });
            return res.json({ action: 'removed', id: existing.id });
        }

        // Add favorite
        const favorite = await prisma.favorite.create({
            data: { userId, listingId, notes }
        });

        res.json({ action: 'added', ...favorite });
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

// GET /api/protected/favorites/check/:listingId - Quick check
router.get('/check/:listingId', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.params;

        const exists = await prisma.favorite.findUnique({
            where: { userId_listingId: { userId, listingId } }
        });

        res.json({ isFavorited: !!exists });
    } catch (error) {
        res.json({ isFavorited: false });
    }
});

// GET /api/protected/favorites/ids - Return all favorited listing IDs for current user
router.get('/ids', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            select: { listingId: true }
        });
        res.json(favorites.map(f => f.listingId));
    } catch (error) {
        res.json([]);
    }
});

// --- Collections ---

// GET /api/protected/favorites/collections - List user's collections
router.get('/collections', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const collections = await prisma.collection.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });

        // Parse listingIds and count
        const enriched = collections.map(c => ({
            ...c,
            listingIds: JSON.parse(c.listingIds),
            count: JSON.parse(c.listingIds).length,
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Failed to fetch collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// POST /api/protected/favorites/collections - Create a collection
router.post('/collections', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { name, description, color } = req.body;

        if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

        const collection = await prisma.collection.create({
            data: {
                userId,
                name: name.trim(),
                description: description || null,
                color: color || '#3B82F6'
            }
        });

        res.json(collection);
    } catch (error) {
        console.error('Failed to create collection:', error);
        res.status(500).json({ error: 'Failed to create collection' });
    }
});

// PATCH /api/protected/favorites/collections/:id - Add/remove listing from collection
router.patch('/collections/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { listingId, action } = req.body; // action: 'add' | 'remove'

        const collection = await prisma.collection.findUnique({ where: { id } });
        if (!collection) return res.status(404).json({ error: 'Collection not found' });
        if (collection.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        let ids: string[] = JSON.parse(collection.listingIds);

        if (action === 'add' && !ids.includes(listingId)) {
            ids.push(listingId);
        } else if (action === 'remove') {
            ids = ids.filter(i => i !== listingId);
        }

        const updated = await prisma.collection.update({
            where: { id },
            data: { listingIds: JSON.stringify(ids) }
        });

        res.json({ ...updated, listingIds: ids, count: ids.length });
    } catch (error) {
        console.error('Failed to update collection:', error);
        res.status(500).json({ error: 'Failed to update collection' });
    }
});

// DELETE /api/protected/favorites/collections/:id
router.delete('/collections/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const collection = await prisma.collection.findUnique({ where: { id } });
        if (!collection) return res.status(404).json({ error: 'Collection not found' });
        if (collection.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        await prisma.collection.delete({ where: { id } });
        res.json({ deleted: true });
    } catch (error) {
        console.error('Failed to delete collection:', error);
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});

export default router;
