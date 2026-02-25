import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sources = await prismaIntelligence.sourceProfile.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(sources);
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to fetch sources', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
