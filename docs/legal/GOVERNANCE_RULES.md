# MLS Governance Legal Repository

## Overview

This repository contains the complete legal and technical documentation for all governance rules implemented in the Blue Jax MLS system. These rules ensure data integrity, broker ownership rights, and system transparency.

**Version**: 1.4.2  
**Last Updated**: February 6, 2026  
**Jurisdiction**: Chihuahua, Mexico

---

## Table of Contents

1. [Core Rules](#core-rules)
   - [CORE_001: Listing Version Immutability](#core_001)
   - [CORE_002: Broker Ownership Enforcement](#core_002)
2. [Quality Rules](#quality-rules)
   - [QUAL_005: Scraped Data Downgrade](#qual_005)
   - [QUAL_006: Public Exposure Requirements](#qual_006)
3. [Rule Modification Process](#modification-process)
4. [Legal Compliance](#legal-compliance)

---

## Core Rules

<a name="core_001"></a>
### CORE_001: Listing Version Immutability

**Rule ID**: CORE_001  
**Type**: BLOCK  
**Status**: ACTIVE  
**Severity**: CRITICAL

#### Description
Prevents modification of locking fields on Verified listings. Once a listing reaches "VERIFIED" status, critical fields become immutable to preserve data integrity and audit trail.

#### Legal Justification
Under Mexican real estate law (Ley Federal de Corredores Inmobiliarios), verified property records must maintain an immutable audit trail. This rule ensures compliance with:
- Article 23: Truthful representation of property data
- Article 45: Record-keeping requirements
- PROFECO consumer protection standards

#### Protected Fields
When a listing is marked as VERIFIED, the following fields become immutable:
- Property address
- Lot size / square meters
- Legal property identifiers
- Original listing date
- Verification timestamp
- Verifying agent ID

#### Business Logic
```
IF listing.status === "VERIFIED" THEN
  IF attempting to modify locked fields THEN
    BLOCK action
    Log audit event
    Notify system admin
  END IF
END IF
```

#### Examples

**✅ ALLOWED**:
- Updating price on verified listing
- Adding new photos
- Modifying description text
- Changing availability status

**❌ BLOCKED**:
- Changing property address on verified listing
- Modifying square meters after verification
- Altering original listing date
- Changing verifying agent

#### Consequences of Violation
- **Automated**: Action is blocked immediately
- **Audit Log**: Violation recorded with actor ID, timestamp, attempted changes
- **Escalation**: Multiple violations trigger admin review
- **Legal**: May constitute fraud under Article 388-bis of Código Penal

#### Exceptions
- System administrators with explicit override permission
- Court-ordered corrections with legal documentation
- Corrections within 24 hours of verification (grace period)

---

<a name="core_002"></a>
### CORE_002: Broker Ownership Enforcement

**Rule ID**: CORE_002  
**Type**: BLOCK  
**Status**: ACTIVE  
**Severity**: CRITICAL

#### Description
Only the designated broker owner can modify a commercial listing. This rule enforces the legal principle that brokers retain exclusive rights to manage their own listings.

#### Legal Justification
Based on:
- Ley Federal de Correduría Pública Article 12: Broker exclusivity
- Commercial Code Article 75: Commercial acts attribution
- Professional ethics standards (AMPI Code of Ethics)

#### Business Logic
```
IF action === "MODIFY_LISTING" THEN
  IF user.id !== listing.ownerId THEN
    IF user.role !== "SYSTEM_ADMIN" THEN
      BLOCK action
      Log unauthorized attempt
      Notify listing owner
    END IF
  END IF
END IF
```

#### Protected Actions
- Edit listing details
- Change pricing
- Modify property status (active/inactive)
- Delete listing
- Transfer ownership

#### Examples

**✅ ALLOWED**:
- Owner broker editing own listing
- System admin with documented reason
- Automated system updates (scrapers, feeds)

**❌ BLOCKED**:
- Broker A modifying Broker B's listing
- Agent without owner permissions editing
- External API attempts to modify

#### Consequences of Violation
- **Automated**: Action blocked, user notified
- **Warning**: First offense logged
- **Escalation**: Repeated attempts trigger account review
- **Legal**: Potential breach of professional standards

#### Audit Trail
All ownership checks are logged with:
- Actor ID and role
- Listing ID and owner ID
- Timestamp of attempt
- Action attempted
- Blocking reason

---

## Quality Rules

<a name="qual_005"></a>
### QUAL_005: Scraped Data Downgrade

**Rule ID**: QUAL_005  
**Type**: DOWNGRADE  
**Status**: ACTIVE  
**Severity**: MEDIUM

#### Description
Automatically reduces trust score of scraped ingestion feeds to account for potential data quality issues.

#### Rationale
Data from external sources (web scrapers, third-party feeds) has not been verified by the system and may contain:
- Outdated pricing
- Incorrect measurements
- Misleading descriptions
- Duplicate listings
- Fraudulent content

#### Business Logic
```
IF listing.source === "SCRAPED" OR listing.source === "EXTERNAL_FEED" THEN
  listing.trustScore = min(listing.trustScore, 60)
  listing.requiresVerification = true
  Append warning tags
END IF
```

#### Trust Score Impacts
- **Manual Entry**: Default trust score 80
- **Scraped Data**: Maximum trust score 60
- **Unverified External**: Maximum trust score 50
- **After Verification**: Can reach 100

#### Verification Requirements
Scraped listings must be verified before:
- Appearing in public search results
- Being eligible for featured placement
- Integration with payment systems

#### Examples

**Typical Scraped Sources**:
- Mercado Libre (e-commerce platform)
- Competitor MLS systems
- Real estate portals (Vivanuncios, Inmuebles24)
- Social media marketplace

**Expected Behavior**:
```
Input: Listing scraped from Mercado Libre
- Initial trust score: DOWNGRADED to 60
- Status: OBSERVED
- Public visibility: Hidden until claimed/verified
```

#### Manual Override
Brokers can "claim" scraped listings and verify them, which:
- Removes downgrade
- Assigns broker ownership
- Increases trust score based on verification

---

<a name="qual_006"></a>
### QUAL_006: Public Exposure Requirements

**Rule ID**: QUAL_006  
**Type**: WARN  
**Status**: INACTIVE (Currently disabled for testing)  
**Severity**: LOW

#### Description
Ensures minimum photo and description quality for public visibility. Enforces professional standards for listings exposed to public searches.

#### Requirements
For public visibility, listing must have:
- **Minimum**: 3 photos
- **Recommended**: 6+ photos
- **Description**: At least 100 characters
- **Key Details**: Price, location, property type

#### Business Logic (when active)
```
IF listing.requestPublicExposure === true THEN
  IF photos.length < 3 OR description.length < 100 THEN
    WARN broker
    Suggest improvements
    Still allow publication (soft check)
  END IF
END IF
```

#### Why Currently Inactive
Disabled during initial platform rollout to encourage broker adoption. Will be reactivated after:
- 90% broker onboarding complete
- Educational campaign on best practices
- Tools provided for easy photo upload

#### Planned Reactivation
- **Target Date**: Q2 2026
- **Type Change**: WARN → BLOCK for premium listings
- **Grandfathering**: Existing listings get 60-day grace period

---

## Rule Modification Process

<a name="modification-process"></a>

### Proposing Rule Changes

1. **Proposal**: Written proposal with business justification
2. **Legal Review**: Legal team reviews compliance implications
3. **Stakeholder Feedback**: 30-day broker feedback period
4. **Technical Assessment**: Engineering evaluates implementation
5. **Approval**: Requires 2/3 vote from governance board
6. **Implementation**: Staged rollout with monitoring

### Version Control
- All rules are versioned (current: v1.4.2)
- Changes documented in CHANGELOG.md
- Rules cannot be retroactively applied
- Grandfathering clauses mandatory for BLOCK rules

### Emergency Modifications
In case of critical security or legal issues:
- CTO can temporarily disable rules
- Must be ratified within 72 hours
- All affected parties notified immediately

---

## Legal Compliance

<a name="legal-compliance"></a>

### Mexican Real Estate Law
This system complies with:
- **Ley Federal de Correduría Pública**
- **Código Penal** (fraud prevention)
- **Ley Federal de Protección de Datos Personales** (LFPDPPP)
- **PROFECO** consumer protection standards

### Data Protection
- All audit logs encrypted at rest
- Personal data minimized in logs
- Right to deletion honored (GDPR-style)
- Cross-border data transfer compliance

### Broker Professional Standards
Aligned with:
- **AMPI** (Asociación Mexicana de Profesionales Inmobiliarios) Code of Ethics
- **NAR** (National Association of Realtors) best practices
- Local Chihuahua real estate board requirements

---

## Contact & Support

**Governance Committee**:  
Email: governance@bluejax.ai  
Address: Av. Universidad, Chihuahua, Mexico

**Legal Department**:  
Email: legal@bluejax.ai  
Phone: +52 (614) 123-4567

**Technical Support**:  
Email: support@bluejax.ai  
Portal: https://support.bluejax.ai

---

**Document Version**: 1.0  
**Effective Date**: February 6, 2026  
**Next Review**: May 1, 2026
