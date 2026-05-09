---
title: "Shift 7 Review: Beyond DNS"
author: JENY
pubDatetime: 2026-05-09T18:00:00Z
slug: observer-week-20260508
featured: false
draft: false
tags:
  - observer-notes
  - shift-review
  - tora
  - vera
  - sprint-4
  - pipeline-health
  - phishing
sprint: phase1-sprint-4
shift: shift-7
section: shifts
description: "Shift 7 introduced phishing email alerts for the first time. The agents handled them. The pipeline between them didn't."
lang: en
---

Shift 7 processed 25 alerts across five days: a multi-asset Remcos C2 campaign, an active Okta-impersonation credential-harvest operation, and the first phishing email alerts this pipeline has ever seen. TORA escalated 11 cases, all P1. VERA investigated 10 of them to confirmed verdicts, all ESCALATE_TO_ARIA at immediate urgency. The agents performed. The pipeline didn't integrate the new events.

## A new kind of alert

Every alert in Shifts 1 through 6 was DNS. DNS malicious lookups, DNS tunneling, fast flux, SSH-correlated DNS callbacks. Shift 7 added `email_delivery` and `email_click` to the alert queue for the first time.

A DNS alert surfaces a host contacting a domain. A phishing email alert surfaces a user making a decision: clicking a link, submitting credentials, opening an attachment. Phishing email alerts are among the most common alert types in any real SOC. Running six shifts without them was a gap in the simulation, not a gap in the threat landscape.

TORA handled the shift correctly. The forced escalation rules applied cleanly across asset criticality, privilege level, and campaign scope. The `gateway_verdict=malicious` paired with `gateway_action=delivered` on six cases across five days: the O365 gateway detecting the threat and delivering it anyway is a finding TORA named on the first case and tracked across the full shift. That's the shift memory working as intended.

VERA's investigations on the phishing cases were substantive. VERA-20260504-0003 opened as a credential-harvest case and closed as an active post-exploitation intrusion: confirmed lateral movement to DC-291, LOLBin tooling deployed under a second compromised account, four file artifacts in canonical malware staging paths, C2 established to an external IP on port 1337. TORA handed off a phishing case. VERA handed off a domain compromise in progress. That refinement from entry point to confirmed scope is exactly what T2 investigation is supposed to produce.

## What the pipeline forgot to pass along

What didn't work was the layer between TORA and VERA.
The escalation pipeline builds VERA's investigation package from TORA's escalation output. It knows how to pass through threat intel, asset context, endpoint telemetry, and network flows. It was built when every alert was DNS. It doesn't know about `email_context`.

The result: VERA investigated every phishing case this shift without knowing it was a phishing case. The `email_context` block was stripped at the handoff. VERA received endpoint telemetry and network flows, reasoned from those correctly, and reached accurate verdicts. But the email kill chain: 

- delivery, 
- click, 
- credential submission,
- gateway failure, 

was invisible to VERA at investigation time. VERA reconstructed it from endpoint evidence rather than from the context TORA had already assembled.

This matters for a reason that goes beyond this shift. In a real SOC, the T1 analyst documents the email context as part of the escalation package: sender infrastructure, delivery path, authentication failures, what the user did. The T2 analyst receives that documentation and uses it as a starting point, not something to re-derive from endpoint logs. VERA ended up doing more work than it should, on evidence that's less direct than what TORA already had.
The deeper lesson applies every time a new alert type gets added: the agents are not the only update surface. Every component in the pipeline that touches the alert schema is a potential gap.

*— Jeny Teheran*
*Eyes on the Glass, May 9, 2026*
