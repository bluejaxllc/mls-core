import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/protected/notifications - List user's notifications
router.get('/', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit as string) || 20;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        // Parse data JSON field
        const parsed = notifications.map(n => ({
            ...n,
            data: n.data ? JSON.parse(n.data) : {}
        }));

        res.json(parsed);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// GET /api/protected/notifications/unread-count - Quick unread count
router.get('/unread-count', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const count = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        res.json({ count });
    } catch (error) {
        res.json({ count: 0 });
    }
});

// PATCH /api/protected/notifications/:id/read - Mark single as read
router.patch('/:id/read', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        if (notification.userId !== userId) return res.status(403).json({ error: 'Not authorized' });

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        res.json(updated);
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// PATCH /api/protected/notifications/read-all - Mark all as read
router.patch('/read-all', async (req: any, res) => {
    try {
        const userId = req.user.id;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

export default router;
