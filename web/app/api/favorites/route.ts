import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;

        const favorites = await prismaCore.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const enriched = await Promise.all(
            favorites.map(async (fav: any) => {
                const listing = await prismaCore.listing.findUnique({
                    where: { id: fav.listingId },
                    select: { id: true, title: true, price: true, address: true, city: true, images: true, propertyType: true, status: true }
                });
                return { ...fav, listing };
            })
        );

        return NextResponse.json(enriched.filter((f: any) => f.listing));
    } catch (error: any) {
        console.error('Failed to fetch favorites:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { listingId, notes } = await req.json();

        if (!listingId) return NextResponse.json({ error: 'listingId is required' }, { status: 400 });

        const existing = await prismaCore.favorite.findUnique({
            where: { userId_listingId: { userId, listingId } }
        });

        if (existing) {
            await prismaCore.favorite.delete({ where: { id: existing.id } });
            return NextResponse.json({ action: 'removed', id: existing.id });
        }

        const favorite = await prismaCore.favorite.create({ data: { userId, listingId, notes } });
        return NextResponse.json({ action: 'added', ...favorite });
    } catch (error: any) {
        console.error('Failed to toggle favorite:', error);
        return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
    }
}
