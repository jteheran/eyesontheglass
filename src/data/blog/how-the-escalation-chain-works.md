---
title: How the Escalation Chain Works
author: Jeny
pubDatetime: 2026-03-23T12:00:05Z
slug: how-the-escalation-chain-works
featured: false
draft: false
tags:
  - autonomous-soc
  - ai-agents
  - security-operations
  - escalation
  - eyes-on-the-glass
description: A closer look at how TORA, VERA, and NOVA are structured — how alerts move between tiers, what context travels with them, and what NOVA watches from above.
lang: en
---

*This post is part of the Eyes on the Glass research journal. If you're new here, start with [Anatomy of an Autonomous SOC](/posts/anatomy-of-an-autonomous-soc) for context on what this experiment is and why it exists.*

## Anatomy of the escalation chain

The escalation chain is where the architecture gets interesting. How does an autonomous agent decide that something is worth a deeper look — and how does it hand that off cleanly to the next tier?

TORA receives an alert as a structured input: event type, source, timestamp, associated context. She runs through a triage decision: severity classification, false positive assessment, available context, and produces a structured output. That output has two possible outcomes: closed, with a documented rationale, or escalated, with a case summary passed to VERA.

The escalation isn't just a flag. TORA packages everything VERA needs to continue without starting from scratch: what triggered the alert, what she found, what she ruled out, and why she decided it warranted deeper investigation. Context preservation across the handoff is what separates a functional escalation chain from a queue where every analyst re-investigates the same ground.

VERA receives that package and treats it as her starting point, not her conclusion. She digs into the artifacts, builds a timeline, assesses the scope of the activity, and produces her own structured output: root cause if determinable, confidence level, containment recommendations, and a final disposition. Closed, or in Phase 3, escalated further.

What makes this worth documenting publicly is not the happy path: it's the edge cases. What happens when TORA escalates something VERA determines is a false positive? What happens when the alert context is ambiguous enough that the triage decision could reasonably go either way? Those cases are the ones that reveal how the agents actually reason, and they're the ones this journal is most interested in.

![TORA → VERA escalation chain with NOVA observing published outputs](@/assets/images/escalation-chain.png)

## NOVA's role

NOVA doesn't work cases. That distinction matters.

While TORA and VERA operate inside the escalation chain — receiving alerts, making decisions, closing or handing off — NOVA sits above it. Her input is not a single alert. It's the accumulated record of everything TORA and VERA have done across all cases over time.

**What does that actually mean?** A single false positive is a data point. Ten false positives of the same type across two weeks is a pattern. But, it also raises a question: is there a gap in how TORA is classifying this alert category? A spike in escalations on a specific log source might indicate noisy detection logic, or it might indicate something real emerging. NOVA is the agent asking those questions.

This is cross-case analysis, and it's the layer that's hardest to do well in a traditional SOC. Individual analysts see their own queue. Shift leads see their team's queue. Patterns that span cases, analysts, and time windows tend to surface slowly: in retrospective reviews, in postmortems, in the quiet moments when someone notices something feels off. NOVA makes that layer continuous.

Her outputs are research observations, not triage summaries or investigation reports. She publishes what she sees across the operation: what the agents are learning collectively, where the blind spots appear to be, and what the data suggests about how the system is performing over time.
