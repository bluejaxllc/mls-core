import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/protected/appointments - List appointments
// Query: ?role=agent|visitor
router.get('/', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const role = req.query.role || 'agent';

        const where = role === 'visitor'
            ? { visitorId: userId }
            : { agentId: userId };

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                listing: {
                    select: { title: true, address: true, images: true }
                }
            },
            orderBy: { startTime: 'desc' }
        });

        // Parse listing images from JSON string
        const parsed = appointments.map(apt => ({
            ...apt,
            listing: {
                ...apt.listing,
                images: apt.listing.images ? JSON.parse(apt.listing.images) : []
            }
        }));

        res.json(parsed);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// POST /api/protected/appointments - Create appointment request
router.post('/', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { listingId, startTime, endTime, notes } = req.body;

        if (!listingId || !startTime || !endTime) {
            return res.status(400).json({ error: 'listingId, startTime, and endTime are required' });
        }

        // Find the listing and its agent
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        const agentId = listing.ownerId;
        if (!agentId) {
            return res.status(400).json({ error: 'This listing has no assigned agent' });
        }

        if (agentId === userId) {
            return res.status(400).json({ error: 'Cannot request an appointment with yourself' });
        }

        const appointment = await prisma.appointment.create({
            data: {
                listingId,
                agentId,
                visitorId: userId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes: notes || null,
                status: 'PENDING'
            },
            include: {
                listing: { select: { title: true, address: true } }
            }
        });

        // Create notification for the agent
        await prisma.notification.create({
            data: {
                userId: agentId,
                type: 'APPOINTMENT_REQUEST',
                title: 'Nueva Solicitud de Visita',
                message: `Solicitud de visita para "${listing.title || 'tu propiedad'}" el ${new Date(startTime).toLocaleDateString('es-MX')}`,
                data: JSON.stringify({ appointmentId: appointment.id, listingId })
            }
        }).catch(err => console.warn('Failed to create appointment notification:', err));

        res.json(appointment);
    } catch (error) {
        console.error('Failed to create appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// PATCH /api/protected/appointments/:id - Update appointment status
router.patch('/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Use CONFIRMED, CANCELLED, or COMPLETED.' });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: { listing: { select: { title: true } } }
        });

        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        // Only the agent can confirm/cancel
        if (appointment.agentId !== userId && appointment.visitorId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status }
        });

        // Notify the other party
        const recipientId = userId === appointment.agentId ? appointment.visitorId : appointment.agentId;
        const statusLabel = status === 'CONFIRMED' ? 'confirmada' : status === 'CANCELLED' ? 'cancelada' : 'completada';

        await prisma.notification.create({
            data: {
                userId: recipientId,
                type: `APPOINTMENT_${status}`,
                title: `Visita ${statusLabel}`,
                message: `Tu visita para "${appointment.listing.title || 'la propiedad'}" ha sido ${statusLabel}.`,
                data: JSON.stringify({ appointmentId: id })
            }
        }).catch(err => console.warn('Failed to create status notification:', err));

        res.json(updated);
    } catch (error) {
        console.error('Failed to update appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

export default router;
