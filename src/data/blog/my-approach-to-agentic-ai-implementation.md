---
title: My Approach to Agentic AI Implementation
author: Jeny
pubDatetime: 2026-04-14T12:00:05Z
slug: my-approach-agentic-ai-implementation
featured: true
draft: false
tags:
  - autonomous-soc
  - ai-agents
  - security-operations
  - escalation
  - eyes-on-the-glass
description: My account of building an agentic SOC from scratch. What the calibration run Sprint revealed and how those findings carried out in Sprint 2.
lang: en
---
# My approach to agentic AI implementation

Building an agentic AI system is a discovery process. When I started running this experiment, I had a brief charter for EOTG: an autonomous SOC with a hierarchical multi-agent system. Every architectural decision in EOTG came from what the system revealed about itself in operation and building the components one at a time. Discovering what each agent needs to achieve its own goal and to contribute to EOTG's shared operational goal sparks my curiosity on every shift.

## Organizational design came first

Before writing any code, I made a structural decision: a tiered SOC modeled on how analysts actually develop. TORA handles triage at T1, VERA handles investigation at T2. That separation of duties wasn't only about efficiency. A tiered structure lets me observe each function independently before connecting them with [traceability and auditability](/posts/phase-1-context-auditability-synthetic-inputs) at the core of my experiment. 

## Sprint 1, V1: my controlled baseline, deliberately limited

Sprint 1 was a calibration run. TORA and VERA's first versions were heuristic single-prompt agents: one API call per alert, a system prompt encoding all triage logic similar to a playbook for a specific alert type, one structured JSON response out.

This wasn't the ceiling. It was the foundation. Auditability and traceability had to exist before any autonomy could be introduced. I needed a stable baseline to understand what correct behavior looked like before I could design anything that deviated from it. I also needed to see what the agents actually did before I could decide what tools they should have. You cannot design good retrieval until you know what needs to be retrieved.

## What V1 revealed: a three-way tension

After two shifts, 50 alerts processed and 31 cases escalated, V1 didn't just reveal that the agents needed more context. It revealed that the Autonomous SOC context is three separate problems with three different owners and constraints:

1. The first is within-shift context: what the agent needs right now to reason across cases in the same shift. This resets each shift and is owned by the agent.

2. The second is agent memory: what the agent needs to retain about its own reasoning patterns across shifts. This is not the threat landscape, that resets and changes so fast that tracking and modeling for that is out of scope for this experiment. The agent's model of itself: where it has historically been confident, where it has been soft, what kinds of cases have exposed gaps in its reasoning. This compounds over time.

3. The third is SOC context: what the organization needs to accumulate and evolve. Escalation packages, knowledge base, detection engineering feedback, business context. This belongs to the SOC as a whole, not to any individual agent, and it outlives any single shift.

Most writing about agentic AI collapses these three into one. "Give the agent memory" is the common advice. But in my experiment, each layer has a different owner, a different lifespan, and a different consumer. Conflating them doesn't simplify the problem, it will likely create architectural debt that will surface later in this experiment. 

This tension isn't unique to Agentic SOCs. SOC analysts start working from playbooks, handling each alert in isolation, treating every ticket as a self-contained problem. Growing as an analyst means learning to expand your context window. Recognizing that the domain in alert seven is the same one that appeared in alert two. Connecting a lateral movement event to a failed authentication from three hours earlier. Building a picture of the shift, not just a queue of individual cases.

## V2 is being built in response to what V1 exposed

Sprint 2 introduced agentic loops with tool dispatch. Each agent was given a specific set of tools scoped to their own function. TORA and VERA now decide when to call each tool to serve their own purpose within a shift.

This shift: from pre-assembled input schemas to lean inputs with agent-driven retrieval is the direct answer to what V1 exposed. Tools are the interface to within-shift context. The agent pulls what it needs when it needs it. The right tokens at the right time to the right agent.

This matters because context isn't free. As [Anthropic's context engineering research](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) and [Chroma's work on context rot](https://www.trychroma.com/research/context-rot) both show, LLMs have an attention budget that depletes as context grows. Pre-loading everything degrades reasoning quality (the model's ability to recall and reason over information decreases as the number of tokens increases). An agent that retrieves context on demand, guided by its own judgment about what's relevant, keeps its attention focused on the signal that matters for the case in front of it.

The separation of tasks across agents serves the same principle. TORA doesn't need to know how to do root cause analysis. VERA doesn't need to see every alert TORA closed. Each agent's context window stays focused and high-signal because the architecture enforces that discipline.

## Where Phase 1 actually stands

Agent memory is actively being built. Every agent records a shift state and checks it during every shift. That's the first stab at the problem, not the final answer. The infrastructure is in place; the question of what agents should carry about themselves across shifts and how that self-knowledge should change how they reason is the active design problem in Phase 1.

SOC context as a living system: how the organization learns from what the agents produce, how detection engineering improves, how the knowledge base compounds is likely to be the design problem for Phase 2. Every shift reveals something new. That's what keeps me building.

---

*References*

1. [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic
2. [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic
3. [Context rot](https://www.trychroma.com/research/context-rot) — Chroma

*— Jeny Teheran, Security Architect*
*Eyes on the Glass, April 14, 2026*