import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

// GET /api/leads — Protected: List leads for agent's listings
export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;

        const myListings = await prismaCore.listing.findMany({ where: { ownerId: auth.id }, select: { id: true, title: true } });
        const myListingIds = myListings.map((l: any) => l.id);
        const listingMap = Object.fromEntries(myListings.map((l: any) => [l.id, l.title]));

        const leads = await prismaCore.lead.findMany({ where: { listingId: { in: myListingIds } }, orderBy: { createdAt: 'desc' } });
        return NextResponse.json(leads.map((lead: any) => ({ ...lead, listingTitle: listingMap[lead.listingId] || 'Propiedad' })));
    } catch (error: any) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

// POST /api/leads — Public: Submit a new lead
export async function POST(req: NextRequest) {
    try {
        const { listingId, name, email, phone, message } = await req.json();
        if (!listingId || !name || !email) return NextResponse.json({ error: 'listingId, name, and email are required' }, { status: 400 });

        const listing = await prismaCore.listing.findUnique({ where: { id: listingId } });
        if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

        const lead = await prismaCore.lead.create({ data: { listingId, name, email, phone: phone || null, message: message || null } });

        if (listing.ownerId) {
            await prismaCore.notification.create({
                data: { userId: listing.ownerId, type: 'NEW_LEAD', title: 'Nuevo Lead Recibido', message: `${name} está interesado en "${listing.title || 'tu propiedad'}"`, data: JSON.stringify({ leadId: lead.id, listingId }) }
            }).catch((err: any) => console.warn('Failed to create lead notification:', err));
        }

        return NextResponse.json({ success: true, id: lead.id });
    } catch (error: any) {
        console.error('Failed to create lead:', error);
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
}
