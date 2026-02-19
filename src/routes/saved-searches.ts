import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

/**
 * Build a Prisma `where` clause from saved search criteria JSON.
 * Criteria shape: { minPrice?, maxPrice?, city?, propertyType?, keyword?, status? }
 */
function buildListingWhere(criteria: any) {
    const where: any = {};

    if (criteria.minPrice || criteria.maxPrice) {
        where.price = {};
        if (criteria.minPrice) where.price.gte = Number(criteria.minPrice);
        if (criteria.maxPrice) where.price.lte = Number(criteria.maxPrice);
    }

    if (criteria.city) {
        where.city = { contains: criteria.city, mode: 'insensitive' };
    }

    if (criteria.propertyType) {
        where.propertyType = criteria.propertyType;
    }

    if (criteria.keyword) {
        where.OR = [
            { title: { contains: criteria.keyword, mode: 'insensitive' } },
            { address: { contains: criteria.keyword, mode: 'insensitive' } },
            { description: { contains: criteria.keyword, mode: 'insensitive' } },
        ];
    }

    if (criteria.status) {
        where.status = criteria.status;
    } else {
        // Default: only active listings
        where.status = 'ACTIVE';
    }

    return where;
}

// GET /api/protected/saved-searches - List user's saved searches with match counts
router.get('/', async (req: any, res) => {
    try {
        const userId = req.user.id;

        const searches = await prisma.savedSearch.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich each search with match count
        const enriched = await Promise.all(searches.map(async (search) => {
            let matchCount = 0;
            try {
                const criteria = JSON.parse(search.criteria || '{}');
                const where = buildListingWhere(criteria);
                matchCount = await prisma.listing.count({ where });
            } catch { /* skip if criteria unparseable */ }

            return {
                ...search,
                matchCount
            };
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Failed to fetch saved searches:', error);
        res.status(500).json({ error: 'Failed to fetch saved searches' });
    }
});

// POST /api/protected/saved-searches - Create a saved search
router.post('/', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { name, criteria, frequency } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const search = await prisma.savedSearch.create({
            data: {
                userId,
                name: name.trim(),
                criteria: typeof criteria === 'string' ? criteria : JSON.stringify(criteria || {}),
                frequency: frequency || 'INSTANT'
            }
        });

        // Get initial match count
        let matchCount = 0;
        try {
            const parsedCriteria = typeof criteria === 'string' ? JSON.parse(criteria) : (criteria || {});
            const where = buildListingWhere(parsedCriteria);
            matchCount = await prisma.listing.count({ where });
        } catch { /* skip */ }

        res.json({ ...search, matchCount });
    } catch (error) {
        console.error('Failed to create saved search:', error);
        res.status(500).json({ error: 'Failed to create saved search' });
    }
});

// GET /api/protected/saved-searches/:id/matches - Get match count + top 5 preview listings
router.get('/:id/matches', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const search = await prisma.savedSearch.findUnique({ where: { id } });
        if (!search) return res.status(404).json({ error: 'Saved search not found' });
        if (search.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        const criteria = JSON.parse(search.criteria || '{}');
        const where = buildListingWhere(criteria);

        const [count, previews] = await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    address: true,
                    price: true,
                    propertyType: true,
                    status: true,
                    images: true,
                    city: true,
                }
            })
        ]);

        // Parse images for previews
        const enrichedPreviews = previews.map(p => ({
            ...p,
            image: (() => {
                try {
                    const imgs = JSON.parse(p.images || '[]');
                    return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null;
                } catch { return null; }
            })()
        }));

        // Update lastRunAt
        await prisma.savedSearch.update({
            where: { id },
            data: { lastRunAt: new Date() }
        });

        res.json({
            matchCount: count,
            previews: enrichedPreviews,
            criteria,
            lastRunAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Failed to get matches:', error);
        res.status(500).json({ error: 'Failed to get matches' });
    }
});

// POST /api/protected/saved-searches/:id/run - Execute full search
router.post('/:id/run', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const limit = parseInt(req.query.limit as string) || 20;

        const search = await prisma.savedSearch.findUnique({ where: { id } });
        if (!search) return res.status(404).json({ error: 'Saved search not found' });
        if (search.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        const criteria = JSON.parse(search.criteria || '{}');
        const where = buildListingWhere(criteria);

        const [total, results] = await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    price: true,
                    propertyType: true,
                    status: true,
                    images: true,
                    trustScore: true,
                    createdAt: true,
                }
            })
        ]);

        // Update lastRunAt
        await prisma.savedSearch.update({
            where: { id },
            data: { lastRunAt: new Date() }
        });

        res.json({ total, results, criteria });
    } catch (error) {
        console.error('Failed to run search:', error);
        res.status(500).json({ error: 'Failed to run search' });
    }
});

// DELETE /api/protected/saved-searches/:id - Delete a saved search
router.delete('/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const search = await prisma.savedSearch.findUnique({ where: { id } });
        if (!search) return res.status(404).json({ error: 'Saved search not found' });
        if (search.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        await prisma.savedSearch.delete({ where: { id } });
        res.json({ deleted: true });
    } catch (error) {
        console.error('Failed to delete saved search:', error);
        res.status(500).json({ error: 'Failed to delete saved search' });
    }
});

// PATCH /api/protected/saved-searches/:id - Update frequency or name
router.patch('/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { frequency, name } = req.body;

        const search = await prisma.savedSearch.findUnique({ where: { id } });
        if (!search) return res.status(404).json({ error: 'Saved search not found' });
        if (search.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        const data: any = {};
        if (frequency) data.frequency = frequency;
        if (name) data.name = name.trim();

        const updated = await prisma.savedSearch.update({ where: { id }, data });
        res.json(updated);
    } catch (error) {
        console.error('Failed to update saved search:', error);
        res.status(500).json({ error: 'Failed to update saved search' });
    }
});

export default router;
