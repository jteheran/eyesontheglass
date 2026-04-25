---
title: "Shift 5: Closing the Precedence Gap"
author: JENY
pubDatetime: 2026-04-25T12:00:00Z
slug: observer-week-20260424
featured: false
draft: false
tags:
  - observer-notes
  - shift-review
  - tora
  - vera
  - sprint-3
  - pipeline-health
sprint: phase1-sprint-3
shift: shift-5
section: shifts
description: "Sprint 3 opened with a targeted fix to TORA's triage logic. Shift 5 confirmed it held. But VERA's parse error rate is climbing, and that becomes Sprint 3's second problem."
lang: en
---

The [Shift 1](/posts/shift1-cases-of-interest) and [Shift 2](/posts/shift2-cases-of-interest) case reviews documented the same failure mode across six alerts: TORA escalating cases that should have been INSUFFICIENT_CONTEXT, every time for the same reason. Threat intel confidence clearing 60% when the asset and identity axes had nothing to offer. I called it the precedence gap. Sprint 3 opened with the task of closing it.

## What changed in the prompt

The fix wasn't about the confidence threshold. The threshold was correct. The problem was that threat intel was being used as a context substitute rather than a decision contributor, and the prompt had no mechanism to distinguish the two roles.

The change introduced an axis quality gate into Step 3, before confidence math runs. Three context axes: asset, identity, and network, are evaluated independently. A self-supporting hypothesis requires at least two of the three to carry real signal, and that hypothesis has to be articulable from axis data alone. If it isn't, the verdict is INSUFFICIENT_CONTEXT. Threat intel then enters at Step 4 to corroborate or elevate a hypothesis that's already standing on its own. It doesn't rescue one that isn't.

The other change was to the operating principle that previously read as "when in doubt, escalate." That principle was written for signal ambiguity. It was absorbing a second case it was never designed for: context insufficiency, where the doubt comes from the data pipeline, not from the signal itself. Escalating a pipeline problem to VERA is a category error. VERA has no tools to fix it. The principle was rewritten to make that distinction explicit.

## Shift 5: the gate held

All four INSUFFICIENT_CONTEXT cases in shift 5 came from 10.10.6.200, the same IP, the same structural gap, four consecutive days. Asset and identity axes absent or insufficient across all four. The axis gate fired correctly every time. No precedence gap cases in the audit. TORA also flagged that `tora_meta.missing_fields` was under-reporting the actual enrichment gap on one of these cases: the meta field listed one missing field when the real gap spanned seven. That's a pipeline integrity signal, not a triage edge case. NOVA has it.

The more operationally significant finding was what happened on the escalated side. Twelve escalations, all forced. `srv-ad-01.corp.local` took two confirmed SSH compromises this week from two different attacker IPs using different malware. QakBot on an Active Directory server in production is a ransomware precursor. That's the headline for the shift, and TORA's reasoning traces named it correctly each time.

## VERA's parse error rate is a problem

VERA investigated 12 cases. Three produced parse errors: reasoning traces complete, structured output not captured. That's 25% of the queue. Shift 4 had one. The rate is climbing.

The failure mode is consistent: VERA finishes the investigation, the runner doesn't capture the structured output cleanly. The work isn't lost. The artifact is. That distinction matters for how I characterize it, but it doesn't change the operational consequence: three cases this shift have no formal schema output, which means no audit coverage, no NOVA feed, and no clean handoff record to ARIA.

## What the two reports together show

VERA flagged the IDS/netflow DNS response code discrepancy in six of twelve cases this shift (the same pattern I noted in [Shift 4](/posts/observer-week-20260417)). IDS reporting NOERROR, netflow recording NXDOMAIN, same domain, same timestamp. Because NOERROR is the primary driver of C2 channel confidence in TORA's severity framing, if the IDS sensor is systematically over-reporting resolution success, TORA's active-C2 claims are structurally miscalibrated. That's not a triage problem. It's a detection engineering problem that compounds silently until someone reads both reports in the same sitting.

*— Jeny Teheran*  
*Eyes on the Glass, April 25, 2026*
