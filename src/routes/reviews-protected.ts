import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// POST /api/protected/reviews - Leave a review
router.post('/', async (req: any, res) => {
    try {
        const reviewerId = req.user.id;
        const { agentId, listingId, rating, title, comment } = req.body;

        if (!agentId) return res.status(400).json({ error: 'agentId is required' });
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
        if (!comment?.trim()) return res.status(400).json({ error: 'Comment is required' });
        if (agentId === reviewerId) return res.status(400).json({ error: 'Cannot review yourself' });

        // Check if already reviewed this agent
        const existing = await prisma.review.findFirst({
            where: { agentId, reviewerId }
        });

        if (existing) {
            return res.status(409).json({ error: 'Ya has dejado una reseña para este agente' });
        }

        const review = await prisma.review.create({
            data: {
                agentId,
                reviewerId,
                listingId: listingId || null,
                rating: Math.round(rating),
                title: title?.trim() || null,
                comment: comment.trim()
            }
        });

        res.json(review);
    } catch (error) {
        console.error('Failed to create review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// GET /api/protected/reviews/my-reviews - Get reviews I've written
router.get('/my-reviews', async (req: any, res) => {
    try {
        const reviewerId = req.user.id;

        const reviews = await prisma.review.findMany({
            where: { reviewerId },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with agent info
        const enriched = await Promise.all(
            reviews.map(async (rev) => {
                const agent = await prisma.user.findUnique({
                    where: { id: rev.agentId },
                    select: { id: true, firstName: true, lastName: true, email: true }
                });
                return { ...rev, agent };
            })
        );

        res.json(enriched);
    } catch (error) {
        console.error('Failed to fetch my reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// PATCH /api/protected/reviews/:id/respond - Agent responds to a review
router.patch('/:id/respond', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { response } = req.body;

        if (!response?.trim()) return res.status(400).json({ error: 'Response is required' });

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) return res.status(404).json({ error: 'Review not found' });
        if (review.agentId !== userId) return res.status(403).json({ error: 'Only the reviewed agent can respond' });

        const updated = await prisma.review.update({
            where: { id },
            data: { response: response.trim() }
        });

        res.json(updated);
    } catch (error) {
        console.error('Failed to respond to review:', error);
        res.status(500).json({ error: 'Failed to respond' });
    }
});

// DELETE /api/protected/reviews/:id - Delete own review
router.delete('/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) return res.status(404).json({ error: 'Review not found' });
        if (review.reviewerId !== userId) return res.status(403).json({ error: 'Can only delete own reviews' });

        await prisma.review.delete({ where: { id } });
        res.json({ deleted: true });
    } catch (error) {
        console.error('Failed to delete review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

export default router;
