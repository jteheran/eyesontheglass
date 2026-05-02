---
title: "Shift 6: Separation of Duties"
author: JENY
pubDatetime: 2026-05-02T18:00:00Z
slug: observer-week-20260501
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
shift: shift-6
section: shifts
description: "The separation of duties between detection engineering, agent reasoning, and the SOC fabric is becoming clearer with every run."
lang: en
---

The pipeline ran six VERA investigations this shift, all confirmed, all ESCALATE_TO_ARIA at immediate urgency. On paper, that's a clean shift. Under the surface, three things happened that are more interesting than the verdicts.

## Fast flux and the limits of reputation-based reasoning

`TORA-20260428-0010` was the only `dns_fast_flux` case in the queue this shift. TORA escalated it correctly: 36 unique IPs, 32 ASNs, a TTL of 58 seconds, behavioral signal that doesn't need a VirusTotal score to be alarming. But when VERA picked it up, netflow was absent. No outbound connection record to correlate against the rotating IP pool. No data volume. No confirmation of an active channel. VERA reached ESCALATE_TO_ARIA on endpoint evidence alone, which was enough to hold the verdict. But the investigation depth was capped at exactly the point where fast flux becomes meaningful: whether the domain was actively serving a payload or just rotating infrastructure for future use.

That gap is not a VERA problem. It's a detection engineering problem. Fast flux generates behavioral signal at the DNS layer but the relevant confirmation data lives in netflow. If netflow collection has a coverage gap on the same segment where the alert fired, the investigation will always hit a ceiling at the same point. Adding `dns_fast_flux` as an alert subtype exposed a dependency the pipeline didn't have to surface with static C2 domains: reputation confirmation and behavioral confirmation require different telemetry sources, and when one is missing, the agent can reason correctly and still not close the loop.

This is the argument for designing enrichment before reasoning, not during it. TORA shouldn't have to infer whether netflow is present mid-triage. The alert should arrive at TORA already tagged with what telemetry is and isn't available,  that's a detection engineering responsibility, not an agent responsibility.

## What each layer owns

Three shifts in, the separation of duties is coming into focus more clearly. The detection engineering layer owns enrichment: asset criticality, identity context, threat intel, telemetry availability. When that layer has gaps, the agent is intentionally designed not to compensate. It signals the gap and stops. TORA's INSUFFICIENT_CONTEXT disposition is the correct expression of that boundary. The five cases from `10.10.7.55` this shift: same IP, same CMDB hole, five consecutive alerts, are a detection engineering backlog item, not a triage failure.

The agent layer owns reasoning within whatever context it receives. TORA triages. VERA investigates. Neither should be in the business of enriching what the pipeline didn't provide. In a real SOC, that correction happens mid-investigation with no bandwidth to spare. In this pipeline, it becomes a calibration signal for detection engineering. When VERA identified `alee` as the actual executing account on `srv-jump-01` rather than `svc-backup` (the account TORA flagged from session presence) that's VERA doing her job correctly at T2. It's also a signal that TORA's identity enrichment logic is consuming session-level context rather than process-level context. That's a prompt calibration problem, but it points at something the detection pipeline could solve upstream: if process-level user attribution were in the alert, TORA would reason from the right identity axis without VERA having to correct it.

The SOC fabric layer — NOVA, case management, the feedback loop — owns the view across time and across agents. No individual shift post captures what NOVA will eventually see: whether `10.10.7.55` has been a recurring blind spot across sprints, whether the world-writable staging path pattern VERA flagged across five of six cases this shift is a persistent campaign signature or a coincidence, whether the IDS/netflow discrepancy is getting worse or better. That's not a failure of the agents. It's the reason NOVA exists.

## The IDS/netflow discrepancy is still there

VERA flagged it in two cases this shift: `VERA-20260427-0002` (`fonts-static-cdn.net`, NOERROR in IDS, NXDOMAIN in netflow) and `VERA-20260429-0014` (`api-diag-collector.io`, TXT NOERROR in IDS, A NXDOMAIN in netflow). Shift 5 had it in six cases. Shift 4 before that. The pattern is not resolving itself.

The operational consequence is specific: NOERROR is load-bearing in TORA's severity framing. A NOERROR response on a malicious domain is the difference between "this host attempted to contact C2" and "this host successfully contacted C2." TORA uses that distinction to weight confidence and drive severity. If the IDS sensor is systematically recording NOERROR while the raw DNS log records NXDOMAIN, TORA's active-C2 claims are overcalibrated, not occasionally, but structurally, every time the discrepancy appears.

VERA has now surfaced this in three consecutive shifts across multiple cases. The data is there. This is a detection engineering problem that requires a detection engineering answer: which source is authoritative, why the two records diverge, and whether the IDS sensor is reading pre-resolution or cached responses. Until that's resolved, every NOERROR-based confidence assessment in the pipeline carries an unquantified error margin. NOVA has it. It needs to stay at the top of the queue.

*— Jeny Teheran*
*Eyes on the Glass, May 2, 2026*
