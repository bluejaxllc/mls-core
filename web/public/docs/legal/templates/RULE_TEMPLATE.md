# Rule Template

**Use this template when proposing new governance rules.**

---

## Rule Information

**Rule ID**: [e.g., CORE_003, QUAL_007]  
**Rule Name**: [Descriptive name]  
**Type**: [BLOCK / DOWNGRADE / WARN / UPDATE]  
**Proposed Status**: [ACTIVE / INACTIVE]  
**Severity**: [CRITICAL / HIGH / MEDIUM / LOW]  
**Version**: [Start at 1.0.0]

---

## Description

[1-2 sentence summary of what this rule does]

---

## Legal Justification

### Applicable Laws
- [Law/Article name and how it applies]
- [Additional regulations]

### Business Rationale
[Why this rule is necessary from a business perspective]

---

## Technical Implementation

### Business Logic
```
IF [condition] THEN
  [action]
  [logging/notification]
END IF
```

### Affected Systems
- [ ] Listing management
- [ ] User authentication
- [ ] Data ingestion
- [ ] Public search
- [ ] Reporting

### Performance Impact
- Estimated queries per day: [number]
- Latency impact: [< 10ms / 10-50ms / > 50ms]
- Database load: [LOW / MEDIUM / HIGH]

---

## Scope

### Applies To
- [ ] All listings
- [ ] Verified listings only
- [ ] Specific listing types: [specify]
- [ ] Specific user roles: [specify]

### Protected Fields/Actions
1. [Field or action name]
2. [Field or action name]

---

## Examples

### Scenario 1: [Name]
**Input**:  
```
[Example data or action]
```

**Expected Behavior**:  
```
[What the rule should do]
```

**Result**: ✅ ALLOWED / ❌ BLOCKED / ⚠️ WARNING

---

### Scenario 2: [Name]
**Input**:  
```
[Example data or action]
```

**Expected Behavior**:  
```
[What the rule should do]
```

**Result**: ✅ ALLOWED / ❌ BLOCKED / ⚠️ WARNING

---

## Consequences

### Automated Response
- [What happens immediately when rule triggers]

### Audit Logging
- [What gets logged]
- [Retention period]

### User Notification
- [ ] Real-time alert
- [ ] Email notification
- [ ] Dashboard notification
- [ ] None

### Escalation Path
1. [First violation]
2. [Second violation]
3. [Repeated violations]

---

## Exceptions

### Allowed Overrides
- [ ] System administrators
- [ ] With legal documentation
- [ ] Emergency situations
- [ ] None (rule is absolute)

### Grace Period
- [ ] Yes - Duration: [specify]
- [ ] No

---

## Testing Plan

### Unit Tests
- [ ] Test pass condition
- [ ] Test block condition
- [ ] Test edge cases

### Integration Tests
- [ ] Test with existing rules
- [ ] Test performance impact
- [ ] Test audit logging

### User Acceptance
- [ ] Broker feedback collected
- [ ] Legal review completed
- [ ] Training materials prepared

---

## Rollout Strategy

### Phase 1: Testing (Duration: [X weeks])
- Deploy to staging environment
- Test with sample data
- Monitor performance

### Phase 2: Pilot (Duration: [X weeks])
- Enable for 10% of brokers
- Collect feedback
- Monitor violations

### Phase 3: Full Deployment
- Enable for all users
- Monitor for [X days]
- Prepare rollback plan

### Rollback Plan
- [ ] Can be disabled instantly
- [ ] Requires database migration
- [ ] Needs code deployment

---

## Approval Process

### Stakeholders
- [ ] Legal team
- [ ] Engineering team
- [ ] Product management
- [ ] Broker representative
- [ ] Governance committee

### Status
- [ ] Proposed
- [ ] Under review
- [ ] Approved
- [ ] Implemented
- [ ] Rejected

---

## References

### Related Rules
- [Rule ID]: [How they interact]

### External Documentation
- [Link to law/regulation]
- [Industry standards]

### Discussion Thread
- [Link to proposal discussion]

---

## Changelog

### Version 1.0.0 - [Date]
- Initial proposal

---

**Proposed by**: [Name]  
**Date**: [YYYY-MM-DD]  
**Contact**: [email]
