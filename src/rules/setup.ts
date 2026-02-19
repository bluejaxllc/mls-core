
import { RuleRegistry } from './RuleRegistry';
import { prisma } from '../lib/prisma';
import { RuleEngine } from './RuleEngine';
import { RuleEngineService } from './RuleEngineService';
import { TrustService } from './TrustService';
import { AuditService } from './AuditService';
import { ExternalServices } from './types';

// Concrete implementation of services for Production/API
class CoreServices implements ExternalServices {
    public trustService: TrustService;
    public auditService: AuditService;

    constructor() {
        this.trustService = new TrustService();
        this.auditService = new AuditService();
    }

    async findActiveListingByPropertyId(propertyId: string): Promise<string | null> {
        const listing = await prisma.listing.findFirst({
            where: {
                propertyId,
                status: 'ACTIVE'
            }
        });
        return listing ? listing.id : null;
    }
}

// Import all rules
import { ListingVersionImmutabilityRule } from './definitions/ListingVersionImmutabilityRule';
import { CanonicalDataPrecedenceRule } from './definitions/CanonicalDataPrecedenceRule';
import { ScrapedDataDowngradeRule } from './definitions/ScrapedDataDowngradeRule';
import { BrokerOwnershipEnforcementRule } from './definitions/BrokerOwnershipEnforcementRule';
import { PrimaryActiveListingRule } from './definitions/PrimaryActiveListingRule';
import { PublicExposureRequirementsRule } from './definitions/PublicExposureRequirementsRule';
import { SourceTrustHierarchyRule } from './definitions/SourceTrustHierarchyRule';
import { CanonicalPromotionSafeguardRule } from './definitions/CanonicalPromotionSafeguardRule';
import { ConflictAutoDetectionRule } from './definitions/ConflictAutoDetectionRule';
import { AutoClaimCreationRule } from './definitions/AutoClaimCreationRule';
import { PublishSuspensionRule } from './definitions/PublishSuspensionRule';
import { ClaimResolutionRule } from './definitions/ClaimResolutionRule';

export function setupRuleEngine() {
    const registry = new RuleRegistry();

    const allRules = [
        ListingVersionImmutabilityRule, CanonicalDataPrecedenceRule, ScrapedDataDowngradeRule,
        BrokerOwnershipEnforcementRule, PrimaryActiveListingRule, PublicExposureRequirementsRule,
        SourceTrustHierarchyRule, CanonicalPromotionSafeguardRule, ConflictAutoDetectionRule,
        AutoClaimCreationRule, PublishSuspensionRule, ClaimResolutionRule
    ];

    allRules.forEach(r => registry.register(r));

    const services = new CoreServices();
    const engine = new RuleEngine(registry, services);
    const api = new RuleEngineService(engine, registry, services);

    return { api, services };
}

// Singleton instances for the server
const { api: ruleEngineService, services: coreServices } = setupRuleEngine();

export { ruleEngineService, coreServices };
