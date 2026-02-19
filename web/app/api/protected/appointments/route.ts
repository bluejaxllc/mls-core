
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const appointmentSchema = z.object({
    listingId: z.string().min(1, "Listing ID is required"),
    startTime: z.string().datetime(), // ISO Date string
    endTime: z.string().datetime(),
    notes: z.string().optional(),
});

// GET: List appointments for the current user (either as visitor or agent)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role') || 'visitor'; // 'visitor' or 'agent'

        const whereClause = role === 'agent'
            ? { agentId: session.user.id }
            : { visitorId: session.user.id };

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                listing: {
                    select: { title: true, address: true, images: true }
                }
            },
            orderBy: { startTime: 'asc' },
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error('[APPOINTMENT_GET] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Request a new appointment
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = appointmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { listingId, startTime, endTime, notes } = validation.data;

        // Fetch listing to identify the agent/owner
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { ownerId: true, address: true }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        // Attempt to auto-assign agentId. If listing has no owner, maybe use a default or error out.
        // For now, assume listing.ownerId exists. If null, fall back to a system admin or fail.
        const agentId = listing.ownerId || 'system-admin';

        const appointment = await prisma.appointment.create({
            data: {
                listingId,
                visitorId: session.user.id,
                agentId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
                status: 'PENDING'
            },
        });

        // Send notification to Agent
        try {
            const { notificationService } = await import('@/services/NotificationService');
            // @ts-ignore
            await notificationService.notifyAppointmentRequest(agentId, {
                listingId,
                listingAddress: listing.address || 'Unknown Address',
                visitorName: session.user.name,
                visitorEmail: session.user.email,
                startTime,
                notes
            });
        } catch (e) {
            console.error('Failed to send notification', e);
        }

        return NextResponse.json(appointment, { status: 201 });

    } catch (error) {
        console.error('[APPOINTMENT_POST] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update status (Confirm/Cancel)
export async function PATCH(req: Request) {
    // This would likely be in a separate dynamic route [id]/route.ts, but for simplicity/MVP
    // we can handle it here if we pass ID requires params. 
    // Actually, Next.js App Router prefers [id]/route.ts for specific resource updates.
    // I will create a separate file for this.
    return NextResponse.json({ error: 'Method not allowed on collection' }, { status: 405 });
}
