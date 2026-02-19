import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { prismaIntelligence } from '@/lib/prisma-intelligence';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // 1. Try Canonical Listing
        const listing = await prismaCore.listing.findUnique({ where: { id } });

        if (listing) {
            const parsedListing: any = {
                id: listing.id,
                propertyId: listing.propertyId,
                title: listing.title,
                description: listing.description,
                address: listing.address,
                city: (listing as any).city,
                state: (listing as any).state,
                zipCode: (listing as any).zipCode,
                propertyType: listing.propertyType,
                status: listing.status,
                price: listing.price,
                source: listing.source,
                trustScore: listing.trustScore,
                mapUrl: listing.mapUrl,
                images: listing.images ? JSON.parse(listing.images) : [],
                videos: listing.videos ? JSON.parse(listing.videos) : [],
                lastVerifiedAt: listing.lastVerifiedAt,
                createdAt: listing.createdAt,
                updatedAt: listing.updatedAt,
                agent: null
            };

            // Fetch agent if ownerId exists
            if (listing.ownerId) {
                const agent = await prismaCore.user.findUnique({ where: { id: listing.ownerId } });
                if (agent) {
                    parsedListing.agent = {
                        id: agent.id,
                        name: `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Agente MLS',
                        email: agent.email,
                        phone: (agent as any).phoneNumber,
                        whatsapp: (agent as any).whatsapp,
                        bio: (agent as any).bio,
                        licenseNumber: (agent as any).licenseNumber,
                        languages: (agent as any).languages,
                        specialties: (agent as any).specialties
                    };
                }
            }
            return NextResponse.json(parsedListing);
        }

        // 2. Try Observed Listing (Intelligence)
        try {
            const observed = await prismaIntelligence.observedListing.findUnique({
                where: { id },
                include: { snapshot: { include: { source: true } } }
            });

            if (observed) {
                let imgArray: string[] = [];
                let mapUrl = null;
                let rawData: any = {};

                try {
                    if (observed.snapshot?.rawHtml && observed.snapshot.rawHtml.startsWith('{')) {
                        rawData = JSON.parse(observed.snapshot.rawHtml);
                        if (rawData.images && Array.isArray(rawData.images)) {
                            imgArray = rawData.images.filter((img: string) => img && img.trim());
                        } else if (rawData.image) {
                            imgArray = [rawData.image];
                        }
                        mapUrl = rawData.mapUrl || rawData.map_url;
                        if (!mapUrl && observed.address) {
                            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(observed.address)}`;
                        }
                    }
                } catch (e) {
                    console.warn('[API] Failed to parse observed listing rawHtml:', e);
                }

                const isRent = observed.status === 'DETECTED_RENT' || observed.title?.toLowerCase().includes('rent');
                const isLand = observed.description?.includes('LAND') || observed.title?.toLowerCase().includes('terreno');

                const USD_TO_MXN_RATE = 18;
                const priceInMXN = observed.currency === 'USD'
                    ? Math.round((observed.price || 0) * USD_TO_MXN_RATE)
                    : observed.price;

                return NextResponse.json({
                    id: observed.id,
                    propertyId: `DETECTED-${observed.id.substring(0, 8)}`,
                    title: observed.title || 'Propiedad Detectada',
                    description: observed.description || `Detectado via ${observed.snapshot?.source?.name || 'Scraper'}`,
                    address: observed.address,
                    propertyType: isLand ? 'land' : 'commercial',
                    status: isRent ? 'RENT' : 'SALE',
                    price: priceInMXN,
                    source: observed.snapshot?.source?.name || 'SCRAPER',
                    images: imgArray,
                    videos: [],
                    mapUrl,
                    isObserved: true,
                    agent: null
                });
            }
        } catch (e) {
            // Intelligence DB may not exist yet
            console.warn('[API] Intelligence DB query failed for listing detail');
        }

        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } catch (error: any) {
        console.error('[API] Fetch listing failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const { id } = params;
        const body = await req.json();
        const { title, description, address, city, state, zipCode, propertyType, status, price, mapUrl, images, videos } = body;

        const existing = await prismaCore.listing.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

        const updatedListing = await prismaCore.listing.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(state !== undefined && { state }),
                ...(zipCode !== undefined && { zipCode }),
                ...(propertyType !== undefined && { propertyType }),
                ...(status !== undefined && { status }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(mapUrl !== undefined && { mapUrl }),
                ...(images !== undefined && { images: JSON.stringify(images) }),
                ...(videos !== undefined && { videos: JSON.stringify(videos) }),
            }
        });

        return NextResponse.json({
            ...updatedListing,
            images: updatedListing.images ? JSON.parse(updatedListing.images) : [],
            videos: updatedListing.videos ? JSON.parse(updatedListing.videos) : [],
        });
    } catch (error: any) {
        console.error('[API] Update listing failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to update listing' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return PATCH(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const { id } = params;
        const existing = await prismaCore.listing.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

        await prismaCore.listing.delete({ where: { id } });
        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('[API] Delete listing failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete listing' }, { status: 500 });
    }
}
