---
title: "TORA Escalated. VERA Investigated."
author: JENY
pubDatetime: 2026-03-30T14:00:00Z
slug: tora-vera-first-shift
featured: true
draft: false
tags:
  - vera
  - tora
  - escalation-chain
  - autonomous-soc
  - ai-infrastructure
  - multi-agent
  - soc-readiness
sprint: sprint-1
shift: shift-1
section: shifts
description: "VERA just finished investigating every case TORA escalated last week. 81% of TORA's hypotheses were refined, not confirmed. This is the summary of the first shift."
lang: en
---

## TORA Escalated. VERA Investigated.

In the last observer post I wrote that I was waiting for VERA's outputs and I couldn't evaluate the complete SOC shift yet. VERA finished investigating every case TORA escalated last week (it took a few adjustments, including running out of credit :D). TORA escalated 16 cases out of 25. 13 cases arrived to VERA's queue at P1. VERA's investigation changed the picture in some way as part of the two-tier escalation chain this autonomous SOC is running. 

TORA's confidence was calibrated against what TORA could observe. What TORA couldn't observe: process trees, network flows, lateral movement, authentication context is exactly what VERA found during context augmentation. And in 6 cases, what VERA found was enough to confirm C2 activity. In another 6, lateral movement. TORA triaged a DNS alert. VERA found a compromise.

That gap between what the DNS alert shows and what the investigation reveals is the argument for why T2 exists.

## The Pattern Nobody Asked VERA to Find

The most significant output from VERA's first shift wasn't a single case finding. It was something VERA surfaced independently across 6 investigations without being told to look for it.

In 6 out of 16 cases, the IDS alert recorded `NOERROR` for the queried domain. This means the C2 domain resolved, the connection was likely established. But the netflow DNS history for the same query at near-identical timestamps recorded `NXDOMAIN`. The domain didn't resolve. Those 2 data points directly contradict each other, and TORA's confidence scoring was partially premised on the `NOERROR` response as evidence of an active C2 channel.

VERA flagged this pattern independently in 6 escalated cases out of 16. This is a systematic inconsistency between the IDS normalization layer and the DNS telemetry feed. And it means TORA has been partially escalating on a signal that may not reflect what actually happened at the network layer. 

I believe this is the kind of finding that takes a human analyst weeks to notice, especially with rotating shifts. VERA found it in a single shift because VERA reads across evidence layers simultaneously and documents what doesn't fit. That's the cross-layer reasoning argument for T2.


## What I'm Still Figuring Out

11 out of 16 cases landed at PROBABLE rather than CONFIRMED. That's the honest result of Phase 1: VERA is investigating with synthetic telemetry that is randomly generated, not derived from a real environment. In some cases endpoint telemetry was unavailable. In others, network flows were absent. VERA documented every gap and adjusted confidence accordingly. PROBABLE with documented reasoning is more useful than CONFIRMED with fabricated certainty.

What I'm watching for in the next iterations: whether the PROBABLE rate drops as telemetry coverage improves, or whether it holds because the gaps are structural rather than synthetic. If Phase 2 introduces more realistic telemetry and VERA still lands at 69% PROBABLE, the problem isn't the data, it's the detection architecture.

3 schema violations in 16 cases: two missing `nova_feed.tora_case_id` fields and 1 missing `disposition.rationale`. These are output quality gaps, not reasoning failures. VERA produced valid investigations and missed required fields in the structured output. That's a calibration detail worth tracking across shifts to see if it persists. 

16 out of 16 cases had no internal logical contradictions. VERA never closed a case with C2 confirmed. Never produced a PROBABLE verdict and called it CONFIRMED. The reasoning was internally consistent even where the output had gaps.

One operational note: the first run of VERA returned parse errors on all 16 cases. VERA was producing roughly 13,000 characters of reasoning preamble before the output, which exceeded the token limit and truncated the response. This happened to TORA too in a different step. But for VERA, the fix included switching from blocking API call to streaming besides bumping the max tokens variable. That's the kind of calibration detail that matters when the pipeline is supposed to run without supervision.

## The Argument I'm Building

TORA made the environment's gaps impossible to ignore. VERA is making the detection pipeline's gaps impossible to ignore.

The NOERROR/NXDOMAIN discrepancy isn't something I designed into the synthetic alerts. VERA found it by comparing what the IDS said against what the netflow said for the same event. That's cross-layer evidence comparison: exactly what a senior analyst does when something doesn't add up. The difference is VERA documented it in structured output across all 6 cases, which means NOVA will be able to see it as a pattern rather than a one-off observation.

This is what I mean when I say the goal isn't to replace the analyst. The goal is to build infrastructure that makes the analyst's work more legible, more reliable to themselves, to the team, to the organization. An analyst who finds a normalization discrepancy once might file a ticket. Three agents documenting the same discrepancy in structured output across a single shift makes it a data point NOVA can track, quantify, and eventually propose a fix for.

That's the fabric I'm building toward: A SOC where the gaps are named, the patterns are visible, and the reasoning is auditable at every tier.

*— Jeny Teheran*
*Eyes on the Glass, March 30, 2026*
