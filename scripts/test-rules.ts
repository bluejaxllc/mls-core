
import { RuleRegistry } from '../src/rules/RuleRegistry';
import { RuleEngine } from '../src/rules/RuleEngine';
import { PrimaryActiveListingRule } from '../src/rules/definitions/PrimaryActiveListingRule';
import { GovernanceEvent, GovernanceEventType, ExternalServices, RuleResult } from '../src/rules/types';
import { TrustService } from '../src/rules/TrustService';

// Mock Services
class MockServices implements ExternalServices {
    trustService: TrustService;
    auditService: any = {
        logExecution: (event: any, results: any) => {
            // console.log(`[Audit] ${event.type} executed.`);
        }
    };

    // Database Mock
    private activeListings: Map<string, string> = new Map(); // PropertyID -> ListingID

    constructor() {
        this.trustService = new TrustService();
        // Seed with one active listing
        this.activeListings.set('PROP-EXISTING', 'LISTING-1');
    }

    async findActiveListingByPropertyId(propertyId: string): Promise<string | null> {
        return this.activeListings.get(propertyId) || null;
    }
}

async function runTest() {
    console.log('Starting Rule Engine Test...\n');

    // 1. Setup
    const registry = new RuleRegistry();
    registry.register(PrimaryActiveListingRule);

    const services = new MockServices();
    const engine = new RuleEngine(registry, services);

    // 2. Test Case A: New Listing, No Conflict
    console.log('Test Case A: New Listing (No Conflict)');
    const eventA: GovernanceEvent = {
        id: 'evt-1',
        type: GovernanceEventType.LISTING_CREATED,
        timestamp: new Date(),
        actorId: 'user-1',
        sourceId: 'src-1',
        payload: {
            id: 'LISTING-NEW-1',
            propertyId: 'PROP-NEW',
            status: 'ACTIVE'
        }
    };

    const resultsA = await engine.evaluateEvent(eventA, { id: 'user-1', roles: ['agent'] });
    printSummary('Case A', resultsA, true);

    // 3. Test Case B: Duplicate Listing (Conflict)
    console.log('Test Case B: Duplicate Listing (Conflict with PROP-EXISTING)');
    const eventB: GovernanceEvent = {
        id: 'evt-2',
        type: GovernanceEventType.LISTING_CREATED, // or UPDATED
        timestamp: new Date(),
        actorId: 'user-2',
        sourceId: 'src-1',
        payload: {
            id: 'LISTING-NEW-2',
            propertyId: 'PROP-EXISTING', // <--- Conflict!
            status: 'ACTIVE'
        }
    };

    const resultsB = await engine.evaluateEvent(eventB, { id: 'user-2', roles: ['agent'] });
    printSummary('Case B (Expect Block)', resultsB, false);

    // 4. Test Case C: Low Trust Update Blocked (Scraper changing Agent's Price)
    console.log('Test Case C: Low Trust Update Blocked (Scraper changing Agent Price)');
    // Need to register the Trust Rule first
    const { SourceTrustHierarchyRule } = await import('../src/rules/definitions/SourceTrustHierarchyRule');
    registry.register(SourceTrustHierarchyRule);

    const eventC: GovernanceEvent = {
        id: 'evt-3',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'scraper-bot',
        sourceId: 'scraper-1',
        payload: {
            // New State
            current: {
                id: 'LISTING-1',
                price: 500, // Scraper says 500
                source: 'SCRAPER'
            },
            // Old State (from DB)
            previous: {
                id: 'LISTING-1',
                price: 1000, // Agent says 1000
                source: 'MANUAL'
            }
        }
    };

    const resultsC = await engine.evaluateEvent(eventC, { id: 'system', roles: ['system'] });
    printSummary('Case C (Expect Block)', resultsC, false);

    // 5. Test Case D: Enrichment Allowed (Scraper filling empty description)
    console.log('Test Case D: Enrichment Allowed (Scraper filling empty description)');
    const eventD: GovernanceEvent = {
        id: 'evt-4',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'scraper-bot',
        sourceId: 'scraper-1',
        payload: {
            // New State
            current: {
                id: 'LISTING-1',
                description: 'Detailed description from scraper',
                source: 'SCRAPER'
            },
            // Old State
            previous: {
                id: 'LISTING-1',
                description: null, // Was empty
                source: 'MANUAL'
            }
        }
    };

    const resultsD = await engine.evaluateEvent(eventD, { id: 'system', roles: ['system'] });
    printSummary('Case D (Expect Pass)', resultsD, true);
}

function printSummary(label: string, results: RuleResult[], expectPass: boolean) {
    const passed = results.every(r => r.passed);
    const success = passed === expectPass;

    console.log(`${label}: ${success ? 'SUCCESS ✅' : 'FAIL ❌'}`);
    if (!success) {
        console.log(`  Expected: ${expectPass ? 'PASS' : 'BLOCK'}, Actual: ${passed ? 'PASS' : 'BLOCK'}`);
    }

    results.forEach(r => {
        if (!r.passed) {
            console.log(`  Rule Blocked: ${r.ruleName}`);
            console.log(`  Reason: ${r.reasons.join(', ')}`);
        }
    });
    console.log('\n');
}

runTest().catch(console.error);
