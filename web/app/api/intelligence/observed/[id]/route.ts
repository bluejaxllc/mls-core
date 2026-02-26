import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prismaIntelligence.observedListing.findUnique({
            where: { id: params.id },
            include: { snapshot: { include: { source: true } } }
        });

        if (!item) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        // Inject the images and parse raw metadata
        let imageUrl = null;
        let images: string[] = [];

        if (item.snapshot?.rawJson) {
            try {
                const parsed = JSON.parse(item.snapshot.rawJson);
                if (parsed.pictures && parsed.pictures.length > 0) {
                    images = parsed.pictures.map((p: any) => p.url || p.secure_url);
                    imageUrl = images[0];
                }
            } catch (err) { }
        }

        return NextResponse.json({
            ...item,
            imageUrl,
            images,
            propertyType: 'commercial', // default for imported
            snapshot: {
                ...item.snapshot,
                rawJson: undefined
            }
        });
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to fetch observed listing by id', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
