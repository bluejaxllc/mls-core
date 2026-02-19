
import { PublishSuspensionRule } from './definitions/PublishSuspensionRule';
import { GovernanceEvent, GovernanceEventType, RuleContext, ClaimType, ListingStatus, TrustLevel, ClaimResolution } from './types';

async function runTests() {
    console.log('Running Governance Rules Tests...');

    // Mock Context
    const mockContext: RuleContext = {
        executionTime: new Date(),
        services: {
            findActiveListingByPropertyId: async () => 'listing-123',
            trustService: {
                calculateTrustScore: async () => 85,
                getSourceTrustLevel: async () => TrustLevel.TRUSTED
            } as any,
            auditService: {
                logRuleExecution: async () => { },
                logGovernanceEvent: async () => { }
            } as any
        },
        currentUser: {
            id: 'user-1',
            email: 'test@example.com',
            roles: ['admin'],
            permissions: []
        }
    };

    // Test Case 1: Serious Claim (Ownership) -> Should Suspend
    console.log('\nTest Case 1: Serious Claim (Ownership)');
    const event1: GovernanceEvent = {
        id: 'evt-1',
        type: GovernanceEventType.CLAIM_FILED,
        timestamp: new Date(),
        actorId: 'user-2',
        sourceId: 'src-1',
        payload: {
            type: ClaimType.OWNERSHIP,
            listingId: 'listing-123',
            claimantId: 'user-3',
            evidence: {}
        }
    };

    const result1 = await PublishSuspensionRule.evaluate(event1, mockContext);

    if (result1.passed === false && result1.actionRequired?.details?.newValue === ListingStatus.SUSPENDED) {
        console.log('✅ PASS: Ownership claim triggers suspension');
    } else {
        console.error('❌ FAIL: Ownership claim did not trigger expected suspension');
        console.log('Result:', JSON.stringify(result1, null, 2));
    }

    // Test Case 2: Minor Claim (Data Accuracy) -> Should NOT Suspend
    console.log('\nTest Case 2: Minor Claim (Data Accuracy)');
    const event2: GovernanceEvent = {
        ...event1,
        id: 'evt-2',
        payload: {
            ...event1.payload,
            type: ClaimType.DATA_ACCURACY
        }
    };

    const result2 = await PublishSuspensionRule.evaluate(event2, mockContext);

    if (result2.passed === true && result2.actionRequired?.type === 'NONE') {
        console.log('✅ PASS: Data Accuracy claim does not trigger suspension');
    } else {
        console.error('❌ FAIL: Data Accuracy claim triggered unexpected action');
        console.log('Result:', JSON.stringify(result2, null, 2));
    }
    // Test Case 3: Immutability Violation -> Should BLOCK
    console.log('\nTest Case 3: Immutability Violation');
    const event3: GovernanceEvent = {
        id: 'evt-3',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'user-2',
        sourceId: 'src-1',
        payload: {
            previous: {
                status: ListingStatus.VERIFIED,
                price: 500000,
                address: '123 Main St'
            },
            current: {
                status: ListingStatus.VERIFIED,
                price: 550000, // Price changed on VERIFIED listing
                address: '123 Main St'
            }
        }
    };

    const { ListingVersionImmutabilityRule } = await import('./definitions/ListingVersionImmutabilityRule');
    const result3 = await ListingVersionImmutabilityRule.evaluate(event3, mockContext);

    if (result3.passed === false && result3.actionRequired?.type === 'BLOCK') {
        console.log('✅ PASS: Immutability violation blocked');
    } else {
        console.error('❌ FAIL: Immutability violation not blocked');
        console.log('Result:', JSON.stringify(result3, null, 2));
    }

    // Test Case 4: Claim Resolution (Uphold) -> Should ARCHIVE
    console.log('\nTest Case 4: Claim Resolution (Uphold)');
    const event4: GovernanceEvent = {
        id: 'evt-4',
        type: GovernanceEventType.CLAIM_RESOLVED,
        timestamp: new Date(),
        actorId: 'admin-1',
        sourceId: 'system',
        payload: {
            listingId: 'listing-123',
            resolution: ClaimResolution.UPHOLD_CLAIM
        }
    };

    const { ClaimResolutionRule } = await import('./definitions/ClaimResolutionRule');
    const result4 = await ClaimResolutionRule.evaluate(event4, mockContext);

    if (result4.passed === false && result4.actionRequired?.details?.newValue === ListingStatus.ARCHIVED) {
        console.log('✅ PASS: Claim upheld -> Listing Archived');
    } else {
        console.error('❌ FAIL: Claim upheld action incorrect');
        console.log('Result:', JSON.stringify(result4, null, 2));
    }
    // Test Case 5: Canonical Data Precedence (MLS -> SCRAPER) -> Should BLOCK
    console.log('\nTest Case 5: Canonical Data Precedence (MLS -> SCRAPER)');
    const event5: GovernanceEvent = {
        id: 'evt-5',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'scraper-bot',
        sourceId: 'src-scraper',
        payload: {
            previous: {
                id: 'listing-123',
                source: 'MLS_FEED',
                status: ListingStatus.ACTIVE,
                price: 500000
            },
            current: {
                id: 'listing-123',
                source: 'SCRAPER',
                status: ListingStatus.ACTIVE,
                price: 450000 // Scraper found a different price
            }
        }
    };

    const { CanonicalDataPrecedenceRule } = await import('./definitions/CanonicalDataPrecedenceRule');
    const result5 = await CanonicalDataPrecedenceRule.evaluate(event5, mockContext);

    if (result5.passed === false && result5.actionRequired?.type === 'BLOCK') {
        console.log('✅ PASS: MLS data protected from Scraper override');
    } else {
        console.error('❌ FAIL: Precedence rule failed to block');
        console.log('Result:', JSON.stringify(result5, null, 2));
    }

    // Test Case 6: Scraped Data Downgrade -> Should AUTO_CORRECT
    console.log('\nTest Case 6: Scraped Data Downgrade');
    const event6: GovernanceEvent = {
        id: 'evt-6',
        type: GovernanceEventType.LISTING_CREATED,
        timestamp: new Date(),
        actorId: 'scraper-bot',
        sourceId: 'src-scraper',
        payload: {
            id: 'listing-999',
            source: 'SCRAPER',
            status: ListingStatus.ACTIVE, // Scraper tries to insert as ACTIVE
            price: 300000
        }
    };

    const { ScrapedDataDowngradeRule } = await import('./definitions/ScrapedDataDowngradeRule');
    const result6 = await ScrapedDataDowngradeRule.evaluate(event6, mockContext);

    if (result6.passed === false && result6.actionRequired?.details?.newValue === ListingStatus.PENDING_REVIEW) {
        console.log('✅ PASS: Scraped active listing downgraded to PENDING_REVIEW');
    } else {
        console.error('❌ FAIL: Scraped data downgrade failed');
        console.log('Result:', JSON.stringify(result6, null, 2));
    }

    // Test Case 7: Conflict Detection (Price Drift) -> Should FLAG
    console.log('\nTest Case 7: Conflict Detection (Price Drift)');
    const event7: GovernanceEvent = {
        id: 'evt-7',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'scraper-bot',
        sourceId: 'src-scraper-2',
        payload: {
            previous: {
                id: 'listing-conflict',
                source: 'SCRAPER', // Trust 20
                status: ListingStatus.ACTIVE,
                price: 500000,
                sourceId: 's1'
            },
            current: {
                id: 'listing-conflict',
                source: 'SCRAPER', // Trust 20 (Same/Similar)
                status: ListingStatus.ACTIVE,
                price: 800000, // > 20% drift (60%)
                sourceId: 's2'
            }
        }
    };

    // Mock trust scores for conflict detection
    // Explicitly mocking context for this test call to ensure trust scores match
    const conflictContext: RuleContext = {
        ...mockContext,
        services: {
            ...mockContext.services,
            trustService: {
                getTrustScore: (source: string) => 20 // Both are scrapers
            } as any
        }
    };

    const { ConflictAutoDetectionRule } = await import('./definitions/ConflictAutoDetectionRule');
    const result7 = await ConflictAutoDetectionRule.evaluate(event7, conflictContext);

    if (result7.passed === true && result7.actionRequired?.type === 'FLAG') {
        console.log('✅ PASS: Significant price drift detected and flagged');
    } else {
        console.error('❌ FAIL: Conflict detection failed');
        console.log('Result:', JSON.stringify(result7, null, 2));
    }

    // Test Case 8: Duplicate Active Listing -> Should BLOCK
    console.log('\nTest Case 8: Duplicate Active Listing');
    const event8: GovernanceEvent = {
        id: 'evt-8',
        type: GovernanceEventType.LISTING_CREATED,
        timestamp: new Date(),
        actorId: 'agent-1',
        sourceId: 'manual',
        payload: {
            id: 'listing-new-active',
            propertyId: 'prop-123',
            status: ListingStatus.ACTIVE
        }
    };

    const integrityContext: RuleContext = {
        ...mockContext,
        services: {
            ...mockContext.services,
            findActiveListingByPropertyId: async () => 'listing-existing-active' // Already exists!
        }
    };

    const { PrimaryActiveListingRule } = await import('./definitions/PrimaryActiveListingRule');
    const result8 = await PrimaryActiveListingRule.evaluate(event8, integrityContext);

    if (result8.passed === false && result8.actionRequired?.type === 'BLOCK') {
        console.log('✅ PASS: Duplicate active listing blocked');
    } else {
        console.error('❌ FAIL: Duplicate active listing allowed');
        console.log('Result:', JSON.stringify(result8, null, 2));
    }
    // Test Case 9: Public Exposure Requirements (Missing Photos) -> Should BLOCK
    console.log('\nTest Case 9: Public Exposure Requirements');
    const event9: GovernanceEvent = {
        id: 'evt-9',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'agent-1',
        sourceId: 'manual',
        payload: {
            current: {
                id: 'listing-invalid-public',
                status: ListingStatus.ACTIVE,
                price: 500000,
                address: { street: '123 Main' },
                photos: [] // No photos!
            }
        }
    };

    const { PublicExposureRequirementsRule } = await import('./definitions/PublicExposureRequirementsRule');
    const result9 = await PublicExposureRequirementsRule.evaluate(event9, mockContext);

    if (result9.passed === false && result9.actionRequired?.type === 'BLOCK') {
        console.log('✅ PASS: Listing without photos blocked from being ACTIVE');
    } else {
        console.error('❌ FAIL: Public exposure check failed');
        console.log('Result:', JSON.stringify(result9, null, 2));
    }

    // Test Case 10: Broker Ownership Enforcement -> Should BLOCK
    console.log('\nTest Case 10: Broker Ownership Enforcement');
    const event10: GovernanceEvent = {
        id: 'evt-10',
        type: GovernanceEventType.LISTING_UPDATED,
        timestamp: new Date(),
        actorId: 'hacker-1',
        sourceId: 'manual',
        payload: {
            current: {
                id: 'listing-owned',
                brokerId: 'broker-A'
            }
        }
    };

    // Context where user is NOT from broker-A and NOT admin
    const unauthorizedContext: RuleContext = {
        ...mockContext,
        currentUser: {
            id: 'hacker-1',
            email: 'hacker@bad.com',
            roles: ['agent'],
            permissions: [],
            brokerId: 'broker-B' // Different broker
        }
    };

    const { BrokerOwnershipEnforcementRule } = await import('./definitions/BrokerOwnershipEnforcementRule');
    const result10 = await BrokerOwnershipEnforcementRule.evaluate(event10, unauthorizedContext);

    if (result10.passed === false && result10.actionRequired?.type === 'BLOCK') {
        console.log('✅ PASS: Unauthorized broker modification blocked');
    } else {
        console.error('❌ FAIL: Unauthorized modification allowed');
        console.log('Result:', JSON.stringify(result10, null, 2));
    }
}

runTests().catch(console.error);
