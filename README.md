# PrepMate — Adaptive SSC Study Planner

PrepMate is a study operating system for competitive-exam aspirants: a personal diary, adaptive daily/weekly planner, syllabus tracker, exam-overlap explorer, mock-test analyst, revision engine, progress dashboard, gamification system, and AI study mentor.

Initial exams: SSC CGL, SSC CPO, and SSC CHSL. The architecture supports multiple independent users from the beginning.

## Specification files
- `MASTER_PROMPT.md` — main instructions for an AI coding agent.
- `FRD.md` — product requirements, journeys, acceptance criteria, and BYOK requirements.
- `Architecture.md` — modular-monolith design, multi-user isolation, authentication, AI boundaries, and scaling.
- `TechStack.md` — technology choices and rationale.
- `Frontend.md` — routes, components, state, screens, and frontend rules.
- `Backend.md` — API conventions, authentication, scheduling, AI integration, and credential security.
- `UI_UX.md` — visual system, themes, responsive layout, and accessibility.
- `Data_Model.md` — relational entities, constraints, and ownership.
- `Implementation_Plan.md` — milestones and exit criteria.

## Product principles
1. **Plan → Study → Review → Adapt.** Recover from missed targets without shame or unrealistic overload.
2. **One canonical syllabus.** Map topics across exams while distinguishing coverage, mastery, and exam-specific depth.
3. **AI proposes; application logic validates.** Scheduling, permissions, calculations, and database writes remain deterministic.
4. **Multi-user security from day one.** Every private record is scoped to the authenticated user.
5. **Evidence over vanity metrics.** Track focused sessions, mastery, mock performance, revision, and consistency separately.
6. **Sustainable gamification.** Rest days and recovery are supported; streaks never erase accumulated progress.
7. **Provider-flexible AI.** Use LangGraph for orchestration, LangChain integrations where useful, and Gemini as the first provider.
8. **BYOK support.** Users may configure their own supported AI API key. Keys must be encrypted, never returned to the browser, and never logged. Core planning works without AI.
9. **One coherent design system.** Linear-inspired structure, Notion-inspired diary readability, and Airtable-inspired data views adapted into PrepMate's own identity.
10. **Verified exam content.** Sample syllabus mappings must be labelled illustrative/unverified until checked against official sources.

## Recommended technology
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui/Radix, React Router, TanStack Query, React Hook Form, Zod, Recharts.
- Authentication: Firebase Authentication with Google sign-in.
- Backend: Node.js, Express, TypeScript, Firebase Admin token verification.
- Database: PostgreSQL + Prisma.
- AI: LangGraph, LangChain integrations where useful, Gemini first.
- Retrieval: pgvector later, when RAG over notes/resources is implemented.
- Tests: Vitest, React Testing Library, Supertest, Playwright for key journeys.

## Using an AI coding agent
1. Place this folder at the project root.
2. Open the repository in your coding agent.
3. Give it `MASTER_PROMPT.md`.
4. Require it to inspect the repository and read all specification files before coding.
5. Implement one milestone at a time; keep docs aligned with deliberate changes.

## Non-negotiable security rules
- Verify Firebase ID tokens on protected API routes.
- Never trust a client-supplied user ID for ownership.
- Never expose provider keys, database credentials, or Firebase Admin credentials to browser code.
- For BYOK, verify credentials server-side, encrypt at rest using a managed secrets system or authenticated encryption, and show only masked status after saving.
- Never silently switch a user's key to a platform key that may incur charges.
- AI tools must be narrow and validated; no unrestricted SQL or arbitrary database access.
- Schedule proposals must be validated and approved before changes are applied.

## Implementation order
1. Authentication and profile.
2. Daily/weekly planner and persistence.
3. Syllabus tracking and exam mappings.
4. Study sessions and diary.
5. Deterministic adaptive scheduler with preview and approval.
6. Rest days, revisions, mock tests, and error notebook.
7. Analytics and XP/achievements.
8. LangGraph AI mentor and BYOK settings.
9. RAG over notes, if needed.
10. Responsive, accessibility, security, and deployment QA.

## Exam-content warning
Do not treat generated sample syllabus mappings, exam dates, eligibility rules, or cut-offs as official facts. Store source metadata and verification status.
