import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/public/reviews/:agentId - Get reviews for an agent (PUBLIC)
router.get('/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { agentId },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.review.count({ where: { agentId } })
        ]);

        // Calculate average rating
        const allRatings = await prisma.review.findMany({
            where: { agentId },
            select: { rating: true }
        });

        const avgRating = allRatings.length > 0
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
            : 0;

        // Rating distribution
        const distribution = [1, 2, 3, 4, 5].map(star => ({
            stars: star,
            count: allRatings.filter(r => r.rating === star).length
        }));

        // Enrich with reviewer names
        const enriched = await Promise.all(
            reviews.map(async (rev) => {
                const reviewer = await prisma.user.findUnique({
                    where: { id: rev.reviewerId },
                    select: { firstName: true, lastName: true }
                });
                return {
                    ...rev,
                    reviewerName: reviewer
                        ? `${reviewer.firstName || ''} ${reviewer.lastName || ''}`.trim() || 'Usuario'
                        : 'Usuario Anónimo'
                };
            })
        );

        res.json({
            reviews: enriched,
            total,
            avgRating: Math.round(avgRating * 10) / 10,
            distribution,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

export default router;
