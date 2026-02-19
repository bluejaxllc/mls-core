import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

// GET /api/dashboard/stats
export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'stats';

        if (type === 'feed') {
            const logs = await prismaCore.auditLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 20,
                select: { eventType: true, details: true, timestamp: true }
            });
            return NextResponse.json(logs.map((l: any) => ({
                message: l.details || l.eventType,
                timestamp: l.timestamp
            })));
        }

        if (type === 'chart') {
            const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const result: { name: string; views: number }[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                const count = await prismaCore.listingView.count({
                    where: { createdAt: { gte: start, lt: end } }
                });
                result.push({ name: days[start.getDay()], views: count });
            }
            return NextResponse.json(result);
        }

        // Default: stats
        const [activeListings, newLeads, pendingAppointments] = await Promise.all([
            prismaCore.listing.count({ where: { ownerId: userId, status: 'ACTIVE' } }),
            prismaCore.lead.count({ where: { status: 'NEW' } }),
            prismaCore.appointment.count({ where: { agentId: userId, status: 'PENDING' } }),
        ]);
        return NextResponse.json({ activeListings, newLeads, pendingAppointments });
    } catch (error: any) {
        console.error('Dashboard error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
