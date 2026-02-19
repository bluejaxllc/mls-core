
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const leadSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10),
    listingId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const validation = leadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, phone, message, listingId } = validation.data;

        // Verify listing exists
        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        // Create Lead
        const lead = await prisma.lead.create({
            data: {
                listingId,
                name,
                email,
                phone,
                message,
                status: 'NEW'
            }
        });

        // In a real app, we would trigger an email notification to the agent here
        try {
            // Import dynamically since this is a Next.js API route and the service might assume Node env specifics
            // or shared code behavior.
            const { notificationService } = await import('@/services/NotificationService');

            // Assume listing owner email is known or fetched. For now, sending to a fixed agent email or the one associated with listing (mocked)
            const agentEmail = 'agent@remax-polanco.mx';

            await notificationService.notifyNewLead(agentEmail, {
                listingId,
                listingTitle: listing.title,
                name,
                email,
                phone,
                message,
                leadId: lead.id
            });
        } catch (notifyError) {
            console.error('[LEAD_API] Notification failed but lead saved:', notifyError);
        }

        return NextResponse.json(lead, { status: 201 });

    } catch (error) {
        console.error('[LEAD_API] Error creating lead:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
