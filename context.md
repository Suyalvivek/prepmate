# PrepMate — Build Context

> This file is maintained automatically throughout the build.
> It is the single source of truth for: what's been built, what decisions were made, what's next, and known issues.

---

## Project Overview
- **Product**: PrepMate — adaptive SSC study planner (CGL, CPO, CHSL)
- **Architecture**: Bun monorepo · React+Vite frontend · Express+TypeScript backend · PostgreSQL+Prisma · Firebase Auth
- **Workspace root**: `/Users/viveksuyal/Downloads/PrepMate/`

---

## Runtime & Tooling
| Tool | Version | Notes |
|------|---------|-------|
| Bun | 1.3.14 | Package manager + runtime + test runner |
| Node compat | 25.3.0 | Available on system |
| Prisma | 5.22.0 | Client generated ✓ |

---

## Current Phase: **Phase 0 — Foundation complete · Phase 1 — Auth in progress**

### Phase 0 — Repository & Foundations ✅
- [x] Bun monorepo with workspaces: `apps/frontend`, `apps/backend`, `packages/shared-types`
- [x] Root `package.json` with orchestrated scripts
- [x] `docker-compose.yml` — Postgres 16 dev + test instances
- [x] `.gitignore`, `.env.example`, `.prettierrc`
- [x] `packages/shared-types` — Zod schemas for User, Planner, Syllabus, Scheduler, API
- [x] `apps/backend` — Express + TypeScript + Prisma structure
  - Config: `src/config/env.ts` (typed env validation)
  - Lib: `logger.ts` (Pino), `errors.ts` (AppError), `prisma.ts` (singleton)
  - Middleware: `authenticate.ts`, `validate.ts`, `error-handler.ts`, `request-id.ts`, `rate-limit.ts`
  - Integrations: `firebase/admin.ts` (dual-mode init)
  - Modules: `health/`, `users/` (routes + controller + service)
  - Prisma schema: **all 28 models** from Data_Model.md
  - Seed: SSC CGL/CPO/CHSL sample data (labelled SAMPLE/UNVERIFIED)
  - Tests: `src/tests/core.test.ts` — 7/7 passing ✓
- [x] `apps/frontend` — React 18 + Vite + TypeScript + Tailwind CSS
  - CSS design token system: navy sidebar, indigo accent, light/dark theme
  - Providers: `AuthProvider`, `ThemeProvider`, `QueryProvider`, `RouteGuards`
  - Router: `createBrowserRouter` with public/protected separation
  - Components: `AppShell`, `Sidebar`, `TopBar`
  - Features: `SignInPage`, `OnboardingPage`, `DashboardPage`, `PlannerPage`, `SyllabusPage`, `MockTestsPage`, `RevisionsPage`, `AnalyticsPage`, `JournalPage`, `MentorPage`, `SettingsPage`
  - Lib: `firebase.ts`, `api-client.ts`, `query-client.ts`, `utils.ts`
- [x] `GET /api/v1/health` endpoint
- [x] Anti-FOUC theme script in `index.html`

### Phase 1 — Authentication & Profile ✅
**Status**: Authentication, database, and onboarding wizard fully connected and verified.

- [x] Firebase Admin init (`integrations/firebase/admin.ts`)
- [x] `authenticate.ts` middleware — verifies token, upserts User idempotently
- [x] `users` module — GET/PATCH /me, GET/PATCH /me/preferences, POST /me/onboarding
- [x] `AuthProvider` — onAuthStateChanged, sign-in, sign-out
- [x] `ProtectedRoute` / `PublicRoute` guards
- [x] Onboarding wizard — 3 steps, resolves exam codes, calls `/me/onboarding`
- [x] Database migration applied & SSC seed data populated (`bun db:seed`)
- [x] End-to-end auth test verified with live Firebase credentials
- [x] **High-Fidelity Dashboard & Navigation UI**:
  - Implemented exact visual dashboard matching reference design (Hero banner with mountain sunrise artwork, Journey streak card, 4 key metrics with SVG progress gauges)
  - Interactive "Today's Plan" with 6 scheduled tasks, status badges, and interactive cycling
  - "Weekly Progress" stacked bar chart with 5h target line & summary badges
  - "Upcoming Exams" countdown tracker (SSC CGL, CPO, CHSL)
  - "Monthly Calendar" with October 2024 active date selection and status indicators
  - "AI Mentor" card with instant prompt chips and input action
  - Bottom analytics: Subject Progress bars, Mock Test performance curve with score/accuracy tooltip, Topic-wise accuracy donut gauge, and 4 Recent Achievement badges
  - Navy sidebar with complete navigation items, "Stay Consistent" card, and user footer profile
  - Sleek top header with search pill, day/night theme toggle, notification bell, and user avatar menu
  - Full Light & Dark theme support with instant switching and responsive desktop/tablet layouts
- [x] **Study Planner (`/planner`) Full Functionality & UX**:
  - Defined reusable `.pm-btn-primary` and `.pm-btn-secondary` in `index.css`.
  - Date-aware 7-day strip (Sun 11 Oct – Sat 17 Oct) with active indicators and dynamic daily task filtering.
  - Dynamic capacity stats (Daily Capacity, Tasks Progress, Focus Completed) updating per selected day.
  - Interactive task actions: Completion toggle with XP toasts, Deferral to next day (moving seamlessly across days), Deletion.
  - Interactive Focus Timer modal with countdown, pause/resume, reset, and direct completion.
  - Modal to Add Task with title, subject, scheduled day selector, duration, priority, and type.
  - Rich 7-Day Weekly Overview schedule board with daily hours, milestone events, and subject distribution analytics.
  - Filter pills (All, Pending, Completed) and Subject pills (Quant, Reasoning, English, GA).
  - **Historical Record Locking (Immutable Past Days)**:
    - Days prior to today (`date < TODAY_DATE`) are strictly read-only and locked.
    - Checkboxes are disabled with lock tooltips; action buttons (`Start Focus`, `Defer`, `Delete`) are replaced with a clear `Locked` badge.
    - Prominent `Historical Record (Locked)` warning banner rendered with a quick `Switch to Today` button.
    - Adding tasks to past days is blocked in both the modal selector (disabled options with `• Past (Locked)`) and the `handleAddTask` handler.
    - Weekly Overview day cards display a `Past` header badge and `Locked` footer instead of `+ Add`.
  - Verified across light and dark modes with 100% passing TypeScript and Vite production build.
- [x] **Full Sidebar Navigation & Features End-to-End Verification**:
  - `Dashboard` (`/app`): All cards, SVG gauges, Today's Plan, Weekly progress, and Exams operational.
  - `My Plan` (`/planner`): Daily view with full task management, deferral, and focus timer.
  - `Weekly Planner` (`/weekly-planner`): Automatically syncs and displays the 7-day Weekly Overview agenda board.
  - `Syllabus` (`/syllabus`): Multi-exam switcher (CGL/CPO/CHSL), live topic search, subject filter pills, status selector (Not Started / In Progress / Mastered) with dynamic mastery progress updates.
  - `Mock Tests` (`/mock-tests`): Score KPIs, test list, Error Notebook tab, "Add to Revision" conversion, and "Log Mock Test" modal.
  - `Flashcards` (`/revisions`): Spaced repetition flashcard queue with recall interval ratings (Difficult, Good, Easy) and due counters.
  - `Progress & Analytics` (`/analytics`): Quantified study analytics, weekly study distribution bar chart with daily goals, subject time allocation meters with section accuracy KPIs.
  - `Achievements` (`/achievements`): Dedicated gamification page with Level 4 XP progress bar (1,280/1,500 XP), 7-Day Consistency Streak showcase, 11 categorized badges with live progress bars, filter tabs, and recent XP transaction log.
  - `Notes & Resources` (`/journal`): Focus clock with presets (25m/50m/10m), reflection form with mood chips, and past reflection history log.
  - `AI Mentor` (`/mentor`): Fully elevated AI Study Mentor feature:
    - Real-time location state reader auto-submitting prompts clicked from Dashboard's `AIMentorCard`.
    - World-class System Prompt architecture ([mentorPrompt.ts](file:///Users/viveksuyal/Downloads/PrepMate/apps/frontend/src/features/mentor/mentorPrompt.ts)) with explicit persona definition, greeting handling rules, candidate telemetry injection, and FRD FR-014 safety guardrails.
    - Inspectable "System Prompt" modal allowing candidates to view, verify, and copy the prompt instructions governing their mentor.
    - Intelligent, warm, and concise handling of greetings (`"hi"`, `"hello"`, `"hey"`): acknowledges streak & due flashcards without robotic filler or canned lectures.
    - Direct support for BYOK Gemini API (`gemini-1.5-flash` / `gemini-1.5-pro`) with graceful fallback to deterministic local engine.
    - Collapsible "Study Snapshot" grounding drawer showcasing candidate profile (SSC CGL 2026, 165+ target, 6.0h daily limit, 7-day streak, Mock #5 148.5/200 evidence, weak areas, and 3 due flashcards).
    - Structured Actionable Study Mission cards with direct "Add to Plan" functionality that saves tasks to `localStorage` and synchronizes with the Planner.
    - Categorized prompt chips (Recommended, Diagnostics, Adaptive Plan, High-Yield Drills).
    - Rich Markdown Rendering & Anti-Clutter Formatting: Integrated `react-markdown` with customized Tailwind typography components (styled headings, lists, inline code, bold text) removing raw syntax artifacts (`**`, `###`), and updated system prompt rules to eliminate asterisk clutter and excessive bolding.
    - Assistant message tools: Copy response, Thumbs up/down feedback, and contextual direct links to Error Notebook (`/mock-tests`) and Flashcards (`/revisions`).
  - `TopBar Notifications Center`: Interactive notifications popover displaying time-sensitive study alerts (7-day streak at risk, due flashcards queue, mock test analysis summaries, exam timeline alerts), unread badge counts, mark-all-read functionality, and direct navigation links.
  - `Dashboard Refinement`: Removed redundant `Recent Achievements` card from the bottom of the Dashboard; adjusted row to a spacious 3-column grid featuring `Subject Progress`, `Mock Test Performance`, and `Topic-wise Accuracy`.
  - `Settings` (`/settings`): Profile information, daily study capacity slider, active study day toggles, theme switcher, BYOK Gemini credentials with localStorage persistence, and save confirmation.
  - `Sidebar Collapse/Expand`: Smooth collapse to 72px icon mode with tooltips, and blue toggle button to expand back.

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Bun** as runtime + package manager | Faster installs, built-in test runner, matches user preference |
| **Bun workspaces** (no pnpm) | Monorepo without pnpm; Bun native workspace support |
| **`context.md`** living document | Single source of truth for build state across sessions |
| **`packages/shared-types`** Zod schemas | Single validation definition used by both frontend (forms) and backend (API validation) |
| Prisma schema has **all 28 models upfront** | Avoids migration conflicts later; columns not used yet are nullable/defaulted |
| **`authenticate.ts` upserts User** | Firebase token verification + local user creation in one middleware step |
| **404 not 403** for inaccessible resources | Avoids confirming whether another user's record exists |
| Onboarding sends exam **codes** not UUIDs | Exam UUIDs are resolved server-side from codes; frontend doesn't need to fetch them first |
| **Anti-FOUC** theme script in HTML `<head>` | Applies theme class before React hydrates to prevent flash |

---

## Environment Variables Required

### Before running locally:
1. Start Docker Desktop → `bun docker:up`
2. Create `apps/backend/.env` from `apps/backend/.env.example`
3. Create `apps/frontend/.env` from `apps/frontend/.env.example`
4. Fill Firebase credentials (see Firebase Console)
5. Run `bun db:migrate:dev` to apply migrations

### Backend `.env` minimum for Phase 1:
```
DATABASE_URL=postgresql://prepmate:prepmate_dev@localhost:5432/prepmate_dev
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
CORS_ORIGINS=http://localhost:5173
```

### Frontend `.env` minimum for Phase 1:
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

---

## File Structure (current)

```
PrepMate/
├── .env.example
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── package.json                      ← Bun workspace root
├── context.md                        ← THIS FILE
├── packages/
│   └── shared-types/
│       └── src/
│           ├── index.ts
│           ├── user.ts
│           ├── planner.ts
│           ├── syllabus.ts
│           ├── scheduler.ts
│           └── api.ts
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma         ← All 28 models
│   │   │   └── seed.ts               ← SSC sample data
│   │   └── src/
│   │       ├── app.ts
│   │       ├── server.ts
│   │       ├── config/env.ts
│   │       ├── lib/{logger,errors,prisma}.ts
│   │       ├── middleware/{authenticate,validate,error-handler,request-id,rate-limit}.ts
│   │       ├── integrations/firebase/admin.ts
│   │       ├── modules/
│   │       │   ├── health/health.routes.ts
│   │       │   └── users/{routes,controller,service}.ts
│   │       └── tests/core.test.ts    ← 7/7 passing
│   └── frontend/
│       ├── index.html
│       ├── src/
│       │   ├── main.tsx
│       │   ├── styles/index.css      ← CSS design token system
│       │   ├── app/
│       │   │   ├── App.tsx
│       │   │   ├── router.tsx
│       │   │   └── providers/
│       │   │       ├── AuthProvider.tsx
│       │   │       ├── ThemeProvider.tsx
│       │   │       ├── QueryProvider.tsx
│       │   │       └── RouteGuards.tsx
│       │   ├── components/layout/
│       │   │   ├── AppShell.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── TopBar.tsx
│       │   ├── features/
│       │   │   ├── auth/SignInPage.tsx
│       │   │   ├── onboarding/OnboardingPage.tsx
│       │   │   └── dashboard/DashboardPage.tsx
│       │   └── lib/
│       │       ├── api-client.ts
│       │       ├── firebase.ts
│       │       ├── query-client.ts
│       │       └── utils.ts
```

---

## Tests Status
| Test Suite | Status | Count |
|------------|--------|-------|
| `backend/src/tests/core.test.ts` | ✅ Pass | 7/7 |

---

## Next Steps (Phase 1 completion → Phase 2)

### To complete Phase 1:
1. User creates Firebase project + enables Google Auth → fills `.env` files
2. `bun docker:up` → `bun db:migrate:dev --name init`
3. `bun dev:backend` + `bun dev:frontend` → verify sign-in flow
4. Manual test: unauthenticated → 401; cross-user → 404
5. Tag milestone: `git tag phase-1-auth`

### Phase 2 — Core Planner (next):
- Weekly plan CRUD (`POST /plans`, `GET /planner/week`)
- Task CRUD (`POST /tasks`, `PATCH /tasks/:id`, etc.)
- Dashboard aggregation query
- Weekly + daily planner UI views
- Task create/edit form (React Hook Form + Zod)
- Plan-vs-actual progress
- Theme persistence test

---

## Known Issues / TODOs
- [x] Exam codes (`SSC_CGL`, etc.) resolved in `completeOnboarding`
- [x] Firebase Admin credentials active and verifying tokens
- `TopBar` quick-add button is a stub — wired in Phase 2 with task create dialog

---

## Spec Compliance Notes
- ✅ All exam/syllabus seed data labelled SAMPLE/UNVERIFIED
- ✅ No secrets in `VITE_` variables (only public Firebase client config)
- ✅ 404 returned for inaccessible private resources
- ✅ Auth middleware never trusts client-supplied userId
- ✅ Scheduler is a pure function (no DB access during proposal)
- ✅ XP idempotency key is deterministic and unique-constrained in schema
- ✅ Theme applies before first paint (anti-FOUC)
- ✅ Reduced-motion support in CSS
