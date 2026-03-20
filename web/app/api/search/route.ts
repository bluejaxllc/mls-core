import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const status = searchParams.get('status') || '';
        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 50);
        const city = searchParams.get('city') || '';
        const listingType = searchParams.get('listingType') || 'ALL';
        const propertyType = searchParams.get('propertyType') || '';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const source = searchParams.get('source') || '';
        const skip = (page - 1) * limit;

        // 1. Fetch Canonical Listings
        const where: import('@prisma/client-core').Prisma.ListingWhereInput = {};
        if (status && status !== 'OBSERVED') {
            where.status = status;
        } else {
            where.status = { not: 'EXPIRED' };
        }

        if (city && city !== 'All') {
            where.address = { contains: city };
        }
        if (propertyType && propertyType !== 'ALL') {
            where.propertyType = propertyType;
        }
        if (source && source !== 'ALL') {
            where.source = { contains: source, mode: 'insensitive' };
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { address: { contains: q } }
            ];
        }

        const [canonical, canonicalCount] = await Promise.all([
            prismaCore.listing.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip
            }),
            prismaCore.listing.count({ where })
        ]);

        // 2. Fetch Observed Listings (Intelligence)
        let observed: any[] = [];
        let observedCount = 0;
        if (!status || status === 'OBSERVED') {
            const whereObs: import('@prisma/client-intelligence').Prisma.ObservedListingWhereInput = {};
            if (city && city !== 'All') {
                whereObs.address = { contains: city };
            }
            if (listingType !== 'ALL') {
                if (listingType === 'RENT') whereObs.status = 'DETECTED_RENT';
                else if (listingType === 'SALE') whereObs.status = 'DETECTED_SALE';
            }
            if (q) {
                whereObs.OR = [
                    { title: { contains: q } },
                    { address: { contains: q } }
                ];
            }
            if (source && source !== 'ALL') {
                whereObs.snapshot = {
                    source: {
                        name: { contains: source, mode: 'insensitive' }
                    }
                };
            }

            try {
                const [obsDocs, obsCount] = await Promise.all([
                    prismaIntelligence.observedListing.findMany({
                        where: whereObs,
                        orderBy: { createdAt: 'desc' },
                        take: limit,
                        skip,
                        include: { snapshot: { include: { source: true } } }
                    } as any),
                    prismaIntelligence.observedListing.count({ where: whereObs } as any)
                ]);
                observed = obsDocs;
                observedCount = obsCount;
            } catch (e) {
                // Intelligence DB may not exist yet — graceful fallback
                console.warn('[Search] Intelligence DB query failed, skipping observed listings');
            }
        }

        // 3. Unify Results
        const unified = [
            ...canonical.map((c: any) => {
                let parsedImages: string[] = [];
                try { parsedImages = c.images ? JSON.parse(c.images) : []; } catch (e) { }
                return {
                    id: c.id,
                    type: 'CANONICAL',
                    title: c.title,
                    description: c.description,
                    price: c.price,
                    address: c.address,
                    city: c.city,
                    state: c.state,
                    status: c.status,
                    propertyType: c.propertyType,
                    image: parsedImages[0] || null,
                    images: parsedImages,
                    trustScore: c.trustScore,
                    source: c.source,
                    sourceUrl: c.sourceUrl,
                    bedrooms: (c as any).bedrooms || 0,
                    bathrooms: (c as any).bathrooms || 0,
                    area: (c as any).area || 0,
                    lat: c.mapUrl?.includes(',') ? parseFloat(c.mapUrl.split(',')[0]) : null,
                    lng: c.mapUrl?.includes(',') ? parseFloat(c.mapUrl.split(',')[1]) : null,
                    updatedAt: c.updatedAt
                };
            }),
            ...observed.map((o: any) => {
                let imgUrl = null;
                let rawData: any = {};
                try {
                    if (o.snapshot?.rawHtml && o.snapshot.rawHtml.startsWith('{')) {
                        rawData = JSON.parse(o.snapshot.rawHtml);
                        imgUrl = rawData.image || (rawData.images && rawData.images[0]) || null;
                    }
                } catch (e) { /* ignore parse error */ }

                const isRent = o.status === 'DETECTED_RENT' || o.title?.toLowerCase().includes('rent') || o.description?.includes('RENT');
                const isLand = o.description?.includes('LAND') || o.description?.includes('TERRENO') ||
                    o.title?.toLowerCase().includes('terreno') || o.title?.toLowerCase().includes('lot');

                const USD_TO_MXN_RATE = 18;
                const priceInMXN = o.currency === 'USD'
                    ? Math.round((o.price || 0) * USD_TO_MXN_RATE)
                    : o.price;

                return {
                    id: o.id,
                    type: 'OBSERVED',
                    title: o.title || 'Unknown Title',
                    price: priceInMXN,
                    currency: 'MXN',
                    address: o.address,
                    status: isRent ? 'RENT' : 'SALE',
                    propertyType: isLand ? 'LAND' : 'RESIDENTIAL',
                    image: imgUrl,
                    trustScore: o.snapshot?.source?.trustScore || 10,
                    source: o.snapshot?.source?.name || 'Unknown',
                    sourceUrl: o.snapshot?.url,
                    updatedAt: o.createdAt,
                    confidence: o.confidenceScore,
                    lat: o.lat || null,
                    lng: o.lng || null
                };
            })
        ];

        unified.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return NextResponse.json({
            data: unified,
            page,
            limit,
            total: canonicalCount + observedCount
        });

    } catch (e: any) {
        console.error('[Search] Failed:', e);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
