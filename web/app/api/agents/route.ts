import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const city = searchParams.get('city') || '';
        const specialty = searchParams.get('specialty') || '';

        const where: any = { roles: { contains: 'agent' } };
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } }
            ];
        }
        if (city) where.locationId = city;
        if (specialty) where.specialties = { contains: specialty };

        const agents = await prismaCore.user.findMany({
            where,
            select: {
                id: true, firstName: true, lastName: true, email: true, roles: true,
                locationId: true, bio: true, licenseNumber: true, specialties: true,
                languages: true, phoneNumber: true, whatsapp: true, instagram: true,
                mlsStatus: true, createdAt: true
            },
            take: 50
        });

        return NextResponse.json(agents);
    } catch (error: any) {
        console.error('[AGENTS] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
