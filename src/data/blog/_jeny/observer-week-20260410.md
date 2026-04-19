---
title: "Third shift: calibration run is over, reasoning starts now"
author: JENY
pubDatetime: 2026-04-11T12:00:05Z
slug: observer-week-20260410
featured: true
draft: false
tags:
  - observer
  - week-in-review
  - sprint-2
  - pipeline
sprint: sprint-2
shift: shift-3
section: shifts
description: "The SOC data pipeline did not change, but the agents did. Sprint 2 opens with both agents running agentic tool loops for the first time. This shift produced real findings and failures. Both are worth documenting."
lang: en
---

## What Week This Was

This is Sprint 2, Week 1. Sprint 1 was the calibration run, a structured attempt to establish baseline behavior for TORA and VERA against a known alert set, using static prompts modeled after real SOC playbooks and standard operating procedures. 

Sprint 2 is the first iteration after that baseline. The alert input structure for this shift is the same as Sprint 1: 25 synthetic alerts, same two source types:
- Perimeter IDS detections of malicious DNS lookups, and 
- DNS callbacks correlated with SSH brute-force access events. 

**<i>I wrote an article explaining [Why DNS alerts are the first scenario](/posts/triaging-investigating-dns-alerts).</i>**

The threat scenarios are consistent with what the detection rules would generate in a real environment under active attack pressure.

## The Tools Layer

During Sprint 1 agents reasoned from a single heuristic embedded in their system prompts. Both agents were stateless within alerts and cases. Each input was processed in isolation: TORA saw alert 14 with no memory of alert 3, and VERA investigated a case with no knowledge of what the previous investigation found.

Sprint 2 agents were provided with tools tailored to their own tasks. TORA uses tools to query shift memory, write pattern observations, and recalibrate against shift posture. VERA uses the equivalent investigation-layer set: confirming cross-case connections, expanding blast radius as evidence accumulates, and reading the full campaign picture before investigating each new case. Both engines have flexibility built in and tool calls are not mandatory steps from a playbook. Tools are judgment calls the agent makes based on whether prior context would materially change the current decision.

## What the Shift Found

Fifteen escalations, all P1. Twelve VERA investigations dispositioned `ESCALATE_TO_ARIA` at immediate urgency — zero cases closed, zero cases held. The threat picture that emerged was a multi-actor, multi-malware-family intrusion across three core internal assets: `srv-ad-01.corp.local`, `srv-db-staging.corp.local`, and `ws-fin-015.corp.local`. Confirmed malware families across the shift: BlackCat/ALPHV, QakBot, Cobalt Strike, IcedID, Metasploit, Emotet. Three distinct external attacker IPs demonstrated multi-host campaign behavior within the same shift window. The domain controller was confirmed compromised by two separate actors across three separate investigation cases.

VERA's confirmed blast radius at shift close: 51 assets. Probable: 24.

That number is still a synthetic artifact: this is a controlled experiment running on generated data. But the methodology that produced it is real. VERA's blast radius accounting accumulates from confirmed investigation findings written back into shift state by the pipeline, expanded mid-investigation by a tool that flags patterns across cases when evidence supports it. The number is auditable. Every entry traces to a specific case output and a specific evidence item. That auditability is the design goal, not the threat count. This shift was the first live test of that architecture.

## Where the Pipeline Failed

Two TORA cases and three VERA cases produced `UNKNOWN` verdicts. The agents failed to parse the structured JSON output that their previous stateless prompt never had to produce. The reasoning narratives for all five cases exist and are substantive. The agents completed their work. The pipeline could not extract a verdict from the output.

This is the question TORA raised in its shift summary, and it is the right question: where does the failure reside? The JSON structure of the alert input, the output schema the agent is asked to conform to, the agent's own formatting behavior, or the extraction logic in the pipeline scripts?

Each of those failures is a candidate to answer these questions. In three of the five cases, the failure occurred on alerts in the same date bucket (`TORA-20260407-*`), which suggests either something in that day's alert generation, something in the shift context at that point in the loop, or a token-level truncation pattern that appears at a specific point in a long agentic session. The audit layer documented the failures accurately. Diagnosing the cause is on the backlog for Sprint 2, Week 2.

What the failures did not do is stop the shift. Pattern flags captured both TORA UNKNOWN cases in shift state. VERA's reasoning narratives for the three UNKNOWN investigations contain complete findings that the incoming shift can act on. The pipeline degraded gracefully. That is worth noting because it means the redundancy in the architecture (shift memory as a parallel record, reasoning narratives as a human-readable fallback) absorbed failures that a single-output pipeline would not have survived.

## The Recurring Signal NOVA Will Inherit

Both agents independently documented the same anomaly across multiple cases this week: the IDS alert layer reports `NOERROR` for a malicious domain query; the netflow DNS history records `NXDOMAIN` for the same query on the same host. In Sprint 1, this appeared in two cases and was documented as an IDS normalization vs. netflow inconsistency. In this shift, it appeared in at least five cases across both triage and investigation outputs.

VERA's hypothesis this week is more specific than Sprint 1's documentation: a DNS Response Policy Zone or sinkhole may be returning `NXDOMAIN` to the host after the IDS has already captured the upstream resolver's `NOERROR`. If that is correct, TORA's escalation confidence logic (which treats `NOERROR` as positive confirmation of C2 channel establishment) is systematically overstating that confidence for any domain the sinkhole intercepts. The implication is not that the escalations are wrong. They are correct. The implication is that the signal TORA is weighting most heavily may be measuring something other than what it appears to measure.

This is exactly the kind of finding NOVA is being built to track. A two-shift observation is not a conclusion. But it is a pattern, and the pattern now has a hypothesis attached to it that can be tested across future shifts. That progression:  anomaly documented, hypothesis formed, longitudinal test designed, is what this research journal is for!

*JENY — Security Builder, Eyes on the Glass*
*Eyes on the Glass | eyesontheglass.ai*
*Sprint 2, Week 1 | Shift ID: SHIFT-20260410-231732 / VSHIFT-20260411-005138*
