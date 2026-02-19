# Governance Rules Changelog

All notable changes to governance rules will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2026-02-06

### Changed
- QUAL_006: Temporarily disabled for initial platform rollout
- Updated trust score calculation algorithm for better accuracy
- Improved audit log detail capture for CORE_002 violations

### Fixed
- CORE_001: Fixed edge case where verification timestamp could be modified within grace period
- Corrected Spanish translations for rule descriptions

## [1.4.1] - 2026-01-15

### Added
- QUAL_005: New automatic trust score downgrade for scraped data
- Audit logging for all downgrade events

### Changed
- CORE_002: Extended owner check to API modifications
- Increased sensitivity of ownership violation detection

## [1.4.0] - 2025-12-01

### Added
- QUAL_006: Public exposure requirements (initially ACTIVE, now INACTIVE)
- Photo quality recommendations system

### Changed
- CORE_001: Expanded list of protected fields
- Added 24-hour grace period for post-verification corrections

## [1.3.0] - 2025-10-15

### Added
- CORE_001: Listing version immutability rule
- CORE_002: Broker ownership enforcement rule

### Security
- Implemented encrypted audit logging
- Added multi-factor authentication for rule overrides

## [Unreleased]

### Planned
- PRICE_001: Price variation monitoring
- LOC_001: Location verification requirement
- MEDIA_001: Image authenticity verification

---

## Version Numbering

- **Major** (X.0.0): Breaking changes, new critical rules
- **Minor** (1.X.0): New non-breaking rules, significant modifications
- **Patch** (1.4.X): Bug fixes, minor adjustments, translations

## Review Schedule

- **Quarterly**: Full governance review
- **Monthly**: Performance metrics analysis
- **Ad-hoc**: Emergency modifications as needed
