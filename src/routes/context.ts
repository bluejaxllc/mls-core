import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

/**
 * GET /api/protected/context/summary
 * Returns live context data for the authenticated agent:
 * - Trust score (computed from listing quality + reviews)
 * - Latest governance rule evaluations
 * - Recent activity feed from audit logs
 */
router.get('/summary', async (req: any, res) => {
    try {
        const userId = req.user.id;

        // ── Trust Score ──
        // Based on: listing verification rate, data completeness, and review average
        const listings = await prisma.listing.findMany({
            where: { ownerId: userId },
            select: {
                id: true,
                trustScore: true,
                title: true,
                description: true,
                address: true,
                images: true,
                price: true,
                lastVerifiedAt: true,
                status: true
            }
        });

        let trustScore = 50; // Default if no listings
        let trustLabel = 'Sin datos';
        const trustBreakdown: { category: string; score: number; max: number }[] = [];

        if (listings.length > 0) {
            // 1) Average listing trust score (max 40 points)
            const avgTrustScore = listings.reduce((sum, l) => sum + l.trustScore, 0) / listings.length;
            const trustPoints = Math.round((avgTrustScore / 100) * 40);
            trustBreakdown.push({ category: 'Calidad de Datos', score: trustPoints, max: 40 });

            // 2) Data completeness (max 30 points) 
            let completenessTotal = 0;
            for (const l of listings) {
                let fields = 0;
                if (l.title) fields++;
                if (l.description) fields++;
                if (l.address) fields++;
                if (l.price) fields++;
                const imgs = JSON.parse(l.images || '[]');
                if (Array.isArray(imgs) && imgs.length > 0) fields++;
                completenessTotal += (fields / 5) * 100;
            }
            const avgCompleteness = completenessTotal / listings.length;
            const completenessPoints = Math.round((avgCompleteness / 100) * 30);
            trustBreakdown.push({ category: 'Completitud', score: completenessPoints, max: 30 });

            // 3) Review average (max 30 points)
            const reviews = await prisma.review.findMany({
                where: { agentId: userId },
                select: { rating: true }
            });
            let reviewPoints = 15; // Default: neutral
            if (reviews.length > 0) {
                const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                reviewPoints = Math.round((avgRating / 5) * 30);
            }
            trustBreakdown.push({ category: 'Reseñas', score: reviewPoints, max: 30 });

            trustScore = trustBreakdown.reduce((sum, b) => sum + b.score, 0);
            trustScore = Math.min(100, Math.max(0, trustScore));
            trustLabel = trustScore >= 80 ? 'Excelente' :
                trustScore >= 60 ? 'Bueno' :
                    trustScore >= 40 ? 'Regular' : 'Necesita Mejora';
        }

        // ── Governance Rule Evaluations ──
        // Get the most recent audit logs that have rule results
        const recentAudits = await prisma.auditLog.findMany({
            where: {
                actorId: userId,
                rulesEvaluated: { gt: 0 }
            },
            orderBy: { timestamp: 'desc' },
            take: 5,
            select: {
                id: true,
                eventType: true,
                overallOutcome: true,
                rulesEvaluated: true,
                details: true,
                results: true,
                timestamp: true
            }
        });

        // Extract latest unique rule results
        const ruleResults: { name: string; status: string; color: string }[] = [];
        const seenRules = new Set<string>();

        for (const audit of recentAudits) {
            try {
                const results = JSON.parse(audit.results || '{}');
                if (results.rules && Array.isArray(results.rules)) {
                    for (const rule of results.rules) {
                        if (!seenRules.has(rule.ruleId || rule.name)) {
                            seenRules.add(rule.ruleId || rule.name);
                            const outcome = (rule.outcome || rule.status || '').toUpperCase();
                            ruleResults.push({
                                name: rule.name || rule.ruleId || 'Regla',
                                status: outcome === 'PASS' ? 'PASS' :
                                    outcome === 'BLOCK' ? 'BLOCK' :
                                        outcome === 'WARN' || outcome === 'FLAG' ? 'WARN' : outcome,
                                color: outcome === 'PASS' ? 'green' :
                                    outcome === 'BLOCK' ? 'red' :
                                        outcome === 'WARN' || outcome === 'FLAG' ? 'yellow' : 'gray'
                            });
                        }
                    }
                }
            } catch { /* skip unparseable */ }
        }

        // If no real rule results, provide defaults from latest audit outcome 
        if (ruleResults.length === 0 && recentAudits.length > 0) {
            ruleResults.push({
                name: 'Evaluación General',
                status: recentAudits[0].overallOutcome,
                color: recentAudits[0].overallOutcome === 'PASS' ? 'green' :
                    recentAudits[0].overallOutcome === 'BLOCK' ? 'red' : 'yellow'
            });
        }

        // ── Activity Feed ──
        const activityLogs = await prisma.auditLog.findMany({
            where: { actorId: userId },
            orderBy: { timestamp: 'desc' },
            take: 8,
            select: {
                id: true,
                eventType: true,
                details: true,
                timestamp: true,
                overallOutcome: true,
                source: true,
            }
        });

        const activity = activityLogs.map(log => ({
            id: log.id,
            type: log.eventType,
            description: log.details || formatEventType(log.eventType),
            timestamp: log.timestamp,
            source: log.source,
            outcome: log.overallOutcome
        }));

        // ── Quick Stats ──
        const totalListings = listings.length;
        const activeListings = listings.filter(l => l.status === 'ACTIVE').length;
        const unreadNotifications = await prisma.notification.count({
            where: { userId, isRead: false }
        });

        res.json({
            trustScore,
            trustLabel,
            trustBreakdown,
            ruleResults,
            activity,
            stats: {
                totalListings,
                activeListings,
                unreadNotifications,
            }
        });

    } catch (error) {
        console.error('[Context Summary] Error:', error);
        res.status(500).json({ error: 'Failed to fetch context summary' });
    }
});

function formatEventType(eventType: string): string {
    const map: Record<string, string> = {
        'LISTING_CREATED': 'Listado creado',
        'LISTING_UPDATED': 'Listado actualizado',
        'LISTING_DELETED': 'Listado eliminado',
        'PRICE_UPDATED': 'Precio actualizado',
        'LISTING_VERIFIED': 'Verificación completada',
        'LISTING_PUBLISHED': 'Listado publicado',
        'RULE_EVALUATION': 'Evaluación de reglas',
        'STATUS_CHANGE': 'Cambio de estado',
    };
    return map[eventType] || eventType.replace(/_/g, ' ').toLowerCase();
}

export default router;
