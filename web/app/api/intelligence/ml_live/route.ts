import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = 24;
        const skip = (page - 1) * pageSize;

        const source = await prismaIntelligence.sourceProfile.findFirst({
            where: { name: 'Mercado Libre Mexico' }
        });

        if (!source) {
            return NextResponse.json({
                listings: [], total: 0, page,
                message: 'Mercado Libre source profile not found.'
            });
        }

        const total = await prismaIntelligence.observedListing.count({
            where: { snapshot: { sourceId: source.id } }
        });

        const listings = await prismaIntelligence.observedListing.findMany({
            where: { snapshot: { sourceId: source.id } },
            include: {
                snapshot: {
                    select: {
                        rawJson: true, url: true,
                        source: { select: { name: true, type: true, baseUrl: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip, take: pageSize,
        });

        const enriched = listings.map((listing: any) => {
            let imageUrl = null;
            try {
                const raw = JSON.parse(listing.snapshot?.rawJson || '{}');
                imageUrl = raw.pictures?.[0]?.url || raw.pictures?.[0]?.secure_url || raw.thumbnail || null;
            } catch (e) { }
            return { ...listing, imageUrl };
        });

        return NextResponse.json({
            listings: enriched, total, page,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (e: any) {
        console.error('[ML Live] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
