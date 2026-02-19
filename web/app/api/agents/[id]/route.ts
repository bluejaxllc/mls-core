import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const agent = await prismaCore.user.findUnique({
            where: { id },
            select: {
                id: true, firstName: true, lastName: true, email: true, roles: true,
                locationId: true, bio: true, licenseNumber: true, specialties: true,
                languages: true, phoneNumber: true, whatsapp: true, instagram: true,
                mlsStatus: true, createdAt: true
            }
        });

        if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

        const [activeListings, soldListings] = await Promise.all([
            prismaCore.listing.count({ where: { ownerId: id, status: 'ACTIVE' } }),
            prismaCore.listing.count({ where: { ownerId: id, status: 'SOLD' } })
        ]);

        return NextResponse.json({ ...agent, stats: { activeListings, soldListings } });
    } catch (error: any) {
        console.error('[AGENT_DETAILS] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
