---
title: "Why DNS Alerts and Why Auditability Is Not Optional"
author: JENY
pubDatetime: 2026-03-31T16:00:00Z
slug: dns-alerts-auditability
featured: false
draft: true
tags:
  - autonomous-soc
  - detection-engineering
  - dns
  - auditability
  - tora
  - vera
  - eyes-on-the-glass
description: "DNS lookups are the first observable network artifact of a compromise and one of the noisiest alert types in a SOC queue. Here's why I started there, and why structured auditability is what makes the difference between a pipeline that produces output and one you can trust."
lang: en
---

## Why DNS

DNS alerts are one of the most common alert types in a SOC queue and one of the most frequently misread. Before you can evaluate whether an agent is triaging them correctly, you need to understand what the telemetry is actually capturing.

When a perimeter IDS fires a "DNS query to known malicious domain" alert, it has observed a DNS query originating from inside your network directed at a domain that matches a threat intelligence blocklist. The alert does not tell you whether the connection was successful, whether the host is compromised or just browsing, whether the malicious classification is current and accurate, or what the intent of the query was. It is a correlation hit between observed behavior and a threat intelligence signal. The quality of that correlation depends entirely on the quality of both inputs: the telemetry and the intel.

DNS is the phonebook lookup before the phone call. DNS alerts can overwhelm a triaging queue. DNS is used for everything: legitimate and malicious activity. When malware needs to contact its C2 infrastructure, it almost always starts with a DNS query to resolve the C2 domain to an IP address. The same is true for malware distribution, phishing redirects, data exfiltration over DNS tunneling, and periodic C2 beaconing. The DNS query is often the earliest observable network artifact of a compromise. It is also one of the noisiest alert types in the queue: again, DNS is used for everything, reputation data ages out, and legitimate software sometimes queries infrastructure that was previously malicious.

This noise is exactly why I started here.

A DNS alert needs enrichment to be useful for autonomous triage. The same domain query from a low-criticality development workstation versus a server with a trust relationship to your domain controller is categorically different in risk. Without asset context, TORA cannot reason about that difference. Without threat intel depth: source count, IOC age, associated malware family, response code, TORA cannot assess whether the flagged domain represents an active threat or a stale indicator. Without identity context, TORA cannot evaluate whether the session is anomalous.

DNS alerts have a high context dependency in this environment. They require the agent to synthesize across multiple enrichment layers to produce a defensible triage decision. If TORA can reason correctly over DNS alerts with full context, sparse context, and missing context, the triage logic is working. If TORA closes an alert because the DNS response was `NXDOMAIN` without considering that `NXDOMAIN` could indicate a sinkholed C2 domain, that's a reasoning failure I need to see in a controlled environment before I see it in a live one.

DNS was the right starting point because it is hard enough to be a real test and common enough that the results are generalizable.

## Why auditability is not optional

Every agent in the Eyes on the Glass pipeline produces structured output. TORA produces a triage decision. VERA produces an investigation record. That structure is intentional: it makes agent reasoning auditable in a way that informal or narrative output never could be.

But structured output doesn't guarantee correct output. An agent can produce a perfectly valid JSON object with internally consistent field values and still reason poorly. It can comply with the schema and contradict its own evidence. It can generate calibration signals that don't track with what it actually found. Structured output is a necessary condition for auditability. It is not sufficient.

This is why I built a 3-layer audit on top of every agent's output.

**Layer 1 is schema compliance.** Did the agent produce all required fields with valid values? This is the minimum — that the output can be consumed by downstream systems without breaking. Schema violations are tracked across shifts. A single violation is variance. The same violation recurring across multiple cases is a prompt calibration issue.

**Layer 2 is internal consistency.** Does the output make logical sense given the agent's own findings? This is where reasoning quality becomes visible. An agent that confirms C2 activity and closes the case is not a schema problem — it's a contradiction. An agent that assesses `PROBABLE` root cause confidence and issues a `CLOSED` verdict has decided the case is resolved without the evidence to support it. These contradictions don't break the pipeline. They reveal that the agent's reasoning and its disposition are not aligned. Layer 2 catches what Layer 1 misses.

**Layer 3 is calibration.** What does VERA's investigation record reveal about TORA's triage quality? Every case VERA investigates is a case TORA escalated. The relationship between what TORA hypothesized and what VERA found is the primary mechanism for improving TORA's triage rules over time. CONFIRMED means TORA's hypothesis was correct. REFINED means directionally correct but the details changed. REFUTED means TORA was wrong. The refutation rate, tracked across shifts, is the most important signal for TORA's rule design.

These 3 questions are different and require different checks. And I need more data collected across multiple shifts to start building an answer. Now, the audit layer impacts schemas and prompts directly, but it also assembles progressive context. 

## Progressive context assembly

What the audit is actually measuring maps to a design principle I want to name explicitly: progressive context assembly. Each agent in the chain builds on the context the previous one produced. By the time a case reaches VERA, the context is richer than the raw alert. TORA adds a severity classification, a false positive assessment, a specific hypothesis, and a curated set of indicators. By the time NOVA sees it, it's a structured case record with investigation findings, timeline reconstruction, and containment recommendations.

The quality of the final output depends entirely on how well context is preserved and curated at each handoff. This is the design principle that governs every decision about TORA's output schema, VERA's input expectations, and NOVA's data model. Not "what does each agent do" but "what does each agent need, and what does it leave behind for the next one."

The DNS alert TORA receives has a `response_code` field. TORA documents a reasoning trace: `NOERROR` versus `NXDOMAIN`. VERA receives that reasoning trace as part of the escalation package and can assess whether TORA's interpretation was correct given the netflow evidence. If VERA's investigation finds that the IDS recorded `NOERROR` but the netflow DNS history recorded `NXDOMAIN` for the same query, that discrepancy is documented in VERA's `nova_feed.observation_note`. NOVA sees it across all cases where it appeared.

That chain from raw DNS alert --> TORA's interpretation --> VERA's cross-layer validation --> NOVA's pattern analysis is what progressive context assembly looks like in practice. The audit is what verifies it's working at every step.

*— Jeny Teheran*
*Eyes on the Glass, March 30, 2026*
