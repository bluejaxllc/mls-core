import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

function buildListingWhere(criteria: any) {
    const where: any = {};
    if (criteria.minPrice || criteria.maxPrice) {
        where.price = {};
        if (criteria.minPrice) where.price.gte = Number(criteria.minPrice);
        if (criteria.maxPrice) where.price.lte = Number(criteria.maxPrice);
    }
    if (criteria.city) where.city = { contains: criteria.city };
    if (criteria.propertyType) where.propertyType = criteria.propertyType;
    if (criteria.keyword) {
        where.OR = [
            { title: { contains: criteria.keyword } },
            { address: { contains: criteria.keyword } },
            { description: { contains: criteria.keyword } },
        ];
    }
    where.status = criteria.status || 'ACTIVE';
    return where;
}

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const searches = await prismaCore.savedSearch.findMany({ where: { userId: auth.id }, orderBy: { createdAt: 'desc' } });
        const enriched = await Promise.all(searches.map(async (search: any) => {
            let matchCount = 0;
            try {
                const criteria = JSON.parse(search.criteria || '{}');
                matchCount = await prismaCore.listing.count({ where: buildListingWhere(criteria) });
            } catch { }
            return { ...search, matchCount };
        }));

        return NextResponse.json(enriched);
    } catch (error: any) {
        console.error('Failed to fetch saved searches:', error);
        return NextResponse.json({ error: 'Failed to fetch saved searches' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const { name, criteria, frequency } = await req.json();

        if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const search = await prismaCore.savedSearch.create({
            data: { userId: auth.id, name: name.trim(), criteria: typeof criteria === 'string' ? criteria : JSON.stringify(criteria || {}), frequency: frequency || 'INSTANT' }
        });

        let matchCount = 0;
        try {
            const parsedCriteria = typeof criteria === 'string' ? JSON.parse(criteria) : (criteria || {});
            matchCount = await prismaCore.listing.count({ where: buildListingWhere(parsedCriteria) });
        } catch { }

        return NextResponse.json({ ...search, matchCount });
    } catch (error: any) {
        console.error('Failed to create saved search:', error);
        return NextResponse.json({ error: 'Failed to create saved search' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        const search = await prismaCore.savedSearch.findUnique({ where: { id } });
        if (!search) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (search.userId !== auth.id) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

        await prismaCore.savedSearch.delete({ where: { id } });
        return NextResponse.json({ deleted: true });
    } catch (error: any) {
        console.error('Failed to delete saved search:', error);
        return NextResponse.json({ error: 'Failed to delete saved search' }, { status: 500 });
    }
}
