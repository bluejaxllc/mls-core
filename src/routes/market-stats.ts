import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/public/market-stats - Aggregated market statistics
router.get('/', async (_req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            select: { price: true, propertyType: true, status: true, city: true, createdAt: true }
        });

        const active = listings.filter(l => l.status === 'ACTIVE' || l.status === 'active');
        const prices = active.map(l => l.price).filter(p => p > 0).sort((a, b) => a - b);

        const avgPrice = prices.length > 0 ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
        const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
        const minPrice = prices.length > 0 ? prices[0] : 0;
        const maxPrice = prices.length > 0 ? prices[prices.length - 1] : 0;

        // By property type
        const byType: Record<string, { count: number; avgPrice: number }> = {};
        for (const l of active) {
            const t = l.propertyType || 'Otro';
            if (!byType[t]) byType[t] = { count: 0, avgPrice: 0 };
            byType[t].count++;
            byType[t].avgPrice += l.price;
        }
        for (const t of Object.keys(byType)) {
            byType[t].avgPrice = Math.round(byType[t].avgPrice / byType[t].count);
        }

        // By city
        const byCity: Record<string, number> = {};
        for (const l of active) {
            const c = l.city || 'Sin Ciudad';
            byCity[c] = (byCity[c] || 0) + 1;
        }

        // Monthly new listings (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthly: Record<string, number> = {};
        for (const l of listings) {
            if (l.createdAt >= sixMonthsAgo) {
                const key = `${l.createdAt.getFullYear()}-${String(l.createdAt.getMonth() + 1).padStart(2, '0')}`;
                monthly[key] = (monthly[key] || 0) + 1;
            }
        }

        res.json({
            totalListings: listings.length,
            activeListings: active.length,
            avgPrice: Math.round(avgPrice),
            medianPrice,
            minPrice,
            maxPrice,
            byPropertyType: byType,
            byCity,
            monthlyTrend: Object.entries(monthly)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, count]) => ({ month, count }))
        });
    } catch (error) {
        console.error('Failed to fetch market stats:', error);
        res.status(500).json({ error: 'Failed to fetch market stats' });
    }
});

export default router;
