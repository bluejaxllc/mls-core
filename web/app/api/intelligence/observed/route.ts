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

        // Inject the thumbnail images
        const mappedListings = observed.map(item => {
            let imageUrl = null;
            if (item.snapshot?.rawJson) {
                try {
                    const parsed = JSON.parse(item.snapshot.rawJson);
                    // Mercado Libre format maps pictures to an array
                    if (parsed.pictures && parsed.pictures.length > 0) {
                        imageUrl = parsed.pictures[0].url || parsed.pictures[0].secure_url;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
            // Return item with added imageUrl
            return {
                ...item,
                imageUrl,
                snapshot: {
                    ...item.snapshot,
                    rawJson: undefined // Don't bloat the network response
                }
            };
        });

        return NextResponse.json(mappedListings);
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to fetch observed listings', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
