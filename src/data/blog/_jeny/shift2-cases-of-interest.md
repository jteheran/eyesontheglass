---
title: "Shift 2: Cases of Interest"
author: JENY
pubDatetime: 2026-04-20T16:00:05Z
slug: shift2-cases-of-interest
featured: true
draft: false
tags:
  - case-of-interest
  - week-in-review
  - autonomous-soc
  - ai-infrastructure
sprint: sprint-1
shift: shift-2
section: shifts
description: "The precedence gap from Shift 1 held into Shift 2, but two cases that didn't diverge revealed something the first shift couldn't: the threshold isn't just about source count."
lang: en
---

# Shift 2 - Cases of Interest: 0004, 0012, 0014, 0016, 0018

Shift 2 ran a week after [Shift 1](/posts/shift1-cases-of-interest) with the same pipeline, same source IP, same structural context gap. The precedence gap held. Three more divergences, same mechanism. But two cases that stayed at INSUFFICIENT_CONTEXT revealed something Shift 1 couldn't on its own: the boundary between the two dispositions is multidimensional.

Among the alerts in the queue for Shift 2 were five DNS malicious lookup events from 10.10.6.200. Same missing fields (asset.criticality and asset.environment) unknown across all five. TORA held correctly on 0004 and 0014. It escalated 0012, 0016, and 0018.

## The two cases that held

0004 is the more interesting of the two held cases. It arrived on March 30 querying telemetry-cloud-api.com: 38 of 60 corroborating sources, Cobalt Strike, an active 36-day-old IOC. That's the same threat intel profile as the divergent cases in Shift 1. The response code was NXDOMAIN.

TORA held at 48% confidence. INSUFFICIENT_CONTEXT, as designed.

![TORA-20260330-0004](/assets/images/cases/shift2/tora-20260330-0004.svg)

Compare that directly to 0019 from Shift 1: same domain, same 38 sources, same missing fields. The only difference was the response code: NOERROR on 0019, NXDOMAIN on 0004. NOERROR pushed confidence to 72%, above the 60% threshold. NXDOMAIN held it at 48%, below it.

0014 held for the compounded reason: 12 sources and NXDOMAIN. Confidence 42%. Both signals pulling in the same direction, both below threshold.

![TORA-20260401-0014](/assets/images/cases/shift2/tora-20260401-0014.svg)

The precedence gap isn't a simple source count threshold. It's the combined weight of threat intel corroboration and DNS resolution outcome. Strong intel with NOERROR opens it. Strong intel with NXDOMAIN doesn't. Weak intel with NOERROR still does: case 0016 from this shift, 12 sources, escalated at 62%. The response code contributes enough confidence weight to tip the balance in either direction. That's not something TORA's system prompt specifies. It's emergent behavior from how the confidence scoring combines the two signals.

## 0012, 0016, 0018 — the pattern confirmed

The three divergences follow the same path as Shift 1.

- 0012 queried cdn-update-srv.net: 45 of 60 sources, Cobalt Strike, NOERROR. Confidence 62%, escalated.
- 0016 queried update-check-ms.net — 12 sources, Sliver, NOERROR. Confidence 62%, escalated. This is the lowest source count across all six divergent cases across both shifts. Twelve sources with an active resolution was enough to clear the threshold.
- 0018 queried telemetry-cloud-api.com — 38 sources, Cobalt Strike, NXDOMAIN. Confidence 67%, escalated. The NXDOMAIN response reduced urgency but didn't close the precedence gap — the source count was strong enough to carry it past 60% even without a confirmed resolution.

![TORA-20260401-0012](/assets/images/cases/shift2/tora-20260401-0012.svg)
![TORA-20260402-0016](/assets/images/cases/shift2/tora-20260402-0016.svg)
![TORA-20260402-0018](/assets/images/cases/shift2/tora-20260402-0018.svg)

Six divergences across two shifts. The prompt carried an unresolved design question from v1.0 through v1.1 unchanged. TORA resolved it consistently, transparently, and in the same direction every time.

The calibration run didn't expose a failure. It exposed an implicit policy derived from the abstraction that went in the design of SOC core functions. 

*— Jeny Teheran*
*Eyes on the Glass, April 20, 2026*
