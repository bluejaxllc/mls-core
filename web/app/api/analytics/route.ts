import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'overview';

        const agentListings = await prismaCore.listing.findMany({
            where: { ownerId: userId },
            select: { id: true, title: true, address: true, price: true, images: true, status: true }
        });
        const listingIds = agentListings.map((l: any) => l.id);

        if (type === 'rankings') {
            if (listingIds.length === 0) return NextResponse.json([]);
            const viewCounts = await prismaCore.listingView.groupBy({
                by: ['listingId'],
                where: { listingId: { in: listingIds } },
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10
            });
            const rankings = viewCounts.map((vc: any) => {
                const listing = agentListings.find((l: any) => l.id === vc.listingId);
                let images: string[] = [];
                try { images = JSON.parse(listing?.images || '[]'); } catch { }
                return { listingId: vc.listingId, title: listing?.title || 'Propiedad', address: listing?.address || '', price: listing?.price || 0, status: listing?.status || 'ACTIVE', image: images[0] || null, views: vc._count.id };
            });
            return NextResponse.json(rankings);
        }

        // Overview
        if (listingIds.length === 0) return NextResponse.json({ totalViews: 0, uniqueViewers: 0, weekTrend: 0, dailyViews: [], topListing: null });

        const totalViews = await prismaCore.listingView.count({ where: { listingId: { in: listingIds } } });
        const uniqueViewersResult = await prismaCore.listingView.findMany({
            where: { listingId: { in: listingIds }, viewerId: { not: null } },
            distinct: ['viewerId'],
            select: { viewerId: true }
        });

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const thisWeekViews = await prismaCore.listingView.count({ where: { listingId: { in: listingIds }, createdAt: { gte: sevenDaysAgo } } });
        const lastWeekViews = await prismaCore.listingView.count({ where: { listingId: { in: listingIds }, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } });
        const weekTrend = lastWeekViews > 0 ? Math.round(((thisWeekViews - lastWeekViews) / lastWeekViews) * 100) : (thisWeekViews > 0 ? 100 : 0);

        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentViews = await prismaCore.listingView.findMany({ where: { listingId: { in: listingIds }, createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true }, orderBy: { createdAt: 'asc' } });
        const dailyMap: Record<string, number> = {};
        for (let d = 0; d < 30; d++) { const date = new Date(now.getTime() - (29 - d) * 24 * 60 * 60 * 1000); dailyMap[date.toISOString().split('T')[0]] = 0; }
        for (const v of recentViews) { const key = v.createdAt.toISOString().split('T')[0]; if (dailyMap[key] !== undefined) dailyMap[key]++; }
        const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({ date, views, label: new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) }));

        const viewCounts = await prismaCore.listingView.groupBy({ by: ['listingId'], where: { listingId: { in: listingIds } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 1 });
        let topListing = null;
        if (viewCounts.length > 0) { const topId = viewCounts[0].listingId; const listing = agentListings.find((l: any) => l.id === topId); topListing = { id: topId, title: listing?.title || 'Propiedad', views: viewCounts[0]._count.id }; }

        return NextResponse.json({ totalViews, uniqueViewers: uniqueViewersResult.length, weekTrend, thisWeekViews, dailyViews, topListing });
    } catch (error: any) {
        console.error('[ANALYTICS] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
