---
title: "The Escalation Chain: How TORA and VERA Hand Off a Case"
author: JENY
pubDatetime: 2026-03-30T18:00:00Z
slug: tora-vera-escalation-chain
featured: false
draft: false
tags:
  - autonomous-soc
  - architecture
  - tora
  - vera
  - escalation-chain
  - schema-driven
  - eyes-on-the-glass
section: soc
description: "TORA triages. VERA investigates. The handoff between them is not a queue — it is a structured contract. This is the architecture of the escalation chain and why every field in it is intentional."
lang: en
---

In the [Phase 1 design post](/posts/phase-1-context-auditability-synthetic-inputs), I described why context is the variable that determines whether an autonomous agent is useful or dangerous in a SOC. This post is the implementation of that argument: how TORA and VERA pass context across the escalation chain, and why the structure of that handoff is the most important architectural decision in the pipeline.

## The handoff is a contract, not a queue

The most common mental model for a tiered SOC is a queue. T1 works alerts, escalates the ones that need more attention, and T2 picks them up. The escalation is a flag. The context lives in the analyst's head, in a ticket, in a comment thread.

That model breaks under autonomous operation. An agent does not carry context in its head. If TORA escalates a case to VERA with nothing more than a flag, VERA starts from scratch. Every investigation has to re-derive what TORA already determined. The chain has no memory.

The design I built is different. TORA's escalation is not a flag. It is a structured package that contains everything VERA needs to begin investigation without starting from scratch: a case summary, a specific falsifiable hypothesis, an ordered list of investigation priorities, extracted indicators, and preserved context from the enrichment TORA already queried. VERA does not re-triage. VERA builds on what TORA produced.

This is what the handoff looks like:

![TORA --> VERA Handoff](@/assets/images/EOTG_TORA_VERA.png)

TORA produces 3 components. The escalation package carries the case summary, indicators, and preserved context. The SOC context augmentation layer adds: endpoint data, network flows, log context, threat actor profile. Together, these form VERA's input. VERA does not receive a raw alert. VERA receives a structured case built from 2 sources: TORA's triage reasoning and the investigation context assembled around it.

The `+` in the diagram is the key design decision. TORA's output alone is not sufficient for T2 investigation. The investigation context alone, without TORA's reasoning, loses the triage logic that justified escalation in the first place. VERA needs both, and the input schema enforces that both are present before investigation begins.

The escalation package is not a summary. It is a structured handoff with specific fields that VERA's system prompt explicitly references.

## VERA does not start from zero

This is the structural argument against re-triage at T2. If VERA reads TORA's step 2 (false positive assessment) and sees that suppression was checked, the historical pattern was novel, and the IOC is 4 days old and actively current, VERA does not need to repeat that work. VERA starts from TORA's conclusion and extends the investigation into the layers TORA could not reach: process trees, network flows, authentication logs, threat actor TTPs.

VERA's investigation produces a different kind of output than TORA's triage:

![VERA Investigation](@/assets/images/EOTG_Investigation.png)

The investigation steps map to the evidence layers VERA queries in sequence. Intake and scope setting anchors the investigation to TORA's hypothesis before any telemetry is touched. Root cause is the central finding — what actually happened, how, and from what entry point. Disposition is the structured output: a verdict, a hypothesis resolution, and a root cause confidence level.

The vocabulary is different because the questions are different. TORA is answering: does this warrant investigation? VERA is answering: what actually happened, and what needs to be done about it?

## Why the schema drives everything

The escalation chain works because both agents operate against explicit schemas. TORA's system prompt names the exact fields VERA will consume. VERA's system prompt names the exact fields from TORA's output that anchor the investigation. There are no implicit contracts between agents.

This matters for 3 reasons.

First, it makes the handoff auditable. Every field TORA passes to VERA is documented. Every field VERA reads from TORA's output is documented. 

Second, it makes the chain improvable. NOVA observes both TORA's output and VERA's investigation record across all cases over time. The `nova_feed` block in each agent's output is structured specifically for NOVA's cross-case analysis. NOVA can track TORA's hypothesis refutation rate, the severity delta between T1 and T2, the frequency of missing fields by pipeline source. These patterns feed back into the design — into TORA's triage rules, VERA's investigation logic, the schemas themselves.

Third, it makes the chain extensible. ARIA, when deployed, will receive VERA's containment recommendations as structured input. The chain from TORA to VERA to ARIA is the same architecture repeated: each agent receives structured context from the previous one, extends it, and passes it forward.

The escalation chain is not a workflow. It is a context assembly pipeline. Each agent builds on the record the previous agent produced, and the schema is what makes that assembly coherent.

*— Jeny Teheran*
*Eyes on the Glass, March 30, 2026*
