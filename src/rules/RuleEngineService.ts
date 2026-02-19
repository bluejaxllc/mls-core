import { prisma } from '../lib/prisma';
import { RuleEngine } from './RuleEngine';
import { RuleRegistry } from './RuleRegistry';
import { GovernanceEvent, RuleStatus, ExternalServices, RuleResult, RuleActionType } from './types';

export class RuleEngineService {
    constructor(
        private engine: RuleEngine,
        private registry: RuleRegistry,
        private services: ExternalServices
    ) { }

    // Public API for event processing
    async processEvent(event: GovernanceEvent, currentUser: any): Promise<{ results: RuleResult[], actionsExecuted: string[] }> {
        const results = await this.engine.evaluateEvent(event, currentUser);

        // Execute Actions (Side Effects)
        const actionsExecuted = await this.executeActions(results);

        return { results, actionsExecuted };
    }

    private async executeActions(results: RuleResult[]): Promise<string[]> {
        const executed: string[] = [];

        for (const result of results) {
            if (!result.passed && result.actionRequired) {
                const action = result.actionRequired;

                if (action.type === 'AUTO_CORRECT') {
                    const { targetId, field, newValue } = action.details;

                    if (targetId && field === 'status' && newValue) {
                        try {
                            const updated = await prisma.listing.update({
                                where: { id: targetId },
                                data: { status: newValue }
                            });
                            executed.push(`Updated listing ${targetId} status to ${newValue}`);
                            console.log(`[GOVERNANCE] Auto-Correct: Updated ${targetId} status to ${newValue}`);

                            // NOTIFICATION TRIGGER
                            if (newValue === 'SUSPENDED' && updated.ownerId) {
                                const { notificationService } = await import('../services/NotificationService');
                                await notificationService.notifyListingSuspended(
                                    updated.ownerId,
                                    targetId,
                                    result.reasons.join(', ') || 'Governance Rule Violation'
                                );
                            }

                        } catch (e) {
                            console.error(`[GOVERNANCE] Failed to auto-correct listing ${targetId}:`, e);
                        }
                    }
                } else if (action.type === 'CREATE_CLAIM') {
                    const { type, targetListingId, claimantId, evidence } = action.details;

                    if (targetListingId && type) {
                        try {
                            const newClaim = await prisma.claim.create({
                                data: {
                                    id: `CLAIM-AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                    listingId: targetListingId,
                                    claimantId: claimantId || 'SYSTEM',
                                    type: type,
                                    status: 'OPEN',
                                    evidence: JSON.stringify(evidence || {}),
                                    notes: 'Automatically created by Governance Rule Engine'
                                }
                            });
                            executed.push(`Created Auto-Claim ${newClaim.id} for Listing ${targetListingId}`);
                            console.log(`[GOVERNANCE] Auto-Claim Created: ${newClaim.id}`);

                            // Notify Owner
                            const listing = await prisma.listing.findUnique({
                                where: { id: targetListingId },
                                select: { ownerId: true }
                            });

                            if (listing?.ownerId) {
                                const { notificationService } = await import('../services/NotificationService');
                                await notificationService.notifyOwnerClaimFiled(listing.ownerId, targetListingId, type);
                            }

                        } catch (e) {
                            console.error(`[GOVERNANCE] Failed to create auto-claim for ${targetListingId}:`, e);
                        }
                    }
                }
            }
        }
        return executed;
    }

    // Admin API: List all rules and their status
    getRuleConfig() {
        return this.registry.getAllRules().map(r => ({
            id: r.id,
            name: r.name,
            status: this.registry.getRuleStatus(r.id),
            description: r.description,
            triggerEvents: r.triggerEvents,
            priority: r.priority,
            version: r.version || '1.0'
        }));
    }

    // Admin API: Enable/Disable rules
    updateRuleStatus(ruleId: string, status: RuleStatus): boolean {
        const rule = this.registry.getRule(ruleId);
        if (!rule) return false;

        this.registry.setRuleStatus(ruleId, status);
        console.log(`[ADMIN] Rule ${ruleId} status updated to ${status}`);
        return true;
    }
}
