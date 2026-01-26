
import { v4 as uuidv4 } from 'uuid';
import { RuleEngine } from './rules/RuleEngine';
import { RuleRegistry } from './rules/RuleRegistry';
import { GovernanceEventType, RuleStatus, GovernanceEvent, ListingStatus, ExternalServices } from './rules/types';
import { TrustService } from './rules/TrustService';
import { AuditService } from './rules/AuditService';
import { RuleEngineService } from './rules/RuleEngineService';

// Import Rules
import { ListingVersionImmutabilityRule } from './rules/definitions/ListingVersionImmutabilityRule';
import { CanonicalDataPrecedenceRule } from './rules/definitions/CanonicalDataPrecedenceRule';
import { ScrapedDataDowngradeRule } from './rules/definitions/ScrapedDataDowngradeRule';
import { BrokerOwnershipEnforcementRule } from './rules/definitions/BrokerOwnershipEnforcementRule';
import { PrimaryActiveListingRule } from './rules/definitions/PrimaryActiveListingRule';
import { PublicExposureRequirementsRule } from './rules/definitions/PublicExposureRequirementsRule';
import { SourceTrustHierarchyRule } from './rules/definitions/SourceTrustHierarchyRule';
import { CanonicalPromotionSafeguardRule } from './rules/definitions/CanonicalPromotionSafeguardRule';
import { ConflictAutoDetectionRule } from './rules/definitions/ConflictAutoDetectionRule';
import { AutoClaimCreationRule } from './rules/definitions/AutoClaimCreationRule';
import { PublishSuspensionRule } from './rules/definitions/PublishSuspensionRule';
import { ClaimResolutionRule } from './rules/definitions/ClaimResolutionRule';

// Mock Services
class MockServices implements ExternalServices {
    private activeListings: Map<string, string> = new Map(); // propertyId -> listingId
    public trustService: TrustService;
    public auditService: AuditService;

    constructor() {
        // Seed with one active listing
        this.activeListings.set('PROP_EXISTING', 'LISTING_OLD_ACTIVE');
        this.trustService = new TrustService();
        this.auditService = new AuditService();
    }

    async findActiveListingByPropertyId(propertyId: string): Promise<string | null> {
        return this.activeListings.get(propertyId) || null;
    }
}

async function main() {
    console.log('Starting Checkpoint 6 Verification (API & Extensibility)...');

    // 1. Setup
    const registry = new RuleRegistry();

    // Register all rules
    const allRules = [
        ListingVersionImmutabilityRule, CanonicalDataPrecedenceRule, ScrapedDataDowngradeRule,
        BrokerOwnershipEnforcementRule, PrimaryActiveListingRule, PublicExposureRequirementsRule,
        SourceTrustHierarchyRule, CanonicalPromotionSafeguardRule, ConflictAutoDetectionRule,
        AutoClaimCreationRule, PublishSuspensionRule, ClaimResolutionRule
    ];
    allRules.forEach(r => registry.register(r));

    const services = new MockServices();
    const engine = new RuleEngine(registry, services);
    const api = new RuleEngineService(engine, registry, services);

    // Helper
    async function testEvent(input: any) {
        // Mock User for testing
        const mockUser = {
            id: 'TEST_USER',
            email: 'admin@mls.mx',
            roles: ['agency_admin'],
            permissions: [],
            brokerId: 'BROKER_TEST'
        };

        const results = await api.processEvent(input, mockUser);
        const passed = results.every((r: any) => r.passed);
        console.log(`Event Processed. Passed: ${passed} | Failures: ${results.filter((r: any) => !r.passed).length}`);
        return passed;
    }

    // --- Scenario 1: API Listing Config ---
    console.log('\n--- 1. API: List Rules ---');
    const config = api.getRuleConfig();
    console.log(`Rules Loaded: ${config.length}`);
    const activeCount = config.filter(r => r.status === RuleStatus.ACTIVE).length;
    console.log(`Active Rules: ${activeCount}`);

    // --- Scenario 2: Dynamic Rule Management ---
    console.log('\n--- 2. Dynamic Rule Management ---');

    // Create an invalid event (Missing Title/Price for Public Listing)
    const invalidEvent = {
        id: uuidv4(),
        type: GovernanceEventType.LISTING_CREATED,
        timestamp: new Date(),
        actorId: 'BROKER',
        sourceId: 'MANUAL',
        payload: {
            status: ListingStatus.ACTIVE,
            price: 0 // Should trigger PublicExposureRequirementsRule
        }
    };

    console.log('Running with Rule ACTIVE...');
    await testEvent(invalidEvent);

    // Disable the specific rule
    const ruleId = PublicExposureRequirementsRule.id;
    console.log(`Disabling Rule ${ruleId}...`);
    api.updateRuleStatus(ruleId, RuleStatus.INACTIVE);

    console.log('Running with Rule INACTIVE...');
    await testEvent(invalidEvent); // Should pass now (or fail fewer rules)

    // Verify Config Status
    const updatedConfig = api.getRuleConfig();
    const ruleState = updatedConfig.find(r => r.id === ruleId);
    console.log(`Rule Status API verifies: ${ruleState?.status}`);

    if (ruleState?.status === RuleStatus.INACTIVE) {
        console.log('✅ PASS: Dynamic disabling worked.');
    } else {
        console.log('❌ FAIL: Rule status not updated.');
    }
}

main().catch(console.error);
