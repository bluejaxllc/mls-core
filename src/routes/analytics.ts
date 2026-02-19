
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/protected/analytics/overview
// Returns aggregate analytics for the authenticated agent's listings
router.get('/overview', async (req: any, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Get all listing IDs owned by this agent
        const agentListings = await prisma.listing.findMany({
            where: { ownerId: userId },
            select: { id: true, title: true }
        });

        const listingIds = agentListings.map(l => l.id);

        if (listingIds.length === 0) {
            return res.json({
                totalViews: 0,
                uniqueViewers: 0,
                weekTrend: 0,
                dailyViews: [],
                topListing: null
            });
        }

        // Total views
        const totalViews = await prisma.listingView.count({
            where: { listingId: { in: listingIds } }
        });

        // Unique viewers (distinct viewerId, excluding nulls)
        const uniqueViewersResult = await prisma.listingView.findMany({
            where: {
                listingId: { in: listingIds },
                viewerId: { not: null }
            },
            distinct: ['viewerId'],
            select: { viewerId: true }
        });
        const uniqueViewers = uniqueViewersResult.length;

        // Views in last 7 days vs previous 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekViews = await prisma.listingView.count({
            where: {
                listingId: { in: listingIds },
                createdAt: { gte: sevenDaysAgo }
            }
        });

        const lastWeekViews = await prisma.listingView.count({
            where: {
                listingId: { in: listingIds },
                createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo }
            }
        });

        const weekTrend = lastWeekViews > 0
            ? Math.round(((thisWeekViews - lastWeekViews) / lastWeekViews) * 100)
            : (thisWeekViews > 0 ? 100 : 0);

        // Daily views for last 30 days
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentViews = await prisma.listingView.findMany({
            where: {
                listingId: { in: listingIds },
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' }
        });

        // Aggregate by day
        const dailyMap: Record<string, number> = {};
        for (let d = 0; d < 30; d++) {
            const date = new Date(now.getTime() - (29 - d) * 24 * 60 * 60 * 1000);
            const key = date.toISOString().split('T')[0];
            dailyMap[key] = 0;
        }
        for (const v of recentViews) {
            const key = v.createdAt.toISOString().split('T')[0];
            if (dailyMap[key] !== undefined) dailyMap[key]++;
        }

        const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({
            date,
            views,
            label: new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
        }));

        // Top listing by view count
        const viewCounts = await prisma.listingView.groupBy({
            by: ['listingId'],
            where: { listingId: { in: listingIds } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 1
        });

        let topListing = null;
        if (viewCounts.length > 0) {
            const topId = viewCounts[0].listingId;
            const listing = agentListings.find(l => l.id === topId);
            topListing = {
                id: topId,
                title: listing?.title || 'Propiedad',
                views: viewCounts[0]._count.id
            };
        }

        res.json({
            totalViews,
            uniqueViewers,
            weekTrend,
            thisWeekViews,
            dailyViews,
            topListing
        });

    } catch (error) {
        console.error('[ANALYTICS] Overview error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/protected/analytics/listings/:id/views
// Returns view analytics for a specific listing
router.get('/listings/:id/views', async (req: any, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        // Verify the listing belongs to this agent
        const listing = await prisma.listing.findUnique({
            where: { id },
            select: { ownerId: true, title: true }
        });

        if (!listing) return res.status(404).json({ error: 'Listing not found' });
        if (listing.ownerId !== userId) return res.status(403).json({ error: 'Not your listing' });

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total & unique counts
        const totalViews = await prisma.listingView.count({ where: { listingId: id } });

        const uniqueResult = await prisma.listingView.findMany({
            where: { listingId: id, viewerId: { not: null } },
            distinct: ['viewerId'],
            select: { viewerId: true }
        });

        // Daily time series
        const recentViews = await prisma.listingView.findMany({
            where: { listingId: id, createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true, device: true },
            orderBy: { createdAt: 'asc' }
        });

        const dailyMap: Record<string, number> = {};
        for (let d = 0; d < 30; d++) {
            const date = new Date(now.getTime() - (29 - d) * 24 * 60 * 60 * 1000);
            dailyMap[date.toISOString().split('T')[0]] = 0;
        }
        for (const v of recentViews) {
            const key = v.createdAt.toISOString().split('T')[0];
            if (dailyMap[key] !== undefined) dailyMap[key]++;
        }

        const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({
            date,
            views,
            label: new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
        }));

        // Device breakdown
        const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, unknown: 0 };
        for (const v of recentViews) {
            const d = (v.device || 'unknown').toLowerCase();
            if (d.includes('mobile') || d.includes('phone') || d.includes('android') || d.includes('ios')) {
                deviceCounts.mobile++;
            } else if (d.includes('desktop') || d.includes('windows') || d.includes('mac') || d.includes('linux')) {
                deviceCounts.desktop++;
            } else {
                deviceCounts.unknown++;
            }
        }

        res.json({
            listingId: id,
            listingTitle: listing.title,
            totalViews,
            uniqueViewers: uniqueResult.length,
            dailyViews,
            deviceBreakdown: deviceCounts
        });

    } catch (error) {
        console.error('[ANALYTICS] Listing views error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/protected/analytics/rankings
// Returns top 10 most-viewed listings for the agent
router.get('/rankings', async (req: any, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Get agent's listings
        const agentListings = await prisma.listing.findMany({
            where: { ownerId: userId },
            select: { id: true, title: true, address: true, price: true, images: true, status: true }
        });

        const listingIds = agentListings.map(l => l.id);
        if (listingIds.length === 0) return res.json([]);

        // Group views by listing
        const viewCounts = await prisma.listingView.groupBy({
            by: ['listingId'],
            where: { listingId: { in: listingIds } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        });

        // Merge listing data with view counts
        const rankings = viewCounts.map(vc => {
            const listing = agentListings.find(l => l.id === vc.listingId);
            let images: string[] = [];
            try { images = JSON.parse(listing?.images || '[]'); } catch { }

            return {
                listingId: vc.listingId,
                title: listing?.title || 'Propiedad',
                address: listing?.address || '',
                price: listing?.price || 0,
                status: listing?.status || 'ACTIVE',
                image: images[0] || null,
                views: vc._count.id
            };
        });

        res.json(rankings);

    } catch (error) {
        console.error('[ANALYTICS] Rankings error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
