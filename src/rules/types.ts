
import { z } from 'zod';

// Basic primitives for the MLS domain
export type ListingId = string;
export type BrokerId = string;
export type SourceId = string;
export type UserId = string;

// Auth & Permissions
export interface User {
    id: UserId;
    email: string;
    roles: string[]; // Blue Jax roles
    permissions: string[]; // MLS capabilities
    brokerId?: BrokerId; // If associated with a broker
}

export enum ListingStatus {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    VERIFIED = 'VERIFIED',
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    ARCHIVED = 'ARCHIVED',
    SUSPENDED = 'SUSPENDED'
}

export enum TrustLevel {
    VERIFIED = 100,
    TRUSTED = 80,
    CONFIRMED = 60,
    UNVERIFIED = 40,
    SCRAPED = 20,
    BLACKLISTED = 0
}

export enum ClaimStatus {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
}

export enum ClaimType {
    OWNERSHIP = 'OWNERSHIP',
    DATA_ACCURACY = 'DATA_ACCURACY',
    DUPLICATE = 'DUPLICATE'
}

export enum ClaimResolution {
    UPHOLD_CLAIM = 'UPHOLD_CLAIM',
    REJECT_CLAIM = 'REJECT_CLAIM'
}

export type ClaimId = string;

export interface ListingClaim {
    id: ClaimId;
    listingId: ListingId;
    claimantId: string;
    type: ClaimType;
    status: ClaimStatus;
    evidence: Record<string, any>;
    resolution?: ClaimResolution;
}

export interface RuleExecutionLog {
    eventId: string;
    eventType: GovernanceEventType;
    timestamp: Date;
    actorId: string;
    rulesEvaluated: number;
    results: RuleResult[];
    overallOutcome: 'PASS' | 'BLOCK' | 'FLAG';
}

export enum ListingSource {
    MANUAL = 'MANUAL',
    MLS_FEED = 'MLS_FEED',
    SCRAPER = 'SCRAPER'
}

// The types of events that can trigger rules
export enum GovernanceEventType {
    LISTING_CREATED = 'LISTING_CREATED',
    LISTING_UPDATED = 'LISTING_UPDATED',
    LISTING_DELETED = 'LISTING_DELETED',
    CLAIM_FILED = 'CLAIM_FILED',
    CLAIM_RESOLVED = 'CLAIM_RESOLVED',
    DATA_INGESTED = 'DATA_INGESTED',
}

// Payload for events
export interface GovernanceEvent {
    id: string;
    type: GovernanceEventType;
    timestamp: Date;
    actorId: string; // User or System ID
    sourceId: SourceId;
    payload: Record<string, any>; // Should contain 'current' and optionally 'previous' state
}

import { TrustService } from './TrustService';
import { AuditService } from './AuditService';

export interface ExternalServices {
    findActiveListingByPropertyId(propertyId: string): Promise<ListingId | null>;
    trustService: TrustService;
    auditService: AuditService;
}

// Context provided to rules during evaluation
export interface RuleContext {
    executionTime: Date;
    services: ExternalServices;
    currentUser: User; // [NEW] Auth Context
}

// The result of a rule evaluation
export interface RuleResult {
    ruleId: string;
    ruleName: string;
    passed: boolean; // True if the rule conditions are met (meaning validation PASSED)
    actionRequired?: RuleAction;
    reasons: string[]; // Explanations for the result
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export type RuleActionType = 'BLOCK' | 'FLAG' | 'AUTO_CORRECT' | 'DOWNGRADE_TRUST' | 'CREATE_CLAIM' | 'NONE' | 'MUTATE_PAYLOAD';

export interface RuleAction {
    type: RuleActionType;
    details: Record<string, any>;
}

export enum RuleStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DEPRECATED = 'DEPRECATED'
}

// Definition of a Rule
export interface Rule {
    id: string;
    name: string;
    description: string;
    triggerEvents: GovernanceEventType[];
    priority: number; // Higher number = higher priority

    // V2: Lifecycle management
    status?: RuleStatus;
    version?: string;

    // The core logic
    evaluate(event: GovernanceEvent, context: RuleContext): Promise<RuleResult>;
}
