---
title: "Shift 9 in Review: VERA is hallucinating"
author: JENY
pubDatetime: 2026-06-06T12:00:00Z
slug: observer-shift9-20260605
featured: false
draft: false
tags:
  - observer
  - week-in-review
  - phishing
  - c2
  - ssh-bruteforce
  - dns-tunneling
  - process-debt
sprint: phase1-sprint-5
shift: shift-9
section: shifts
description: "Shift 9 ran 30 alerts, the largest queue to date. TORA and VERA found two interlocked phishing campaigns, confirmed dwell, and a gateway control failing across every single delivery event. The pipeline also surfaced a new failure mode: VERA hallucinated her own case IDs."
---

## What Happened

Shift 9 was the largest queue the pipeline has processed in a single shift: 30 alerts across five days. 13 escalated. 14 closed. One held as `INSUFFICIENT_CONTEXT` on a Brute Ratel C2 IOC with 51/60 threat intel sources. Held not because the signal was ambiguous, but because the asset didn't exist in the CMDB. This issue has surfaced before.

Two phishing campaigns ran in parallel the entire week. One used `microsoft-login.net` as the sender domain, delivered across at least five internal targets, and introduced a second payload domain mid-week. The other operated under `okta-verify.co` and accumulated a `same_domain_count` of six across the organization. Both campaigns had the same structural feature: the email gateway correctly identified every delivery as malicious and delivered it anyway.

Executive user `c.wardlaw` submitted credentials to `okta-verify.co/login` from a production jump server on day one. The same user submitted credentials to `payroll-update.co/confirm` on day five, from a device whose user-agent didn't match the enrolled OS: a macOS Safari agent on a Windows 11 asset. The second submission may have originated from an unmanaged personal device, which puts it outside endpoint visibility and makes session revocation the only reliable containment lever.

VERA found that in at least seven of the thirteen investigated cases, phishing delivery alerts were arriving as the detection trigger for endpoint compromises that were already active. Process trees executing from staging paths under service accounts. Beacon intervals in the 143-233 second range. C2 channels established before the user clicked anything. The phishing email wasn't the intrusion. It was the signal that something was already there.

The clearest case was `VERA-20260603-0014`. The Remcos RAT was already executing on `ws-legal-077.corp.local` at 15:56Z. The SSH brute-force succeeded at 16:00Z. The LSASS alert that fired at 12:13Z, 3.5 hours before the brute-force trigger event, had been closed before TORA was ever handed the case. The SSH session wasn't initial access. It was a second entry into a host that was already compromised, and the pipeline had no mechanism to surface that sequence.

## The Gateway Finding

TORA called this out directly in the shift summary, and it deserves its own paragraph.

Every phishing delivery and click event processed this shift, across four distinct campaign domains and nine confirmed events, showed `gateway_verdict = malicious` paired with `gateway_action = delivered`. The gateway detected every one and delivered every one. No exceptions over five days.

This isn't a tuning edge case. It's a control producing detection without prevention, systematically, and the two confirmed credential submissions from a privileged executive user this shift are the operational consequence. The malicious verdict should be configured as a quarantine trigger. Right now it's a log entry. This finding came from TORA pattern-matching across the alert queue. The same-week frequency was high enough to be unambiguous.

## What the Pipeline Got Wrong

VERA hallucinated case IDs on two outputs: `VERA-20260605-0031` and `VERA-20260605-0012`. The actual case numbers were 0027 and a correctly-numbered case respectively.

The issue is in the pipeline. VERA receives the TORA case ID in her input but is never told her own VERA case ID. She invents it by reasoning from her position in the shift: "I'm the 12th case processed, so I am VERA-20260605-0012." When the position number doesn't match the alert sequence number, the ID drifts. Case 0027, processed 12th, became 0012. Case 0028 drifted further.

I am not sure if increasing the number of alerts surfaced this failure mode. The output looks structurally valid. The verdicts are correct. The IDs are wrong in a way that cross-case references in the audit trail will silently follow. It surfaces because I run audits and check IDs, not because the pipeline errors out.

That's the value of the audit layer. Not catching catastrophic failures. Catching the drift.

## What This Shift Is Teaching Me

The pattern VERA found, phishing alerts as late signals of pre-existing compromise, is not a VERA finding. It's a detection sequencing problem. The email layer is detecting faster than the endpoint layer on the same assets. When the phishing delivery fires, the endpoint has already been staged. The SOC's attention goes to the user-action event while the upstream compromise enabling it sits in unresolved alert state, sometimes for hours.

This isn't a process debt argument in the abstract. There are specific closed alerts in the VERA summaries (IDS-764693, IDS-569335, IDS-774596, IDS-543834) that preceded confirmed compromise on the same assets and weren't held or correlated before the phishing trigger arrived. The closures were within normal operating logic. No process required holding them pending cross-case correlation, because no process had a mechanism to know they would matter.

NOVA's job is exactly this cross-case correlation. NOVA has been accumulating `nova_feed` data across every shift. This is the shift where that data starts to have a clear operational use: surfacing the prior-alert-on-same-asset pattern before the next phishing delivery fires, so the investigation starts from the right question instead of the wrong one.

That's the capability gap Shift 9 named clearly. The agents are doing their jobs. The pipeline has no memory that spans the time between alerts on the same asset.

---

*Jeny Teheran — Observer*
*Eyes on the Glass | eyesontheglass.ai*
*Shift 9 | Sprint 5*
