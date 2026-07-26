// ── Phases ────────────────────────────────────────────────────────────────────

export interface PhaseDef {
  num: number;
  label: string;
  startDate: string;
  endDate: string | null; // null = ongoing
}

export const PHASES: PhaseDef[] = [
  {
    num: 1,
    label: "Phase 1",
    startDate: "2026-03-23T00:00:00Z",
    endDate: null,
  },
];

export const PHASES_BY_NUM: Record<number, PhaseDef> = Object.fromEntries(
  PHASES.map(p => [p.num, p])
);

// ── Sprints ───────────────────────────────────────────────────────────────────

export interface SprintDef {
  id: string;        // globally unique: "phase1-sprint-1", "phase1-sprint-2", "phase2-sprint-1"
  num: number;       // resets per phase: 1, 2, 3...
  phase: number;
  label: string;     // "Sprint 1"
  startDate: string;
  endDate: string;
}

export const SPRINTS: SprintDef[] = [
  {
    id: "phase1-sprint-1",
    num: 1,
    phase: 1,
    label: "Sprint 1",
    startDate: "2026-03-23T00:00:00Z",
    endDate: "2026-04-03T23:59:59Z",
  },
  {
    id: "phase1-sprint-2",
    num: 2,
    phase: 1,
    label: "Sprint 2",
    startDate: "2026-04-06T00:00:00Z",
    endDate: "2026-04-17T23:59:59Z",
  },
  {
    id: "phase1-sprint-3",
    num: 3,
    phase: 1,
    label: "Sprint 3",
    startDate: "2026-04-20T00:00:00Z",
    endDate: "2026-05-03T23:59:59Z",
  },
  {
    id: "phase1-sprint-4",
    num: 4,
    phase: 1,
    label: "Sprint 4",
    startDate: "2026-05-04T00:00:00Z",
    endDate: "2026-05-17T23:59:59Z",
  },
  {
    id: "phase1-sprint-5",
    num: 5,
    phase: 1,
    label: "Sprint 5",
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-06-12T23:59:59Z",
  },
  {
    id: "phase1-sprint-6",
    num: 6,
    phase: 1,
    label: "Sprint 6",
    startDate: "2026-06-15T00:00:00Z",
    endDate: "2026-06-26T23:59:59Z",
  },
  {
    id: "phase1-sprint-7",
    num: 7,
    phase: 1,
    label: "Sprint 7",
    startDate: "2026-06-29T00:00:00Z",
    endDate: "2026-07-10T23:59:59Z",
  },
  {
    id: "phase1-sprint-8",
    num: 8,
    phase: 1,
    label: "Sprint 8",
    startDate: "2026-07-13T00:00:00Z",
    endDate: "2026-07-24T23:59:59Z",
  },
];

export const SPRINTS_BY_ID: Record<string, SprintDef> = Object.fromEntries(
  SPRINTS.map(s => [s.id, s])
);

// ── Shifts ────────────────────────────────────────────────────────────────────

export interface ShiftStats {
  // TORA
  alertsTotal: number;
  alertsEscalated: number;
  alertsClosed: number;
  alertsInsufficientContext: number;
  alertsUnknown: number,
  // VERA
  casesTotal: number;
  casesEscalatedToAria: number;
  casesClosed: number;
  casesHeld: number;
  casesUnknown: number;
  // NOTE: NOVA has no entry here — its findings are qualitative (hypothesis
  // accuracy notes, pipeline gaps, open questions), not flat counters, and
  // live in stats/nova.json instead. See ShiftDef.agents for NOVA participation.
}

export interface ShiftDef {
  id: string;        // global, never resets: "shift-1", "shift-2"...
  title: string;
  startDate: string;
  endDate: string;
  sprint: string;    // ref to SprintDef.id
  sprintLabel: string;
  agents: string[]; // agent names that ran this shift, e.g. ["TORA", "VERA"]
  stats: ShiftStats | null;  // null until shift has run
}

export const SHIFTS: ShiftDef[] = [
  {
    id: "shift-1",
    agents: ["TORA", "VERA"],
    title: "DNS Alerts: Calibration Run",
    startDate: "2026-03-23T00:00:00Z",
    endDate: "2026-03-27T23:59:59Z",
    sprint: "phase1-sprint-1",
    sprintLabel: "Sprint 1",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 16,
      alertsClosed: 8,
      alertsInsufficientContext: 1,
      alertsUnknown: 0,
      casesTotal: 16,
      casesEscalatedToAria: 16,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-2",
    agents: ["TORA", "VERA"],
    title: "SSH Brute Force + C2 DNS",
    startDate: "2026-03-30T00:00:00Z",
    endDate: "2026-04-03T23:59:59Z",
    sprint: "phase1-sprint-1",
    sprintLabel: "Sprint 1",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 15,
      alertsClosed: 8,
      alertsInsufficientContext: 2,
      alertsUnknown: 0,
      casesTotal: 15,
      casesEscalatedToAria: 15,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-3",
    agents: ["TORA", "VERA"],
    title: "Mixed DNS + SSH Brute Force",
    startDate: "2026-04-06T00:00:00Z",
    endDate: "2026-04-10T23:59:59Z",
    sprint: "phase1-sprint-2",
    sprintLabel: "Sprint 2",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 15,
      alertsClosed: 5,
      alertsInsufficientContext: 3,
      alertsUnknown: 2,
      casesTotal: 15,
      casesEscalatedToAria: 12,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 3,
    },
  },
  {
    id: "shift-4",
    agents: ["TORA", "VERA"],
    title: "DNS Tunneling",
    startDate: "2026-04-13T00:00:00Z",
    endDate: "2026-04-17T23:59:59Z",
    sprint: "phase1-sprint-2",
    sprintLabel: "Sprint 2",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 12,
      alertsClosed: 9,
      alertsInsufficientContext: 4,
      alertsUnknown: 0,
      casesTotal: 12,
      casesEscalatedToAria: 11,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 1,
    },
  },
  {
    id: "shift-5",
    agents: ["TORA", "VERA"],
    title: "Addressing the precedence gap.",
    startDate: "2026-04-20T00:00:00Z",
    endDate: "2026-04-24T23:59:59Z",
    sprint: "phase1-sprint-3",
    sprintLabel: "Sprint 3",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 12,
      alertsClosed: 9,
      alertsInsufficientContext: 4,
      alertsUnknown: 0,
      casesTotal: 12,
      casesEscalatedToAria: 8,
      casesClosed: 0,
      casesHeld: 1,
      casesUnknown: 3,
    },
  },
  {
    id: "shift-6",
    agents: ["TORA", "VERA"],
    title: "Addressing the Investigation parsing errors.",
    startDate: "2026-04-27T00:00:00Z",
    endDate: "2026-05-01T23:59:59Z",
    sprint: "phase1-sprint-3",
    sprintLabel: "Sprint 3",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 6,
      alertsClosed: 13,
      alertsInsufficientContext: 5,
      alertsUnknown: 0,
      casesTotal: 6,
      casesEscalatedToAria: 6,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-7",
    agents: ["TORA", "VERA"],
    title: "Phishing email alerts are now live!",
    startDate: "2026-05-04T00:00:00Z",
    endDate: "2026-05-08T23:59:59Z",
    sprint: "phase1-sprint-4",
    sprintLabel: "Sprint 4",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 11,
      alertsClosed: 13,
      alertsInsufficientContext: 1,
      alertsUnknown: 0,
      casesTotal: 11,
      casesEscalatedToAria: 10,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 1,
    },
  },
  {
    id: "shift-8",
    agents: ["TORA", "VERA"],
    title: "Process Debt has surfaced.",
    startDate: "2026-05-11T00:00:00Z",
    endDate: "2026-05-15T23:59:59Z",
    sprint: "phase1-sprint-4",
    sprintLabel: "Sprint 4",
    stats: {
      alertsTotal: 25,
      alertsEscalated: 15,
      alertsClosed: 6,
      alertsInsufficientContext: 3,
      alertsUnknown: 1,
      casesTotal: 15,
      casesEscalatedToAria: 14,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 1,
    },
  },
  {
    id: "shift-9",
    agents: ["TORA", "VERA"],
    title: "This is the second half of Phase 1.",
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-06-05T23:59:59Z",
    sprint: "phase1-sprint-5",
    sprintLabel: "Sprint 5",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 13,
      alertsClosed: 14,
      alertsInsufficientContext: 1,
      alertsUnknown: 2,
      casesTotal: 13,
      casesEscalatedToAria: 13,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-10",
    agents: ["TORA", "VERA"],
    title: "Harnesses are on.",
    startDate: "2026-06-08T00:00:00Z",
    endDate: "2026-06-12T23:59:59Z",
    sprint: "phase1-sprint-5",
    sprintLabel: "Sprint 5",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 13,
      alertsClosed: 16,
      alertsInsufficientContext: 1,
      alertsUnknown: 0,
      casesTotal: 13,
      casesEscalatedToAria: 13,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-11",
    agents: ["TORA", "VERA"],
    title: "Tailoring harnesses",
    startDate: "2026-06-15T00:00:00Z",
    endDate: "2026-06-19T23:59:59Z",
    sprint: "phase1-sprint-6",
    sprintLabel: "Sprint 6",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 13,
      alertsClosed: 16,
      alertsInsufficientContext: 1,
      alertsUnknown: 0,
      casesTotal: 13,
      casesEscalatedToAria: 13,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-12",
    agents: ["TORA", "VERA"],
    title: "Building the ground for NOVA",
    startDate: "2026-06-22T00:00:00Z",
    endDate: "2026-06-26T23:59:59Z",
    sprint: "phase1-sprint-6",
    sprintLabel: "Sprint 6",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 26,
      alertsClosed: 4,
      alertsInsufficientContext: 0,
      alertsUnknown: 0,
      casesTotal: 26,
      casesEscalatedToAria: 26,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-13",
    agents: ["TORA", "VERA", "NOVA"],
    title: "Pattern analysis has arrived. NOVA is here!",
    startDate: "2026-06-29T00:00:00Z",
    endDate: "2026-07-05T23:59:59Z",
    sprint: "phase1-sprint-7",
    sprintLabel: "Sprint 7",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 16,
      alertsClosed: 14,
      alertsInsufficientContext: 0,
      alertsUnknown: 0,
      casesTotal: 16,
      casesEscalatedToAria: 16,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-14",
    agents: ["TORA", "VERA", "NOVA"],
    title: "Containment gap confirmed: srv-ad-01 compromised a third time",
    startDate: "2026-07-06T00:00:00Z",
    endDate: "2026-07-10T23:59:59Z",
    sprint: "phase1-sprint-7",
    sprintLabel: "Sprint 7",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 20,
      alertsClosed: 7,
      alertsInsufficientContext: 3,
      alertsUnknown: 0,
      casesTotal: 20,
      casesEscalatedToAria: 20,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-15",
    agents: ["TORA", "VERA", "NOVA"],
    title: "Three-Shift Campaign Persistence, Zero Refutations",
    startDate: "2026-07-13T00:00:00Z",
    endDate: "2026-07-17T23:59:59Z",
    sprint: "phase1-sprint-8",
    sprintLabel: "Sprint 8",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 25,
      alertsClosed: 1,
      alertsInsufficientContext: 0,
      alertsUnknown: 0,
      casesTotal: 25,
      casesEscalatedToAria: 25,
      casesClosed: 0,
      casesHeld: 0,
      casesUnknown: 0,
    },
  },
  {
    id: "shift-16",
    agents: ["TORA", "VERA", "NOVA"],
    title: "Perfect Escalation Agreement, Zero Confirmed Hypotheses",
    startDate: "2026-07-20T00:00:00Z",
    endDate: "2026-07-24T23:59:59Z",
    sprint: "phase1-sprint-8",
    sprintLabel: "Sprint 8",
    stats: {
      alertsTotal: 30,
      alertsEscalated: 23,
      alertsClosed: 3,
      alertsInsufficientContext: 4,
      alertsUnknown: 0,
      casesTotal: 23,
      casesEscalatedToAria: 22,
      casesClosed: 0,
      casesHeld: 1,
      casesUnknown: 0,
    },
  },
];

export const SHIFTS_BY_ID: Record<string, ShiftDef> = Object.fromEntries(
  SHIFTS.map(s => [s.id, s])
);
