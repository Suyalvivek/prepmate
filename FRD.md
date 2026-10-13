# Functional Requirements Document (FRD)
## Adaptive Competitive Exam Study Planner

- Status: Product specification for MVP
- Initial audience: Individual SSC aspirants; architecture should support multiple independent users.
- Initial exams: SSC CGL, SSC CPO, SSC CHSL. Other exams may be added through data, not duplicated application logic.
- Principle: The product helps candidates plan, act, review, and adapt. It must not claim to guarantee selection.

## 1. Product vision
A study-oriented web app combining a personal diary, weekly and daily planner, master syllabus tracker, exam-overlap explorer, adaptive scheduler, analytics dashboard, gamification, and AI mentor.

## 2. Product goals
1. Reduce the effort needed to decide what to study each day.
2. Make weekly targets measurable and achievable.
3. Track a syllabus topic once and map its relevance to multiple exams.
4. Recover intelligently from missed tasks without creating an endless backlog.
5. Help candidates learn from mock-test results and repeated errors.
6. Show progress using meaningful evidence, not study hours alone.
7. Support sustainable consistency, rest, and reflection.

## 3. Out of scope for the first MVP
- Social network, public profiles, public leaderboards, or chat between candidates.
- Paid subscriptions and payment processing.
- Native mobile apps.
- Unverified official exam dates, eligibility advice, cut-offs, or claims of exam-topic equivalence.
- Automated scraping of copyrighted or restricted question banks.
- AI directly changing a user's schedule without preview/permission.
- Microservices or premature event-stream infrastructure.

## 4. User roles
### Candidate
Can manage their profile, goals, exams, schedule, tasks, syllabus progress, sessions, mock tests, journal, revisions, and personal analytics.

### Admin/content manager (future, minimal MVP support)
Can manage shared reference data such as exams, subjects, topics, mappings, and source verification metadata. Admin operations must be role-protected on the server. Do not make a public admin route in MVP unless needed for content setup.

## 5. Core user journeys
1. Sign in with Google → onboarding → choose exams → set availability → land on dashboard.
2. Create a weekly plan → add daily tasks → track completion → review planned versus actual work.
3. Mark a task missed → request reschedule → inspect proposed changes → accept, edit, or reject.
4. Open a topic → view its subject and mapped exams → update learning status/mastery → see per-exam coverage implications.
5. Record mock test → enter section/topic performance → log mistakes → receive targeted revision suggestions.
6. Complete a study session → earn eligible XP → see progress analytics update.
7. End week → review wins, missed goals, trends, and next week's recommended targets.
8. Switch theme → preference persists across sessions.

## 6. Functional requirements

### FR-001 — Authentication and profile
- Support Google sign-in through Firebase Authentication.
- Backend must verify Firebase ID tokens for protected API routes.
- Create a local user profile on first authenticated request or onboarding completion.
- Store display name, email, avatar URL if available, timezone, locale, createdAt, and updatedAt.
- Allow sign-out.
- Handle loading, auth failure, expired token, and account/profile setup states.
- User can update timezone, available study hours, preferred days, target exams, and reminder preferences.
- Do not treat client-supplied user IDs as trusted identity.

Acceptance:
- Unauthenticated users cannot access private app routes or APIs.
- Authenticated users can only read and modify their own private records.
- A profile is created idempotently; repeated login does not create duplicate profiles.

### FR-002 — Onboarding
- Ask the user to choose one or more exams.
- Allow optional target exam date; explicitly label unknown/tentative dates.
- Capture daily study availability and preferred time windows.
- Capture weekly target hours and preferred rest days.
- Allow skipping optional fields and editing them later.
- Explain that exam dates and syllabus mappings should be verified against official notices.

### FR-003 — Dashboard / daily command centre
Display:
- Today's date in the user's timezone.
- Today's planned tasks, priorities, estimated duration, status, and completion.
- Focused time logged today.
- Planned-versus-actual progress.
- Due revisions.
- Upcoming mock tests or deadlines.
- Weekly goal progress.
- Small motivational quote or daily intention.
- Quick actions: add task, start focus session, log mock, daily reflection.
- Current schedule alerts, such as an overloaded day or overdue high-priority task.

Requirements:
- Dashboard data must come from APIs/state, not hard-coded demo values.
- Provide useful empty states for new users.
- Quote can be static curated content or a daily seeded item; do not require AI for this feature.
- Quote should not dominate the study UI.

### FR-004 — Daily and weekly planner
- Create, edit, complete, skip, cancel, and delete tasks with confirmation where destructive.
- Task fields: title, description, subject/topic links (optional), due date, estimated minutes, priority, status, task type, source, and recurrence (optional future capability).
- Task statuses: planned, in_progress, completed, skipped, cancelled, deferred.
- Task types: learn, practice, revision, mock_test, mock_analysis, admin, custom.
- Weekly plan supports goals by subject/topic, total planned minutes, number of practice sets, revision targets, and mock-test targets.
- Divide weekly goals into daily tasks.
- Drag-and-drop rescheduling may be included; keyboard-accessible move controls are required if drag-and-drop exists.
- Show week at a glance and a focused daily agenda.
- Support tasks not linked to syllabus topics.
- Preserve task history when deferred or rescheduled.

Acceptance:
- Completing a task updates dashboard and weekly totals.
- Changing a task date preserves its ID and audit/history.
- User can manually edit any generated plan.
- Time totals are computed from task estimates and logged sessions separately.

### FR-005 — Adaptive scheduler and missed-target recovery
Inputs:
- Unfinished tasks and their priorities.
- Remaining weekly goals and available time.
- User's daily capacity and unavailable blocks/rest days.
- Task duration, deadline, dependencies (if supported), topic importance, and revision dates.
- Current plan and chosen recovery strategy.

Strategies:
1. Balance across remaining week (default).
2. Move eligible work to next day.
3. Prioritise high-impact tasks and defer low-priority tasks.
4. Manual review, one task at a time.

Rules:
- Completed tasks never move.
- Cancelled tasks never re-enter backlog automatically.
- Respect user timezone and day boundaries.
- Respect configured daily capacity by default.
- Keep fixed-date tasks and imminent deadlines visible.
- Prefer spreading backlog over overloading tomorrow.
- Protect revision and mock-analysis blocks when feasible.
- If the remaining workload cannot fit, show a clear capacity warning and propose what to defer or reduce.
- Do not silently discard tasks or reduce their duration.
- Generated proposals must explain why each task moved, stayed, or was deferred.
- User can accept, reject, or edit a proposal.
- Optional future setting: allow auto-apply only for low-risk moves within configured capacity; default off.
- Every accepted plan revision should be auditable.

Acceptance:
- Given the same inputs and rules, deterministic scheduler output should be reproducible.
- Tests cover rest days, unavailable time, overdue tasks, completed tasks, deadlines, capacity overflow, and empty backlog.
- Rejecting a proposal leaves the existing plan unchanged.

### FR-006 — Rest days and recovery
- Candidate can designate up to three planned full rest days per calendar month as the default planning allowance.
- This allowance is configurable and must not be implemented as a punitive hard lock.
- Allow light day, full rest day, and exceptional extra rest day.
- Rest days should be excluded from normal task placement unless the user explicitly opts in.
- No streak penalty for a planned rest day.
- If the user exceeds the allowance, explain the effect on the weekly plan but do not shame, block, or delete progress.
- Rest-day changes trigger a schedule feasibility check.
- Monthly calendar displays selected rest days and remaining planned-rest allowance.

### FR-007 — Syllabus and exam-overlap engine
- Maintain a canonical hierarchy: Exam → Stage/Paper → Subject → Topic → Subtopic.
- Maintain explicit mappings between canonical topics and exam stages/papers.
- Mapping metadata should include relevance type, depth/coverage note, source URL/title, verifiedAt, and verification status.
- Relevance types may include common_core, related, exam_specific, and unverified.
- Candidate progress is tracked independently from shared syllabus content.
- Topic learning status and mastery are distinct:
  - Learning status: not_started, learning, practising, completed.
  - Mastery: unknown, weak, developing, strong.
  - Revision state/date is stored separately.
- A topic completion updates progress summaries for every selected exam mapping but does not automatically mark mastery as strong.
- Display exam-specific gaps and topics shared between selected exams.
- Never imply that similar topic names guarantee identical exam depth or question patterns.
- Import/seed data must include source and verification metadata. If not verified, label it sample/unverified.
- Content managers may version shared syllabus records in a future admin module.

Acceptance:
- A topic mapped to multiple selected exams appears in each relevant exam's coverage summary.
- User progress is stored once per canonical topic, while exam-specific requirements remain separately visible.
- Unverified mapping is visually distinct from verified mapping.

### FR-008 — Focus timer and study sessions
- Start, pause, resume, and finish a focus session.
- Support configurable focus/break durations; do not force Pomodoro.
- Store startedAt, endedAt, duration, subject/topic (optional), task link (optional), notes (optional), and session status.
- Handle refresh or navigation without accidentally recording duplicate sessions.
- Distinguish planned task duration from actual focused duration.
- Provide manual adjustment with validation.
- Do not infer productive time solely from the tab being open.

### FR-009 — Mock tests and analysis
- Record test name, exam, stage/paper, date, duration, maximum score, score, correct/incorrect/unattempted counts, and notes.
- Allow optional subject/topic-level results and per-question mistake entries.
- Store negative marking configuration only when supplied by the user or a verified exam configuration.
- Error categories: concept_gap, careless_error, calculation_error, time_management, misread_question, guess, forgotten_fact, other.
- Error notebook stores question/reference, topic, user's reasoning, correct explanation, resolution, and next review date.
- Charts compare comparable tests and should show context; do not claim a score trend is meaningful when test formats differ.
- Provide filters by exam, subject, date range, and error type.

### FR-010 — Revision engine
- Create revision items from topics, notes, flashcards, or mock-test errors.
- Schedule next review using a simple configurable interval algorithm for MVP.
- Let user rate recall: again, difficult, good, easy.
- Adjust next review date based on recall and previous history.
- Show due and overdue revisions on dashboard.
- Users can manually change a revision date.
- Spaced repetition algorithm should be replaceable and unit-tested.

### FR-011 — Analytics and growth
Show:
- Daily/weekly focused time.
- Planned versus completed tasks/minutes.
- Weekly goal adherence.
- Syllabus coverage and topic mastery by exam/subject.
- Mock score, accuracy, attempts, and speed where data exists.
- Revision completion and recurring error patterns.
- Consistency calendar/heatmap.
- Personal bests and month-over-month comparisons.
- Confidence/readiness indicator only if its formula is transparent and labelled as an estimate.

Rules:
- Do not use hard-coded chart data in production.
- Empty or insufficient data must show a useful explanation.
- Avoid comparing raw scores across non-comparable tests.
- Keep consistency, knowledge/mastery, and test performance as separate metrics.

### FR-012 — Gamification
- Award XP through a ledger, not only a mutable total.
- Example reward configuration (editable): complete study session, complete priority task, complete revision, analyse mock, finish weekly review.
- Enforce idempotency so repeated API requests cannot award duplicate XP.
- Achievements: first session, first mock, revision milestone, practice milestone, recovery after missed day, weekly consistency milestone.
- Streaks should count valid study days and planned rest days according to transparent rules.
- Never remove all progress because a streak breaks.
- No public leaderboard in MVP.
- Show level, XP to next level, earned achievements, and personal bests.
- Gamification must reward useful learning behaviours, not app opens or artificially inflated hours.

### FR-013 — Diary and reflection
- Daily entry fields: date, wins, difficulties, distractions, mood/energy (optional), lessons learned, tomorrow's intention.
- Keep entries private to the user.
- Allow edit and delete.
- Do not force emotional or health-related fields.
- AI may summarise a reflection only when the user requests it.

### FR-014 — AI mentor
- Available from a dedicated mentor page and context-aware actions.
- Capabilities: explain trends, summarise week, identify repeated errors, suggest revision, propose a realistic plan, answer questions about user's saved study records.
- AI must use server-side provider calls.
- Provide only the minimum necessary user data to the model.
- Use structured outputs and validate them with schemas.
- Treat model output as untrusted suggestions. Domain logic validates all proposed task changes.
- AI must distinguish observed facts from assumptions and mention when data is insufficient.
- Never promise exam selection or present readiness as a certainty.
- No AI API key in frontend bundle.
- Log request metadata and errors without unnecessarily logging private journal text.
- Apply rate limits and per-user usage limits.
- Graceful fallback when model provider is unavailable.

### FR-015 — Theme and accessibility
- Light, dark, and system theme options.
- Persist preference in local storage for theme only, or user profile if cross-device persistence is desired.
- Respect `prefers-reduced-motion`.
- Responsive desktop, tablet, and mobile layouts.
- Keyboard navigation, visible focus, labels, accessible chart descriptions, semantic landmarks, adequate contrast.
- Do not communicate status by color alone.

### FR-016 — Notifications (later MVP if time permits)
- In-app reminders for tasks and due revisions.
- Email/push notifications are optional future scope.
- User can disable notifications and configure quiet hours.
- Do not send reminders during configured quiet hours.

### FR-017 — Export and account lifecycle (later)
- Export personal data to JSON/CSV/Markdown.
- Account deletion workflow with clear warning and cascading deletion/anonymisation policy.
- Do not delete shared syllabus reference data when one candidate deletes their account.

## 7. Non-functional requirements

### FR-018 — Bring Your Own API Key (BYOK)
- Support a user's own API key for supported providers, with Gemini first.
- Verify keys server-side; encrypt credentials at rest; return only connection status and masked suffix.
- Let users rotate or disconnect credentials.
- Explain provider billing, limits, and that requests are sent to the selected provider.
- On invalid key, rate limit, or quota exhaustion, show an actionable error; never silently switch to a platform key.
- Keep AI calls server-side and user-scoped. Core non-AI features remain available if AI is disabled.
- Test isolation, rotation, disconnect, and prevention of secret leakage.

### FR-019 — Design consistency
- Use Linear-inspired structure, Notion-inspired diary readability, and Airtable-inspired structured data views, adapted into one PrepMate design system.
- Preserve navy sidebar, neutral surfaces, restrained indigo accents, rounded cards, and study-first hierarchy.
- Support Light, Dark, and System themes.

- Security: Firebase token verification on backend; user ownership checks; validation; rate limits; secure headers; no secrets in client; safe error messages.
- Reliability: database migrations, idempotent operations for rewards and session creation, explicit error handling.
- Performance: paginate history, query by indexed user/date fields, avoid fetching all records to compute dashboard.
- Maintainability: modular monolith, services separated from controllers, shared domain types where practical.
- Observability: structured logs with request ID; redact tokens and sensitive content.
- Accessibility: target WCAG 2.2 AA practices where practical.
- Portability: environment-driven configuration; no machine-specific paths.
- Privacy: collect only necessary data; private user records by default.

## 8. Key product metrics
- Onboarding completion.
- Weekly plan created.
- Daily task completion and plan adherence.
- Number of reschedule proposals accepted/edited/rejected.
- Revision completion.
- Mock tests logged and analysed.
- 7-day and 28-day return rate.
- User-reported usefulness of recommendations.
- Do not optimise solely for time spent in the app.

## 9. MVP acceptance checklist
- [ ] Google authentication works and backend verifies identity.
- [ ] Private records are user-scoped and cross-user access tests pass.
- [ ] User can create and edit a weekly plan and daily tasks.
- [ ] User can log study sessions and reflections.
- [ ] Syllabus topic progress and exam mappings work with source status.
- [ ] Missed-task reschedule previews changes and capacity warnings.
- [ ] Rest days affect scheduling without punitive lockouts.
- [ ] Mock results, errors, and revisions persist.
- [ ] Dashboard and charts use persisted data.
- [ ] XP is idempotent and based on meaningful events.
- [ ] Theme switch works across routes and persists.
- [ ] Empty, loading, error, and success states exist.
- [ ] Setup docs, migrations, seeds, and tests are provided.
