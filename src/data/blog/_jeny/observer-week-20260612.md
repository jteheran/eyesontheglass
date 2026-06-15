---
title: "Observer: Shift 10 in Review"
author: JENY
pubDatetime: 2026-06-12T23:00:00Z
slug: observer-shift10-20260612
featured: false
draft: false
tags:
  - observer
  - week-in-review
  - harness-engineering
  - refactor
  - ransomware
  - c2
  - lateral-movement
sprint: phase1-sprint-5
shift: shift-10
section: shifts
description: "This week separated the shared harness underneath TORA and VERA, tools and workflows, from the skills and prompts that make each agent who they are. The same week ran Shift 10, the heaviest queue yet: thirteen escalations, thirteen confirmed compromises, environment-wide lateral movement, and the first shift on the rebuilt harness, with zero parse failures on both sides."
lang: en
---

## What Happened This Week

This week's work was about the harness underneath both agents: the tools, the workflows, and where they end and an agent's own reasoning begins. The same week, Shift 10 ran, and it turned out to be the heaviest queue the pipeline has processed. Thirty alerts, thirteen escalations, and every one of those thirteen cases resolved to `ESCALATE_TO_ARIA` with `CONFIRMED` root cause confidence. I didn't plan for these two things to land in the same week, but it turned out to be a useful test, because the harness work stopped being theoretical the moment it had to carry the heaviest shift to date.

## The Harness: Tools, Workflows, Skills, Prompts, Agents

A tool is the smallest unit of work: read a record, write one, produce a report, score a finding. A tool doesn't know or care which tier is calling it. A workflow is a curated sequence of tools assembled for a specific job. Triage is a workflow. Investigation is a workflow. The job belongs to the workflow, not to whichever agent happens to run it.

Skills and prompts are where the two agents actually diverge. A skill is a reasoning pattern: how to read a timeline, how to weigh a competing signal, how to recognize insufficient context instead of ambiguous context. A prompt is the versioned instruction set that tells an agent how to apply its skills, and it can change, get sharper, get corrected, without touching anything underneath it. TORA's queue-level precedence and forced-escalation reasoning are skills. VERA's hypothesis testing and blast-radius reasoning are skills. They're different skills because triage and investigation are different jobs, even when both are built on the same tools through the same kind of workflow.

An agent, then, is a wrapper: a prompt, a set of skills, and access to a workflow and the tools it calls. TORA and VERA are the same shape with different contents. Neither one owns a tool. Neither one is the workflow. The agent is the composition.

Before this week, that composition was tangled. Tools, workflows, skills, and prompts for each agent lived together in the same place, which meant a piece of logic that should have been one shared tool could end up duplicated, one slightly different copy per agent, with nothing forcing the two to agree. This week separated the genuinely shared layer underneath, tools and workflows, from the genuinely agent-specific layer on top, skills and prompts. The first is infrastructure. The second is identity. Writing reusable code means knowing the difference and not collapsing one into the other.

## The Shift the Harness Carried

TORA escalated all thirteen cases this shift. The `okta-verify.co` campaign produced two confirmed credential submissions, `c.wardlaw` and `m.reyes`, and a BlackCat C2 beacon showed up on the same production jump server where `c.wardlaw` had submitted credentials, with no confirmed access vector at all.

VERA took those thirteen cases and confirmed root cause on every one of them. Twelve of TORA's thirteen hypotheses needed refinement, from delivery-stage or pre-compromise framing into active post-exploitation findings, surfaced from endpoint, network, and authentication telemetry that TORA's alert-only package hadn't yet correlated. The only hypothesis that resolved `CONFIRMED` rather than `REFINED` was the one case where TORA had two days of prior behavioral history on the same asset to work from. Lateral movement is now confirmed environment-wide, the domain controller itself is running a process parented to `lsass.exe`, and the confirmed blast radius is twenty-one or more assets. That's not a triage failure. It's a detection-sequencing gap that recurs across twelve of the thirteen cases this shift, exactly the kind of cross-case pattern NOVA exists to catch.

## The Harness Is Supposed to Be Invisible

Both agents report zero parse failures this shift, the cleanest possible number on that metric, on the first shift to run on the rebuilt harness. I do not want to overclaim a direct line from one week's structural work to one shift's numbers, and I haven't pulled the audit output yet, so I can't say whether the audits read cleaner the way I expect them to. What I can say is that when a piece of shared reasoning support is genuinely shared instead of duplicated, two agents' outputs can't quietly drift apart in format the way they could when each agent kept its own copy. The next time something changes in how a shift gets reported, there's one place to change it, not two that have to be remembered and kept in sync by hand.

I went into this week expecting the harness work to be the quiet half of the story and the shift to be the noisy half. A thirteen-case, hundred-percent-confirmed, environment-wide compromise is exactly the kind of shift where I don't want to be debugging whether TORA's and VERA's outputs agree on a format. This week, mostly, they didn't have to. That's the whole point of building the harness first.


*Jeny Teheran — Observer*
*Eyes on the Glass | eyesontheglass.ai*
*Shift 10 | Sprint 5*
