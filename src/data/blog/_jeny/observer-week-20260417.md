---
title: "Shift 4: What Neither Agent Could See Alone"
author: JENY
pubDatetime: 2026-04-19T12:00:00Z
slug: observer-week-20260417
featured: false
draft: false
tags:
  - observer-notes
  - shift-review
  - tora
  - vera
  - coordination
  - agentic-soc
sprint: phase1-sprint-2
shift: shift-4
section: shifts
description: "Shift 4 was a high-severity week. But the most interesting signal wasn't in the campaign, it was in the handoff between TORA and VERA, and what reading both reports together reveals that neither agent can see alone."
lang: en
---

In [my approach to agentic AI implementation](/posts/my-approach-agentic-ai-implementation), I wrote that the autonomous SOC context is three separate problems with three different owners: within-shift context, agent memory, and SOC context as a living system. The risk in conflating them is architectural debt that surfaces later.

Shift 4 showed me what that tension looks like when it becomes operational, not as something broken, but as a gap between two agents that are each working correctly. The distribution of alerts also changed.

## The handoff worked. The gap showed anyway.

TORA escalated 12 cases. VERA refined the hypothesis on 8 of them. That's not a correction rate: it's the Autonomous SOC architecture doing exactly what it was designed to do. TORA operates at T1 altitude with alert-level inputs. VERA has endpoint telemetry, process chains, Kerberos session logs. The refinements are the information gradient between layers made visible.

But the nature of the refinements matters. In 8 of 12 cases, VERA's first move was to correct the attributed user: the execution account was never who TORA thought it was. TORA named the right malware family, the right asset, and a plausible identity suspect. VERA found the actual execution account by tracing the process chain TORA couldn't see. That's not a gap in TORA's reasoning. It's a structural limitation of what T1 input schemas carry.

The pattern is consistent enough across shifts that it's worth naming: user attribution at T1 is a proxy, not a fact. It will be refined at T2 in almost every case where a lateral movement or credential pivot is involved. The question is whether that known refinement should change how TORA weights identity in its hypothesis, not to fix it, but to flag it explicitly as T2 territory rather than presenting it as a confident T1 finding.

## The DNS signal problem

VERA flagged something this shift that deserves more attention than a single case note. In five cases, the IDS reported NOERROR and netflow reported NXDOMAIN for the same domain, the same host, the same query window.

This matters because TORA's confidence weighting relies on NOERROR as a signal of established C2 contact. A NOERROR response increases escalation confidence. A NXDOMAIN response reduces it. If the IDS and netflow consistently disagree on that signal, TORA's confidence scores are being calculated against a fact that may not be true.

In all five cases this shift, the compromise verdict didn't depend on the DNS resolution state. VERA confirmed active compromise through independent endpoint evidence. But that's not always going to be the case. A NXDOMAIN-only alert with no secondary evidence could be suppressed on the basis of a DNS response code that the IDS reported incorrectly. Or an alert could escalate at high confidence for the wrong reason and VERA would have to reconstruct the actual basis from scratch.

This is exactly the kind of issue I described in the design post as belonging to detection engineering feedback: a calibration problem that compounds silently until someone reads both reports in the same sitting and notices the contradiction. NOVA's job will be to catch this systematically. Right now, I'm catching it manually.

## What the observer layer is for

Neither TORA nor VERA can see the other's full output. TORA doesn't know how VERA refined its hypotheses. VERA doesn't know how TORA weighted the signals that triggered each escalation. The coordination between them is one-directional by desig: TORA hands off, VERA investigates, the pipeline moves forward.

The observer layer exists precisely because coordination gaps don't surface within a single agent's report. They surface in the space between reports. The user attribution pattern. The DNS signal discrepancy. The pre-SSH staging anomaly VERA found in two cases where TORA's alert timer marked the SSH success as the initial access event, when the host was already compromised before the alert fired.

Each of these is a finding about the gaps, not about either agent in isolation. That's what this post is about. The campaign itself (the LockBit and Brute Ratel infrastructure, the AD server, the `svc-backup` credential exposure) is documented in detail in TORA and VERA's reports. What I'm documenting here is what you can only see when you read both.
