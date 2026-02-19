import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || undefined;
        const where: any = {};
        if (status) where.status = status;

        const listings = await prismaCore.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        const parsedListings = listings.map((l: any) => ({
            ...l,
            images: l.images ? JSON.parse(l.images) : [],
            videos: l.videos ? JSON.parse(l.videos) : []
        }));

        return NextResponse.json(parsedListings);
    } catch (error: any) {
        console.error('[API] Fetch listings failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const { title, price, description, address, type, mapUrl, images, videos } = await req.json();

        if (!title || !price || !address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newListing = await prismaCore.listing.create({
            data: {
                propertyId: `PROP-${Date.now()}`,
                title,
                description,
                address,
                propertyType: type || 'commercial',
                status: 'ACTIVE',
                source: 'MANUAL',
                price: parseFloat(price),
                mapUrl: mapUrl || null,
                images: JSON.stringify(images || []),
                videos: JSON.stringify(videos || []),
                ownerId: auth.id,
                brokerId: auth.brokerId
            }
        });

        return NextResponse.json(newListing);
    } catch (error: any) {
        console.error('[API] Create listing failed:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
