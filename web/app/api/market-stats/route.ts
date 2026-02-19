import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';

export async function GET() {
    try {
        const listings = await prismaCore.listing.findMany({
            select: { price: true, propertyType: true, status: true, city: true, createdAt: true }
        });

        const active = listings.filter((l: any) => l.status === 'ACTIVE' || l.status === 'active');
        const prices = active.map((l: any) => l.price).filter((p: number) => p > 0).sort((a: number, b: number) => a - b);

        const avgPrice = prices.length > 0 ? prices.reduce((s: number, p: number) => s + p, 0) / prices.length : 0;
        const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
        const minPrice = prices.length > 0 ? prices[0] : 0;
        const maxPrice = prices.length > 0 ? prices[prices.length - 1] : 0;

        const byType: Record<string, { count: number; avgPrice: number }> = {};
        for (const l of active) { const t = (l as any).propertyType || 'Otro'; if (!byType[t]) byType[t] = { count: 0, avgPrice: 0 }; byType[t].count++; byType[t].avgPrice += (l as any).price; }
        for (const t of Object.keys(byType)) { byType[t].avgPrice = Math.round(byType[t].avgPrice / byType[t].count); }

        const byCity: Record<string, number> = {};
        for (const l of active) { const c = (l as any).city || 'Sin Ciudad'; byCity[c] = (byCity[c] || 0) + 1; }

        const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthly: Record<string, number> = {};
        for (const l of listings) { if ((l as any).createdAt >= sixMonthsAgo) { const key = `${(l as any).createdAt.getFullYear()}-${String((l as any).createdAt.getMonth() + 1).padStart(2, '0')}`; monthly[key] = (monthly[key] || 0) + 1; } }

        return NextResponse.json({
            totalListings: listings.length, activeListings: active.length,
            avgPrice: Math.round(avgPrice), medianPrice, minPrice, maxPrice,
            byPropertyType: byType, byCity,
            monthlyTrend: Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }))
        });
    } catch (error: any) {
        console.error('Failed to fetch market stats:', error);
        return NextResponse.json({ error: 'Failed to fetch market stats' }, { status: 500 });
    }
}
