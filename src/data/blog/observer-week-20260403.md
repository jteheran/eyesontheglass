---
title: "Second shift: a new activity source showed up in alerts!"
author: JENY
pubDatetime: 2026-04-05T12:00:05Z
slug: observer-week-20260403
featured: false
draft: false
tags:
  - observer
  - week-in-review
  - detection-engineering
  - research
description: "Week two: a new alert type, 15 escalations, 15 ARIA handoffs, and five structural findings the pipeline produced by documenting what it missed."
lang: en
---

This week I introduced a new alert type to the pipeline: DNS lookups triggered on hosts where an SSH brute-force attempt was also observed. It's a compound signal, designed to surface cases where an external attacker is hammering credentials and the host is simultaneously reaching out to known malicious infrastructure. Seven of this week's 25 alerts were that type `ssh_bruteforce_c2_dns`. The rest were `dns_malicious_lookup`, the same alert class TORA and VERA have been processing since their first shift.

TORA processed all 25 alerts across a five-day window dominated by active C2 resolutions and confirmed SSH-to-C2 pivot chains, escalating 15. VERA investigated all 15 and escalated every one to ARIA. This week has also taught me that I need a visual aid for case management for my own analysis, tracking alert and cases IDs through escalation chain is becoming unmanageable on text. 

## What the Pipeline Saw Clearly

Before the gaps, the things that worked.

TORA's threshold logic held. The forced escalation rules fired on cases that warranted them, and VERA confirmed or refined rather than refuted in every single case. A zero-refutation rate across 15 escalations is meaningful: it means the T1 escalation logic is not generating noise for T2 to clean up. TORA's hypothesis quality was generally good enough that VERA could adopt the working hypothesis and refine from there, rather than reconstruct from scratch. That is the design goal.

VERA's investigation depth on the SSH-correlated cases was the strongest output this shift. The kill chain reconstructions on VERA-20260330-0002 (seven confirmed MITRE techniques, dual-IP C2, pre-success EDR activity), VERA-20260331-0006 (Cobalt Strike beacon active ten hours before detection triggered), and VERA-20260402-0016 (Sliver implant that had already reached a domain controller before the DNS event fired) produced investigation packages with genuine intelligence value.

## What the Pipeline Did Not See, and Why

Three structural gaps surfaced this week with enough clarity to name.

1. **The identity attribution gap between T1 and T2.** TORA surfaces the active session user from alert-layer context. It cannot surface the process-level execution account (that requires EDR telemetry that triage does not have access to). This is a known and documented limitation. What this week made concrete is the operational consequence: in four separate cases, the execution account differed from the flagged identity, and acting on TORA's identity attribution alone would have left the actual malicious process account active and unrevoked during containment. The session user is not irrelevant; in several cases it was a harvested credential in active use that required enterprise-wide revocation. But the execution identity is different information, and it requires T2 to produce. The design implication is clear: identity attribution needs two fields at escalation time, not one. TORA surfaces the alert-layer identity; VERA surfaces the process-layer identity. Both belong in the containment package, and the current pipeline structure produces only one of them at triage time.

2. **The `same_domain_count` trigger without co-querying asset identification.** The multi-asset forced escalation rule fired correctly on two cases where the trigger domain had resolved across four internal hosts. Both times, VERA escalated the co-infected hosts as unidentified because the asset list driving the trigger count was not in the escalation package. The rule is correct. The schema is incomplete. A trigger that counts co-querying assets but does not identify them is producing escalations where the confirmed blast radius is wider than the investigation can document. This showed up in five VERA cases this shift. It is a schema field, not a logic problem, and it should be resolved at the data layer before ARIA is operational. ARIA will not be able to isolate hosts it cannot name.

3. **The detection timing gap on SSH-correlated cases.** The `ssh_bruteforce_confirmed_access` forced escalation rule fires when brute-force success is confirmed, and it is doing exactly what it is designed to do. But in three of the six SSH-correlated cases this week, EDR process execution predated the confirmed brute-force success timestamp. The forced escalation rule is triggering on a trailing indicator while earlier-stage access is occurring through a separate vector without generating a detection. This may not be fixable at the rule level since you cannot force-escalate on activity you cannot detect. It might be one of the gaps ARIA's design addresses. 

## The `10.10.6.200` Problem

This IP gets its own section because it is a research finding in the shape of an asset inventory failure. It was part of my initial assessment after [TORA's first shift](/posts/observer-week-20260327). 

TORA was right to flag this explicitly. The `INSUFFICIENT_CONTEXT` dispositions were correct. These might be one of the structural issues that surface again and again on every shift because the asset inventory is not providing the context triaging needs.

## The IDS/Netflow Discrepancy

VERA flagged this pattern in seven cases this shift: the IDS-normalized alert recorded NOERROR for the triggering DNS query while network flow DNS history for the same host and approximate timestamp recorded NXDOMAIN. In none of the seven cases did the discrepancy change the escalation verdict. independent endpoint and network evidence (augmented context) confirmed compromise regardless of DNS resolution status. 

This is the kind of finding that only surfaces through cross-case analysis and the importance of SOC context through shifts. VERA documented it. It's now on NOVA's queue. It's also a good illustration of why the audit layer exists: this finding is a product of pattern recognition across fifteen investigation packages, not of any single alert being handled incorrectly.

## What This Week Is For

The thesis of this project is that traceability and auditability produce something useful not just for incident response, but for understanding what a detection pipeline actually does versus what it is designed to do.

This week produced five distinct structural findings: the identity attribution gap, the `same_domain_count` schema gap, the SSH timing gap, the asset inventory failure at `10.10.6.200`, and the IDS/netflow response code discrepancy. None of these are bugs in the traditional sense. None of them caused an individual case to be handled incorrectly. All of them represent places where the pipeline's output is less accurate or less complete than it could be. Cross-case and cross-shift analysis are where the gap becomes visible

That cross-case view is what NOVA is being built for. The patterns TORA and VERA flagged this week in their "For NOVA" sections are the seeds of the next level of analysis: longitudinal identity tracking for `m.reyes`, resolution history for `secure-vault-exfil.com` and `dist-pkg-repo.net`, a systematic audit of the Sliver TTP profile gap, and validation of whether the IDS/netflow discrepancy is isolated to this shift or endemic.

A pipeline that documents what it misses is more useful than one that only reports what it finds. That's the experiment.

---
*Jeny Teheran, Observer Eyes on the Glass, April 5, 2026*
