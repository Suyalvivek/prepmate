# Master Build Prompt — Adaptive SSC Study Planner

You are a senior product engineer, software architect, UX designer, and pragmatic technical lead. Build a production-minded MVP of a web application for competitive-exam aspirants, initially focused on SSC CGL, SSC CPO, and SSC CHSL. The app is a personal study operating system: diary, strategic planner, syllabus tracker, adaptive scheduler, progress analytics, and AI study mentor.

## How to work
1. Read every project specification in this folder before coding: `FRD.md`, `Architecture.md`, `TechStack.md`, `Frontend.md`, `Backend.md`, `UI_UX.md`, `Data_Model.md`, and `Implementation_Plan.md`.
2. First inspect the repository and report what already exists. Do not overwrite working code blindly.
3. If the repository is empty, scaffold the application according to the specs.
4. Before implementation, produce a concise plan listing milestones, files/modules to create, key data flows, and risks. Then proceed milestone by milestone.
5. Build a functional application, not just a static mockup. Buttons and forms must have real behavior; no dead controls or fake success states.
6. Prefer simple, modular architecture. Start with a modular monolith, not microservices.
7. Use strict TypeScript, shared validation schemas where practical, environment variables for secrets, accessible UI primitives, and clear error/loading/empty states.
8. Do not invent official exam dates, syllabus details, eligibility rules, cut-offs, or exam overlap. Seed only clearly labelled sample/demo data until verified against official sources. Store source and verification metadata for official content.
9. Never expose AI provider keys or privileged database credentials in browser code.
10. Do not silently reschedule or delete user work. Preview schedule changes and let the user approve them, unless they explicitly enable a future auto-apply preference.
11. Keep all user-owned records securely scoped to the authenticated user. Every backend query and mutation must enforce ownership; hiding UI elements is not authorization.
12. Add tests for scheduling rules, permissions, validation, and important business logic. Keep documentation current as implementation changes.

## Product outcome

## Final design direction
- Use Linear as the primary reference for precise layout, task interactions, restrained surfaces, and dark mode.
- Borrow Notion-like reading comfort for diary/study notes and Airtable-like structured views for syllabus/analytics.
- Preserve PrepMate's identity: navy sidebar, soft neutral surfaces, restrained indigo accent, rounded cards, subtle borders, and study-first hierarchy.
- Create one project-owned design-token system; do not copy multiple design systems wholesale.
- Support Light, Dark, and System themes.
- If using getdesign.md, inspect its current instructions and generated files first; adapt selectively rather than installing competing systems.

A candidate can:
- Sign in with Google.
- Set exam goals, a target date (optional), daily availability, preferred study days, and monthly rest-day preferences.
- Build weekly plans with measurable goals and daily tasks.
- Track the master syllabus once and see its mapped coverage across selected exams.
- Log study sessions, mock-test performance, mistakes, revision, and daily reflections.
- Review planned versus actual work.
- Reschedule missed tasks intelligently without creating an unrealistic backlog.
- Track consistency, XP, achievements, study trends, topic mastery, and mock-score trends.
- Ask an AI mentor questions grounded in their own saved data.
- Switch between light and dark themes and use a responsive, accessible interface.

## Recommended implementation order
### Milestone 0 — Discovery and foundation
- Inspect repository.
- Create/verify project scripts, linting, formatting, environment examples, and documentation.
- Configure frontend and backend separately or use a clean monorepo structure.
- Add shared types/validation only if the chosen structure genuinely benefits from it.

### Milestone 1 — Authentication and profile
- Google sign-in through Firebase Authentication.
- Backend verifies Firebase ID tokens.
- Create or update a local user profile keyed by Firebase UID.
- Protected routes, sign-out, account loading/error states.
- User-specific data isolation tests.

### Milestone 2 — Core planner
- Dashboard, task CRUD, task status, daily and weekly views.
- Focus-session logging and daily reflection.
- Calendar date handling using the user's configured timezone.
- Plan-versus-actual summary.

### Milestone 3 — Syllabus and exams
- Normalised exam, exam stage, subject, topic, subtopic, and exam-topic mapping.
- Topic status and mastery kept distinct.
- User-specific progress records.
- Import/seed workflow with provenance fields.
- CGL/CPO/CHSL data must be labelled as sample until verified.

### Milestone 4 — Adaptive scheduler
- Implement deterministic scheduling rules in a testable backend domain module.
- Create a proposed schedule revision with explanations.
- Show before/after preview and accept/reject/edit actions.
- Preserve completed tasks and audit every accepted reschedule.
- Never move tasks into unavailable time or exceed configured daily capacity without an explicit warning and approval.

### Milestone 5 — Analytics, revision, gamification
- Mock tests, topic-level performance, error notebook, revision queue.
- XP ledger, achievements, streak/consistency indicators.
- Analytics based on real persisted records, not hard-coded demo numbers.

### Milestone 6 — AI mentor

### Milestone 6 — AI mentor and BYOK
- Use one LangGraph workflow initially; use LangChain integrations where useful for model calls, tools, structured output, and retrieval.
- Gemini first, with a provider adapter for future supported providers.
- Add BYOK settings: provider/model selection, server-side key verification, masked status, rotate/disconnect.
- Encrypt credentials at rest with a managed secrets service/KMS where practical, or authenticated encryption with keys stored outside the database.
- Never expose or log keys. Do not silently fall back to a platform key that could charge the user.
- Keep AI suggestions subject to domain validation and user approval.

- Server-side model integration only.
- Structured output validated against a schema.
- AI receives only the minimum user data needed and must not be allowed to directly mutate data.
- AI recommendations are proposals; scheduler/domain rules validate them.
- Handle provider errors, rate limits, timeouts, and unavailable keys gracefully.

### Milestone 7 — Quality and deployment readiness
- Responsive layout, keyboard navigation, focus states, reduced-motion support.
- Unit/integration tests, authorization tests, and core user-flow tests.
- Loading, empty, error, and success states.
- Database migrations, seed command, `.env.example`, setup instructions, deployment guide.
- Final review for broken links, dead buttons, console errors, unsafe query patterns, and exposed secrets.

## Required deliverables
1. Working app source code.
2. `README.md` with setup, environment variables, database setup, seed instructions, test commands, and deployment notes.
3. `.env.example` with placeholders only.
4. Database schema and migrations.
5. Seed data clearly labelled as illustrative/unverified where appropriate.
6. Automated tests for core scheduling and authorization rules.
7. All specification files updated if implementation decisions change.
8. A final summary: implemented features, setup steps, tests run, known limitations, and next steps.

## Definition of done
The MVP is done only when a user can sign in, create a weekly plan, manage daily tasks, track syllabus progress, record study sessions and mock tests, see real analytics, review a proposed reschedule after missing tasks, and use theme switching on mobile and desktop. Core data persists after refresh. One user cannot access another user's private data. All important actions have loading, success, and error handling.

Start by inspecting the repository and reading the specification files. Do not begin by generating a large unreviewed code dump.
