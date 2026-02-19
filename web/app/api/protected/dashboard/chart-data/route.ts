
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper type for date comparison
interface DateRecord {
    createdAt: Date;
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Calculate stats for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Optimizing: Fetch all views in range for MVP (assuming low volume)
        // Using explicit types to avoid 'any' errors
        const allViews = await prisma.listingView.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        const allLeads = await prisma.lead.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        const allListings = await prisma.listing.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        // Process into chart format { name: 'Day', views: X, leads: Y, added: Z }
        const chartData = [];
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayName = days[d.getDay()];
            const dateStr = d.toDateString();

            const dayViews = allViews.filter((v: DateRecord) => new Date(v.createdAt).toDateString() === dateStr).length;
            const dayLeads = allLeads.filter((l: DateRecord) => new Date(l.createdAt).toDateString() === dateStr).length;
            const dayListings = allListings.filter((l: DateRecord) => new Date(l.createdAt).toDateString() === dateStr).length;

            chartData.push({
                name: dayName,
                views: dayViews,
                leads: dayLeads,
                added: dayListings
            });
        }

        return NextResponse.json(chartData);

    } catch (error) {
        console.error('[DASHBOARD_CHART] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
