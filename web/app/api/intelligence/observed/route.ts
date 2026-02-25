import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const observed = await prismaIntelligence.observedListing.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { snapshot: { include: { source: true } } }
        });
        return NextResponse.json(observed);
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to fetch observed listings', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
