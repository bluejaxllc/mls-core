import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

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
        const skip = (page - 1) * limit;

        // 1. Fetch Canonical Listings
        const where: any = {};
        if (status && status !== 'OBSERVED') where.status = status;

        if (city && city !== 'All') {
            where.address = { contains: city };
        }
        if (propertyType) {
            where.propertyType = propertyType;
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

        const canonical = await prismaCore.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip
        });

        // 2. Fetch Observed Listings (Intelligence)
        let observed: any[] = [];
        if (!status || status === 'OBSERVED') {
            const whereObs: any = {};
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

            try {
                observed = await prismaIntelligence.observedListing.findMany({
                    where: whereObs,
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip,
                    include: { snapshot: { include: { source: true } } }
                });
            } catch (e) {
                // Intelligence DB may not exist yet — graceful fallback
                console.warn('[Search] Intelligence DB query failed, skipping observed listings');
            }
        }

        // 3. Unify Results
        const unified = [
            ...canonical.map((c: any) => ({
                id: c.id,
                type: 'CANONICAL',
                title: c.title,
                price: c.price,
                address: c.address,
                status: c.status,
                image: c.images ? JSON.parse(c.images)[0] : null,
                trustScore: c.trustScore,
                source: c.source,
                updatedAt: c.updatedAt
            })),
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
                    confidence: o.confidenceScore
                };
            })
        ];

        unified.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return NextResponse.json({
            data: unified,
            page,
            limit,
            total: unified.length
        });

    } catch (e: any) {
        console.error('[Search] Failed:', e);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
