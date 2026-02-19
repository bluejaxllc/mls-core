
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/audit-logs - List audit logs with pagination and filters
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const { source, status } = req.query;

        const where: any = {};
        if (source) where.source = source as string;
        if (status) where.overallOutcome = status as string;

        const [items, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { timestamp: 'desc' }
            }),
            prisma.auditLog.count({ where })
        ]);

        res.json({
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/audit-logs/:id - Get details of a specific log
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const log = await prisma.auditLog.findUnique({
            where: { id }
        });

        if (!log) {
            return res.status(404).json({ error: 'Audit log not found' });
        }

        res.json(log);
    } catch (error) {
        console.error('Failed to fetch audit log details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
