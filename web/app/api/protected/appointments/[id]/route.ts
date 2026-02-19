
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
    status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const validation = updateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const { status } = validation.data;

        // Verify ownership (Agent)
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Only the assigned agent can confirm/cancel (or maybe the visitor can cancel?)
        // For now, strict: only agent can update status.
        if (appointment.agentId !== session.user.id) {
            // Allow visitor to CANCEL only
            if (appointment.visitorId === session.user.id && status === 'CANCELLED') {
                // Allowed
            } else {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status },
            include: { listing: { select: { address: true } } }
        });

        // Notify Visitor of status change
        try {
            const { notificationService } = await import('@/services/NotificationService');
            // @ts-ignore
            await notificationService.notifyAppointmentStatusChange(updated.visitorId, status, {
                listingId: updated.listingId,
                listingAddress: updated.listing?.address || 'Property',
                appointmentId: updated.id,
                newStatus: status
            });
        } catch (e) {
            console.error('Failed to notify visitor', e);
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[APPOINTMENT_PATCH] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
