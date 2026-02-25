import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const events = await prismaIntelligence.crawlEvent.findMany({
            orderBy: { startTime: 'desc' },
            take: 50,
            include: { source: true }
        });
        return NextResponse.json(events);
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to fetch crawl events', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
