import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/protected/leads - List leads for agent's listings
router.get('/', async (req: any, res) => {
    try {
        const userId = req.user.id;

        // Find listings owned by this agent
        const myListings = await prisma.listing.findMany({
            where: { ownerId: userId },
            select: { id: true, title: true }
        });

        const myListingIds = myListings.map(l => l.id);
        const listingMap = Object.fromEntries(myListings.map(l => [l.id, l.title]));

        // Fetch leads for those listings
        const leads = await prisma.lead.findMany({
            where: { listingId: { in: myListingIds } },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with listing title
        const enriched = leads.map(lead => ({
            ...lead,
            listingTitle: listingMap[lead.listingId] || 'Propiedad'
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// PATCH /api/protected/leads/:id - Update lead status
router.patch('/:id', async (req: any, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Use NEW, CONTACTED, or CLOSED.' });
        }

        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) return res.status(404).json({ error: 'Lead not found' });

        // Verify this lead belongs to one of the agent's listings
        const listing = await prisma.listing.findUnique({ where: { id: lead.listingId } });
        if (!listing || listing.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this lead' });
        }

        const updated = await prisma.lead.update({
            where: { id },
            data: { status }
        });

        res.json(updated);
    } catch (error) {
        console.error('Failed to update lead:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

export default router;

// --- Public Lead Submission Router ---
export const publicLeadsRouter = Router();

// POST /api/public/leads - Submit a new lead (no auth needed)
publicLeadsRouter.post('/', async (req: any, res) => {
    try {
        const { listingId, name, email, phone, message } = req.body;

        if (!listingId || !name || !email) {
            return res.status(400).json({ error: 'listingId, name, and email are required' });
        }

        // Verify listing exists
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        const lead = await prisma.lead.create({
            data: {
                listingId,
                name,
                email,
                phone: phone || null,
                message: message || null
            }
        });

        // Create notification for the listing owner if they exist
        if (listing.ownerId) {
            await prisma.notification.create({
                data: {
                    userId: listing.ownerId,
                    type: 'NEW_LEAD',
                    title: 'Nuevo Lead Recibido',
                    message: `${name} está interesado en "${listing.title || 'tu propiedad'}"`,
                    data: JSON.stringify({ leadId: lead.id, listingId })
                }
            }).catch(err => console.warn('Failed to create lead notification:', err));
        }

        res.json({ success: true, id: lead.id });
    } catch (error) {
        console.error('Failed to create lead:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});
