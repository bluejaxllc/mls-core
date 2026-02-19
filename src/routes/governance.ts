
import { Router } from 'express';
import { ruleEngineService } from '../rules/setup';
import { prisma } from '../lib/prisma';
import { GovernanceEventType, ClaimType, ClaimStatus } from '../rules/types';
import { notificationService } from '../services/NotificationService';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/governance/claims
router.post('/claims', async (req, res) => {
    try {
        const { listingId, type, evidence, notes } = req.body;
        const user = (req as any).user; // From middleware

        if (!listingId || !type) {
            return res.status(400).json({ error: 'listingId and type are required' });
        }

        const claimId = uuidv4();
        const eventId = uuidv4();

        // 1. Persist Claim to DB
        const claim = await prisma.claim.create({
            data: {
                id: claimId,
                listingId,
                claimantId: user?.id || 'anonymous',
                type: type as string,
                status: 'OPEN',
                evidence: JSON.stringify(evidence || {}),
                notes
            }
        });

        const claimPayload = {
            id: claimId,
            listingId,
            claimantId: user?.id || 'anonymous',
            type: type as ClaimType,
            status: ClaimStatus.OPEN,
            evidence: evidence || {}
        };

        const event = {
            id: eventId,
            type: GovernanceEventType.CLAIM_FILED,
            timestamp: new Date(),
            actorId: user?.id || 'anonymous',
            sourceId: 'API',
            payload: claimPayload
        };

        console.log(`[GOVERNANCE] Processing Claim ${claimId} for Listing ${listingId}`);

        // 2. Process Event (Evaluate Rules + Execute Actions)
        const { results, actionsExecuted } = await ruleEngineService.processEvent(event, user);

        // 3. Update Claim Status if Auto-Resolved/Rejected by rules?
        // For now, we keep it OPEN unless a rule specifically closes it (not implemented yet).

        // 4. Notify Owner
        try {
            const listing = await prisma.listing.findUnique({
                where: { id: listingId },
                select: { ownerId: true }
            });

            if (listing?.ownerId) {
                await notificationService.notifyOwnerClaimFiled(listing.ownerId, listingId, type);
            }
        } catch (e) {
            console.error('[GOVERNANCE] Failed to send notification:', e);
        }

        // 5. Return Result
        res.json({
            claim,
            status: 'PROCESSED',
            governanceResults: results,
            actionsTaken: actionsExecuted
        });

    } catch (error: any) {
        console.error('[GOVERNANCE] Claim submission failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/governance/claims
router.get('/claims', async (req, res) => {
    try {
        const user = (req as any).user;
        const isAdmin = user?.roles?.includes('admin');

        const where: any = {};
        if (!isAdmin) {
            where.claimantId = user.id;
        }

        const claims = await prisma.claim.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON evidence
        const parsedClaims = claims.map(c => ({
            ...c,
            evidence: c.evidence ? JSON.parse(c.evidence) : {}
        }));

        res.json(parsedClaims);
    } catch (error: any) {
        console.error('[GOVERNANCE] Fetch claims failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
