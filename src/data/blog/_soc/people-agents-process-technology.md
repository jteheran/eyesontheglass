---
title: People, Agents, Process and Technology
author: Jeny
pubDatetime: 2026-05-19T12:00:05Z
slug: people-agents-process-technology
featured: true
draft: false
tags:
  - autonomous-soc
  - ai-agents
  - security-operations
  - eyes-on-the-glass
section: soc
description: My account of what I found so far at Phase 1 midpoint. What I've learned after eight shifts and what comes next for the remainder of Phase 1. 
lang: en
---
Eight weeks ago I published the first observer post for Eyes on the Glass. TORA had just completed its first shift. VERA had just finished investigating every case TORA escalated. The pipeline had already produced its first [finding](shift1-cases-of-interest): an unidentified VM at `10.10.6.200` generating C2 DNS queries across three separate days with no hostname, no owner, no criticality. TORA and VERA kept pointing at CMDB failures as a structural problem across shifts. In response, I redesigned the alert schema around three axes: network, asset, and identity.

My observer posts confirmed my initial argument: AI in the SOC exposes foundational gaps faster than any audit because it keeps running into them and logging what it can't reason about.

After Shift 4, I [wrote](my-approach-agentic-ai-implementation) that the autonomous SOC context is three separate problems:

1. Within-shift context resets each shift and stays owned by the agent.
2. Agent memory compounds across shifts to sharpen reasoning over time, also owned by the agent.
3. SOC context is the organizational knowledge base that informs security posture and matures processes. In practice, maintaining SOC context is owned by the SOC manager. It always has been.

The pipeline evolved too. Shifts [1](/shifts/shift-1/) through [6](/shifts/shift-6/) ran on DNS alerts alone. [Shift 7](/shifts/shift-7/) introduced phishing email alerts for the first time, and the escalation chain between TORA and VERA stripped the email context at handoff. VERA investigated every phishing case without knowing it was a phishing case. The agents adapted. The pipeline hadn't.
Conflating them surfaces architectural debt when AI gets in. It is operational stress.

## Process Debt at Phase1 Midpoint

By operational severity, [Shift 8](/shifts/shift-8/) was the most significant shift EOTG has run. Confirmed Cobalt Strike on a production Active Directory server. Lateral movement to three domain controllers. A krbtgt rotation requirement. Twelve hosts flagged for isolation. The agents performed. TORA escalated on the right signals. VERA found pre-existing compromise behind twelve phishing alerts and named lateral movement to domain controllers before containment actions were scoped. The verdicts were accurate. The audit trail was clean. Artifacts held up for auditability and traceability. Neither agent asked how long.

srv-jump-01.corp.local was the most significant asset in the shift. VERA's finding was unambiguous: a fully staged malware implant was already running when the phishing link was clicked. The credential submission wasn't the intrusion. It was an event on a host that was already gone. VERA reconstructed pre-delivery process timelines across four separate cases. The capability was there. But no process required the next question during incident response: when you find pre-existing compromise behind a triage event, establish origin and dwell time before you move to containment. ARIA received an isolation list. The forensic timeline went unbuilt.

That's not an agent capability problem. Agents answer the questions the process defines. If the process doesn't define the right questions, agents answer something adjacent. 

Agentic AI doesn't fix process debt any more than prior automation waves did. It amplifies what's already there.

## Automation in Security Operations

I've built and led security operations teams. The pattern I watched repeat across modernization programs isn't unique to AI: a team adopts the technology because the problem is real. Tickets close faster. Metrics improve. At some point someone notices the security posture hasn't improved, because the automation was running on top of processes that were never right to begin with.

Agentic AI is different from prior automation in one way that matters: the agents reason, not just execute. In the last shift, VERA didn't close a ticket on `CASE-20260512-0008`. The investigation contradicted the original alert framing and named an entirely different threat actor account as the execution identity. That's judgment. But judgment still operates inside a process frame. The questions in scope were good questions. They weren't the complete questions.

A mature process defines what investigation completeness means for a given alert type. What is active. When it started. What the likely entry vector was. Whether the blast radius extends further than the telemetry shows. Those questions don't come from better prompting. They come from playbooks: documented decisions that tell the agent this phishing case with pre-existing compromise is not a phishing case anymore. Without that foundation, the queue clears, the verdicts are defensible, and the dwell time on the compromised host remains unknown.

## The second half of Phase 1
NOVA deploys next. NOVA's job is cross-case analysis: the feedback loop that neither TORA nor VERA can close from inside a single shift or a single investigation. The IDS/netflow discrepancy. The recurring prior-alert closure pattern. The domains that bypassed indicator sets across multiple shifts. NOVA inherits all of it.

But what NOVA surfaces only has operational value if there's a process to receive it. A pattern finding about prior alert closures preceding confirmed compromise is useful if there's a decision framework for updating alert handling. A detection engineering gap is useful if there's a defined path from NOVA's observation to a changed procedure. The feedback loop NOVA closes is a technical one. The loop that turns a finding into a changed process is a human one.

That loop has to be built first. That's what the next eight shifts are for.


*— Jeny Teheran, Security Leader*
*Eyes on the Glass, May 19, 2026*