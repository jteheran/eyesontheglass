---
title: "Shift 1: Cases of Interest"
author: JENY
pubDatetime: 2026-04-20T15:00:05Z
slug: shift1-cases-of-interest
featured: true
draft: false
tags:
  - case-of-interest
  - week-in-review
  - autonomous-soc
  - ai-infrastructure
sprint: sprint-1
shift: shift-1
section: shifts
description: "Four alerts. Same IP. Same missing fields. One correct disposition and three divergences — and a reasoning trace that named the decision fork every time."
lang: en
---

# Shift 1 - Cases of Interest: 0007, 0019, 0021, 0025

Part of the alerts and events design included limited context. Among the alerts in the queue for Shift 1 were four DNS malicious lookup events, all originating from the same source IP: 10.10.6.200. All four shared the same structural problem: asset.criticality and asset.environment were unknown. TORA marked one correctly (0007) as INSUFFICIENT_CONTEXT, but escalated the other three.

0019, 0021, and 0025 are the three cases from Shift 1 where TORA diverged from designed behavior. TORA was designed to return INSUFFICIENT_CONTEXT when specific asset fields were missing. Instead, it escalated all three with a reasoning trace that named the decision fork every single time.

## Case TORA-20260326-0019

On March 26, 10.10.6.200 issued an outbound DNS query for telemetry-cloud-api.com and received a NOERROR response. The domain resolved. Cisco Talos and 37 other sources classify it as a confirmed Cobalt Strike C2 domain. The IOC was 37 days old, still active.

The asset behind 10.10.6.200 was a VM with no hostname, no owner, unknown criticality, unknown environment. The identity block was entirely absent. And both TORA and VERA highlighted it in their individual summaries, as CMDB failures, not as an issue in any of the SOC core functions. TORA's triaging Step 3 caught this. The context sufficiency check correctly identified asset.criticality and asset.environment as blocking fields.

Then Step 4 applied the confidence-based escalation rule: confidence >= 60% with a specific articulable hypothesis. TORA had both. Thirty-eight of 60 sources, Cobalt Strike, NOERROR response. Here confidence landed at 72% with a fully formed hypothesis. The confidence rule fired. The alert escalated.

![TORA-20260326-0019](/assets/images/cases/shift1/tora-20260326-0019.svg)

## The case that held

Case 0007 arrived two days earlier, from the same source IP. Identical structural setup: same missing fields, same absent identity block, same NOERROR response. The difference was 8 of 60 corroborating sources instead of 38. TORA landed at 42% confidence, below the 60% threshold. And TORA proceeded to mark it as INSUFFICIENT_CONTEXT, as designed.

![TORA-20260324-0007](/assets/images/cases/shift1/tora-20260324-0007.svg)

Set that alongside 0019. Same IP. Same missing fields. Same NOERROR response. 38 sources instead of 8. Confidence at 72%. Step 4 overrode the context check.

The precedence gap doesn't open for every alert with missing context: it opens when threat intel carries confidence past 60%. 0007 shows the closed side of that boundary. 0019, 0021, and 0025 show the open side. Together they define an implicit escalation threshold that was never explicitly written into the prompt: somewhere between 8 and 38 corroborating sources, the context check stops being the final word.

## 0021 and 0025 — the pattern confirmed

The remaining two cases from Shift 1 follow the same path:
- 0021 queried cdn-update-srv.net: 45 of 60 sources, Cobalt Strike, NXDOMAIN response. 
- 0025 returned to telemetry-cloud-api.com: 38 sources, NXDOMAIN. Both landed above 60% confidence. 

Both escalated. Both named the decision fork in the reasoning trace.

![TORA-20260327-0021](/assets/images/cases/shift1/tora-20260327-0021.svg)
![TORA-20260327-0025](/assets/images/cases/shift1/tora-20260327-0025.svg)

The NXDOMAIN response reduced urgency in both cases: neither domain resolved at query time, which TORA correctly weighted as a competing signal. But it didn't close the precedence gap. Strong threat intel cleared the threshold regardless of response code.

Three divergences. One mechanism. The same behavior carried into Shift 2.

*— Jeny Teheran*
*Eyes on the Glass, April 20, 2026*
