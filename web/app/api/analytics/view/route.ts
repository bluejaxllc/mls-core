
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const viewSchema = z.object({
    listingId: z.string().uuid(),
    viewerId: z.string().optional(),
    device: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validation = viewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { listingId, viewerId, device } = validation.data;

        // Get IP (Basic extraction, varies by deployment)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        await prisma.listingView.create({
            data: {
                listingId,
                viewerId,
                device,
                ip
            }
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error('[ANALYTICS] Error recording view:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
