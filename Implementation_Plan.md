# Implementation Plan

## Guiding rule
Ship a thin, end-to-end vertical slice before adding many disconnected screens. Every milestone should leave the application runnable.

## Phase 0 — Repository and foundations
- Inspect current repository, package manager, existing code, and conventions.
- Add README, `.env.example`, lint/format scripts, and test scripts.
- Scaffold frontend and backend if missing.
- Add API health endpoint.
- Configure PostgreSQL, Prisma, initial migration, and development seed process.
- Set up Firebase project instructions and token verification.
- Add CI if appropriate.

Exit criteria: app starts locally; API health works; DB migration runs; no secrets committed.

## Phase 1 — Authentication and profile
- Google sign-in and sign-out.
- Protected routes and loading/error states.
- Backend Firebase token verification.
- User upsert and preferences.
- Ownership tests.

Exit criteria: sign-in persists; private endpoints reject unauthenticated requests; user A cannot access user B's records.

## Phase 2 — Planner vertical slice
- Create weekly plan.
- Create/update/complete/defer tasks.
- Daily and weekly views.
- Dashboard aggregates.
- Theme switch.
- Task list empty/loading/error states.

Exit criteria: task data persists and updates dashboard correctly.

## Phase 3 — Syllabus vertical slice
- Exam/subject/topic/mapping schema.
- Seed clearly labelled sample data.
- Topic progress and exam overlap.
- Verification source display.
- Filters and progress summaries.

Exit criteria: one canonical topic can map to multiple exams without duplicating user progress.

## Phase 4 — Study sessions and journal
- Focus timer.
- Session persistence and manual adjustment.
- Daily reflection.
- Focus-time analytics.

Exit criteria: actual logged sessions—not browser-open time—drive study-time charts.

## Phase 5 — Adaptive scheduling
- Pure scheduler service.
- Strategies and capacity constraints.
- Proposal preview UI.
- Accept/reject/edit proposal.
- Version conflict handling and audit record.
- Comprehensive tests.

Exit criteria: missed tasks can be rescheduled without silent mutation, lost work, or accidental overload.

## Phase 6 — Rest days, revisions, mock tests
- Monthly rest-day selection.
- Revision queue and review ratings.
- Mock-test logging and error notebook.
- Targeted follow-up tasks.

Exit criteria: a mock mistake can become a revision item and be scheduled.

## Phase 7 — Analytics and gamification
- Server-derived analytics.
- XP event ledger and idempotency.
- Achievements and consistency view.
- Weekly review.

Exit criteria: charts reflect persisted data and XP cannot be duplicated by retrying a request.

## Phase 8 — AI mentor
- Provider adapter and server-side credentials.
- Structured recommendations.
- Context selection and redaction.
- Rate limits, timeouts, error states.
- Scheduler validation for AI-proposed plans.

Exit criteria: AI suggestions explain their basis, respect capacity, and cannot directly bypass domain rules.

## Phase 9 — Polish and release
- Responsive/mobile QA.
- Accessibility review.
- Security review.
- Error/loading/empty state audit.
- Performance/index review.
- Deployment docs, migration runbook, backups/retention guidance.
- Final end-to-end tests.

## Required testing priorities
1. User data isolation.
2. Scheduler capacity and rest-day rules.
3. Schedule proposal version conflicts.
4. XP idempotency.
5. Timezone/day-boundary behaviour.
6. Topic mapping and progress calculations.
7. Authentication loading and expired tokens.
8. Empty state and failed API handling.
