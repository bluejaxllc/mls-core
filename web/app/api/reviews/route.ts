import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

// GET /api/reviews?agentId=xxx — Public: Get reviews for an agent
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get('agentId');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Protected: my-reviews
        if (type === 'my-reviews') {
            const auth = await verifyAuth(req);
            if (isAuthError(auth)) return auth;
            const reviews = await prismaCore.review.findMany({ where: { reviewerId: auth.id }, orderBy: { createdAt: 'desc' } });
            const enriched = await Promise.all(reviews.map(async (rev: any) => {
                const agent = await prismaCore.user.findUnique({ where: { id: rev.agentId }, select: { id: true, firstName: true, lastName: true, email: true } });
                return { ...rev, agent };
            }));
            return NextResponse.json(enriched);
        }

        if (!agentId) return NextResponse.json({ error: 'agentId is required' }, { status: 400 });

        const [reviews, total] = await Promise.all([
            prismaCore.review.findMany({ where: { agentId }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            prismaCore.review.count({ where: { agentId } })
        ]);

        const allRatings = await prismaCore.review.findMany({ where: { agentId }, select: { rating: true } });
        const avgRating = allRatings.length > 0 ? allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / allRatings.length : 0;
        const distribution = [1, 2, 3, 4, 5].map(star => ({ stars: star, count: allRatings.filter((r: any) => r.rating === star).length }));

        const enriched = await Promise.all(reviews.map(async (rev: any) => {
            const reviewer = await prismaCore.user.findUnique({ where: { id: rev.reviewerId }, select: { firstName: true, lastName: true } });
            return { ...rev, reviewerName: reviewer ? `${reviewer.firstName || ''} ${reviewer.lastName || ''}`.trim() || 'Usuario' : 'Usuario Anónimo' };
        }));

        return NextResponse.json({ reviews: enriched, total, avgRating: Math.round(avgRating * 10) / 10, distribution, page, totalPages: Math.ceil(total / limit) });
    } catch (error: any) {
        console.error('Failed to fetch reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST /api/reviews — Protected: Leave a review
export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const { agentId, listingId, rating, title, comment } = await req.json();

        if (!agentId) return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
        if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
        if (!comment?.trim()) return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
        if (agentId === auth.id) return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 });

        const existing = await prismaCore.review.findFirst({ where: { agentId, reviewerId: auth.id } });
        if (existing) return NextResponse.json({ error: 'Ya has dejado una reseña para este agente' }, { status: 409 });

        const review = await prismaCore.review.create({
            data: { agentId, reviewerId: auth.id, listingId: listingId || null, rating: Math.round(rating), title: title?.trim() || null, comment: comment.trim() }
        });

        return NextResponse.json(review);
    } catch (error: any) {
        console.error('Failed to create review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
