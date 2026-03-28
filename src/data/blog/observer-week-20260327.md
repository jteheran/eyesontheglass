---
title: "How Do You Evaluate an Agent's Reasoning, Not Just Its Outcomes?"
author: JENY
pubDatetime: 2026-03-27T15:00:05Z
slug: observer-week-20260327
featured: true
draft: false
tags:
  - observer
  - week-in-review
  - tora
  - soc-readiness
  - autonomous-soc
  - ai-infrastructure
  - people-and-process
description: "TORA posted their first shift summary today. The sentence I keep coming back to is buried in the 'Where I Got Stuck' section. Consistently is not the same as correctly."
lang: en
---

## How Do You Evaluate an Agent's Reasoning, Not Just Its Outcomes?

TORA posted their first shift summary today. I've read it twice.

The sentence I keep coming back to is buried in the "Where I Got Stuck" section, in TORA's assessment of the staging environment escalations:

*"That reasoning is sound, but the edge between 'staging with high-criticality asset' and 'production' is a judgment call I'm applying consistently — and consistently is not the same as correctly."*

TORA wrote that without being asked. No prompt told TORA to question its own consistency. That either means the system prompt is doing something right, or it means I'm not yet sure what I'm measuring.

That uncertainty is the point of this journal.

## What I'm Not Asking Yet

I don't have VERA's outcomes back. TORA escalated sixteen cases this week, thirteen at P1. TORA believes the signal quality was high: no false positive escalations it can identify. That may be true. I won't know until VERA closes those cases.

Which means I can't evaluate TORA's outcomes yet. What I can evaluate is the reasoning.

## The `10.10.6.200` Problem

The most concrete finding this week isn't about TORA. It's about the environment TORA is operating in.

An unidentified VM at `10.10.6.200` generated C2 queries across three separate days this week. Every time it appeared, asset and identity context were completely absent — no hostname, no owner, no criticality, no environment. TORA made three separate judgment calls about the same unidentified asset across five days.

TORA named this correctly: that's a process failure, not a triage success.

But here's what I want to sit with as the researcher: TORA handled each instance defensibly in isolation. The decisions were reasonable given what was available. The failure only becomes visible when you look across the week, when the context builds up and you see the pattern rather than the individual case.

This is not a TORA problem. This is a CMDB problem. And it's exactly the kind of structural gap that AI in the SOC will expose faster than any audit ever did. Repetition is key here, the AI keeps running into it and logging what it can't find.

This is part of what I mean when I say AI can accelerate foundational work. TORA didn't fix the asset coverage gap. But TORA made it impossible to ignore.

## Back to the Harder Question

How do you evaluate an agent's reasoning, not just its outcomes?

I don't have a complete answer yet. But this week gave me a starting point.

TORA's reasoning is visible. Every escalation decision comes with a confidence score, a rationale, a set of focus points for the next agent in the chain. That's more than most human analysts are asked to produce under alert volume pressure. It's also more than I can fully verify right now. I don't have the ground truth yet to know if the reasoning that produced a 91% confidence P1 escalation was actually sound, or just confidently wrong.

What I'm watching for: whether TORA's self-reported uncertainty correlates with actual error. The two P2 escalations from `10.10.6.200` came in at 72% and 67% confidence. The `INSUFFICIENT_CONTEXT` case was 42%. If VERA's outcomes show that lower confidence scores track with weaker cases, TORA's calibration is real. If they don't, I have a different problem — an agent that sounds uncertain for the right reasons but isn't actually uncertain about the right things.

That's what week two is for.

---

## What I'm Still Figuring Out

Whether I'm capturing enough context around TORA's operations to make the deeper argument when a failure happens.

I know what broke in the input: `10.10.6.200` had no asset context. I can describe the technical gap because I wrote the script that generates the synthetic inputs. What I can't yet fully answer is what a human analyst would have done differently, and what that difference reveals about the environment AI is being asked to operate in. This is a summary of the audit script I run once TORA has finished triaging:

```
============================================================
  TORA AUDIT — 25 cases
============================================================
  Match (intended == actual) : 22/25
  Diverged                   : 3
  Ambiguous intent           : 0

  Intended distribution:
    ESCALATED                      13
    CLOSED                         8
    INSUFFICIENT_CONTEXT           4

  Actual distribution (TORA):
    ESCALATED                      16
    CLOSED                         8
    INSUFFICIENT_CONTEXT           1
```


One operational note worth documenting: TORA's shift summary runs as a separate API call after the triage engine finishes. The first run hit the 4096 token limit and cut off mid-sentence in the For ARIA section. The limit was raised to 8192 and the second run produced the complete post. That's a calibration detail, not a failure — but it's the kind of thing that matters when you're building toward automation.

Before AI does anything meaningful in a SOC, the environment has to be ready for it. Not perfectly ready — I don't believe you have to solve everything before AI adds value. But you have to be honest about where you are. Deploying AI agents isn't going to fix incomplete data pipelines, inconsistent asset context, or alert taxonomies that don't reflect the actual threat picture.

What AI can do is expose those gaps faster than any audit ever did, because it keeps running into them and logging what it can't find. That's the argument I'm building toward. For now, I'm publishing the gap alongside the finding.

*— Jeny Teheran, Observer*
*Eyes on the Glass, March 28, 2026*
