import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role') || 'agent';

        const where = role === 'visitor' ? { visitorId: userId } : { agentId: userId };
        const appointments = await prismaCore.appointment.findMany({
            where,
            include: { listing: { select: { title: true, address: true, images: true } } },
            orderBy: { startTime: 'desc' }
        });

        const parsed = appointments.map((apt: any) => ({
            ...apt,
            listing: { ...apt.listing, images: apt.listing.images ? JSON.parse(apt.listing.images) : [] }
        }));

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error('Failed to fetch appointments:', error);
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { listingId, startTime, endTime, notes } = await req.json();

        if (!listingId || !startTime || !endTime) return NextResponse.json({ error: 'listingId, startTime, and endTime are required' }, { status: 400 });

        const listing = await prismaCore.listing.findUnique({ where: { id: listingId } });
        if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

        const agentId = listing.ownerId;
        if (!agentId) return NextResponse.json({ error: 'This listing has no assigned agent' }, { status: 400 });
        if (agentId === userId) return NextResponse.json({ error: 'Cannot request appointment with yourself' }, { status: 400 });

        const appointment = await prismaCore.appointment.create({
            data: { listingId, agentId, visitorId: userId, startTime: new Date(startTime), endTime: new Date(endTime), notes: notes || null, status: 'PENDING' },
            include: { listing: { select: { title: true, address: true } } }
        });

        await prismaCore.notification.create({
            data: { userId: agentId, type: 'APPOINTMENT_REQUEST', title: 'Nueva Solicitud de Visita', message: `Solicitud de visita para "${listing.title || 'tu propiedad'}"`, data: JSON.stringify({ appointmentId: appointment.id, listingId }) }
        }).catch((err: any) => console.warn('Failed to create appointment notification:', err));

        return NextResponse.json(appointment);
    } catch (error: any) {
        console.error('Failed to create appointment:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
