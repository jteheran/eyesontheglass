---
title: "Why DNS Alerts are the first scenario"
author: JENY
pubDatetime: 2026-04-08T12:00:05Z
slug: triaging-investigating-dns-alerts
featured: false
draft: false
tags:
  - autonomous-soc
  - detection-engineering
  - dns
  - tora
  - vera
  - eyes-on-the-glass
section: soc
description: "DNS lookups are the first observable network artifact of a compromise and one of the noisiest alert types in a SOC queue. Here's why I started there."
lang: en
---

## Why DNS alerts
DNS alerts flood every SOC queue because DNS underpins everything: browsing, beaconing, exfiltration, command-and-control. It's also the highest-volume alert type in the queue, noisy by nature, but rich with signal when detection rules are engineered appropriately. That's exactly why I started here.

A DNS alert needs enrichment to be useful for autonomous triaging. Bundled domain queries don't carry enough context for a sound triaging decision. The same domain query from a low-criticality development workstation versus a server with a trust relationship to a domain controller is categorically different in risk. In this experiment, the SOC data pipelines provide enriched context around asset, identity, and threat intel.

## Triaging from TORA's eyes

A DNS alert alone is not sufficient for a disposition decision. TORA's triaging sequence includes questions such as:

1. **The response code:** Did it resolve?
2. **The source host's context:** What kind of asset is this? What environment? How critical?
3. **The user context:** Who was logged in? What's their role? Any recent anomalies?
4. **The threat intel depth:** How many sources? How recent? What malware family?
5. **Historical context:** Has this domain been seen before across the environment? Has this asset fired alerts recently?

## Why DNS alerts are noisy

DNS reputation lists are maintained by humans and automated systems. They are not always right, and they are not always current. Common sources of false positives:

- **CDN and hosting reuse:** A domain previously used for malware distribution gets abandoned and the IP is reused by a legitimate CDN. The domain stays on lists longer than the infrastructure stays malicious.
- **Security tooling:** Endpoint agents, vulnerability scanners, and sandboxes sometimes query threat intelligence feeds directly, using the malicious domain as a lookup key. The query looks malicious; it's actually benign.
- **Stale campaigns:** Historical phishing or malware campaigns whose infrastructure is long dead but whose domains remain on blocklists.
- **Overly aggressive single-vendor classification:** Some vendors flag domains with minimal evidence. Low source counts (1-3 sources) deserve skepticism.

## Investigation from VERA's eyes

When TORA escalates a DNS alert, VERA inherits the case with a different job. TORA answered: does this deserve attention? VERA answers: what actually happened?

VERA's investigation of a DNS alert goes deeper than the query itself. A successful resolution to a known C2 domain with outbound traffic volume is a different finding than an NXDOMAIN response on the same domain. VERA synthesizes behavioral evidence that comes from the context augmentation layer: process execution context, lateral movement indicators, timeline reconstruction, malware family TTPs. Then VERA produces a confidence-weighted assessment of what the host was doing and how serious it is.

**This is where the first architectural tension surfaces.** TORA produces a priority: a queue management signal driven by asset criticality, threat intel quality, and context sufficiency. VERA produces an urgency: a conclusions signal driven by what investigation actually found. These are not the same axis. A TORA HIGH priority escalation does not guarantee a VERA HIGH urgency finding. VERA might determine the threat intel was stale and the behavior was benign. Or TORA might escalate at MEDIUM and VERA surfaces lateral movement indicators that weren't visible at triage depth.

The delta between TORA's priority and VERA's urgency is a data point. Tracked across shifts, it will tell whether the detection rules are over-triggering, whether the alert context TORA receives is missing something structural, or whether the triage thresholds are correctly set. DNS alerts (noisy by nature, high context-dependency, frequent false positives) are exactly the right scenario to make that delta visible early.

## The response code for triaging

When a perimeter IDS fires a "DNS query to known malicious domain" alert, it has observed a DNS query originating from inside your network directed at a domain that matches a threat intelligence blocklist. The alert does not tell you whether the connection was successful, whether the host is compromised or just browsing, whether the malicious classification is current and accurate, or what the intent of the query was. It is a correlation hit between observed behavior and a threat intelligence signal. The quality of that correlation depends entirely on the quality of both inputs: the telemetry and the intel.

Two DNS queries can look identical on the wire and represent completely different situations depending on the DNS response code. DNS alerts have a high context dependency in this experiment. They require the agent to synthesize across multiple enrichment layers to produce a defensible triage decision. If TORA can reason correctly over DNS alerts with full context, sparse context, and missing context, the triage logic is working. If TORA closes an alert because the DNS response was `NXDOMAIN` without considering that `NXDOMAIN` could indicate a sinkholed C2 domain, that's a reasoning failure I need to see in a controlled environment before I see it in a live one. That's also exactly what VERA's investigation layer is designed to catch when TORA's triage depth can't.


*Jeny Teheran*
*Eyes on the Glass, April 8, 2026*
