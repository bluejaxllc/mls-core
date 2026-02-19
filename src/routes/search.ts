import express from 'express';
import { prisma as prismaCore } from '../lib/prisma';
import { prismaIntelligence } from '../lib/intelligencePrisma';

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const { q, status, page = 1, limit = 50, city, listingType, propertyType, minPrice, maxPrice } = req.query; // Default to 50
        const queryStr = req.query.q ? String(req.query.q) : '';
        const cityStr = city ? String(city) : '';
        const listingTypeStr = listingType ? String(listingType) : 'ALL';
        const propertyTypeStr = propertyType ? String(propertyType) : '';
        const minPriceNum = minPrice ? Number(minPrice) : null;
        const maxPriceNum = maxPrice ? Number(maxPrice) : null;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // 1. Fetch Canonical Listings
        const where: any = {};
        if (status && status !== 'OBSERVED') where.status = status;

        // City Filter (Smart Filter on Address)
        if (cityStr && cityStr !== 'All') {
            where.address = { contains: cityStr };
        }

        // Property Type Filter
        if (propertyTypeStr) {
            where.propertyType = propertyTypeStr;
        }

        // Price Range Filter
        if (minPriceNum || maxPriceNum) {
            where.price = {};
            if (minPriceNum) where.price.gte = minPriceNum;
            if (maxPriceNum) where.price.lte = maxPriceNum;
        }

        if (queryStr) {
            where.OR = [
                { title: { contains: queryStr } },
                { address: { contains: queryStr } }
            ];
        }

        const canonical = await prismaCore.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limitNum,
            skip: skip
        });

        // 2. Fetch Observed Listings (Intelligence)
        let observed: any[] = [];
        if (!status || status === 'OBSERVED') {
            const whereObs: any = {};

            // City Filter for Observed
            if (cityStr && cityStr !== 'All') {
                whereObs.address = { contains: cityStr };
            }

            // Listing Type Filter (RENT/SALE)
            if (listingTypeStr !== 'ALL') {
                if (listingTypeStr === 'RENT') {
                    whereObs.status = 'DETECTED_RENT';
                } else if (listingTypeStr === 'SALE') {
                    whereObs.status = 'DETECTED_SALE';
                }
            }

            if (queryStr) {
                whereObs.OR = [
                    { title: { contains: queryStr } },
                    { address: { contains: queryStr } }
                ];
            }

            observed = await prismaIntelligence.observedListing.findMany({
                where: whereObs,
                orderBy: { createdAt: 'desc' },
                take: limitNum,
                skip: skip,
                include: { snapshot: { include: { source: true } } }
            });
        }

        // 3. Unify Results
        const unified = [
            ...canonical.map(c => ({
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
            ...observed.map(o => {
                let imgUrl = null;
                let rawData: any = {};
                try {
                    // Try to parse rawHtml as JSON to get the image
                    if (o.snapshot?.rawHtml && o.snapshot.rawHtml.startsWith('{')) {
                        rawData = JSON.parse(o.snapshot.rawHtml);
                        imgUrl = rawData.image || (rawData.images && rawData.images[0]) || null;
                    }
                } catch (e) { /* ignore parse error */ }

                // Determine Rent vs Sale
                const isRent = o.status === 'DETECTED_RENT' || o.title?.toLowerCase().includes('rent') || o.description?.includes('RENT');

                // Determine Property Type (Land)
                const isLand = o.description?.includes('LAND') || o.description?.includes('TERRENO') ||
                    o.title?.toLowerCase().includes('terreno') || o.title?.toLowerCase().includes('lot');

                // Convert USD to MXN (approx exchange rate: 1 USD = 18 MXN)
                const USD_TO_MXN_RATE = 18;
                const priceInMXN = o.currency === 'USD'
                    ? Math.round((o.price || 0) * USD_TO_MXN_RATE)
                    : o.price;

                return {
                    id: o.id,
                    type: 'OBSERVED',
                    title: o.title || 'Unknown Title',
                    price: priceInMXN, // Converted price
                    currency: 'MXN', // Always return MXN after conversion
                    address: o.address,

                    // UI Badges / status
                    status: isRent ? 'RENT' : 'SALE',  // For badge display
                    propertyType: isLand ? 'LAND' : 'RESIDENTIAL', // For LAND badge

                    image: imgUrl,
                    trustScore: o.snapshot?.source?.trustScore || 10,
                    source: o.snapshot?.source?.name || 'Unknown',
                    sourceUrl: o.snapshot?.url,
                    updatedAt: o.createdAt,
                    confidence: o.confidenceScore
                };
            })
        ];

        // Sort combined list
        unified.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        // Slice again if we combined lists? 
        // For simplicity, if we query both, we might return limit*2 items. 
        // Ideally we'd separate endpoints or precise merging, but for now returning unified is fine.

        res.json({
            data: unified,
            page: pageNum,
            limit: limitNum,
            total: unified.length // approximate
        });

    } catch (e: any) {
        console.error('[Search] Failed:', e);
        res.status(500).json({ error: 'Search failed' });
    }
});

export default router;
