# Frontend Engineering Specification

## 1. Goals
Create a clean, modern, calm, study-oriented application. It should feel like a blend of a focused productivity dashboard, personal diary, and academic planner—not a noisy gamified social app.

## 2. Suggested project structure
```text
frontend/
  public/
  src/
    app/
      App.tsx
      router.tsx
      providers/
    components/
      ui/
      layout/
      feedback/
      charts/
    features/
      auth/
      onboarding/
      dashboard/
      planner/
      syllabus/
      exams/
      sessions/
      mock-tests/
      revisions/
      analytics/
      journal/
      gamification/
      ai-mentor/
      settings/
    hooks/
    lib/
      api-client.ts
      firebase.ts
      query-client.ts
      date-time.ts
      formatters.ts
    schemas/
    types/
    styles/
    main.tsx
```

Use feature-oriented modules. Keep business logic out of page components. Reuse components when it improves consistency, not by making every screen excessively generic.

## 3. Routing
Public:
- `/` landing page
- `/sign-in` authentication entry
- `/privacy` and `/terms` placeholders only if appropriate

Protected:
- `/onboarding`
- `/app` or `/dashboard`
- `/planner/day/:date`
- `/planner/week/:weekStart`
- `/syllabus`
- `/exams`
- `/sessions`
- `/mock-tests`
- `/revisions`
- `/analytics`
- `/journal`
- `/mentor`
- `/settings`

Redirect authenticated users away from sign-in when appropriate. Show a loading state while Firebase auth resolves. Do not flash protected content before authentication status is known.

## 4. Global layout
- Desktop: collapsible left sidebar, top bar with page title/date, quick-add, theme toggle, and user menu.
- Mobile: compact top bar and accessible bottom navigation or drawer.
- Main content uses a readable max-width and consistent spacing.
- Dashboard should prioritise today's next action.
- Keep quote and gamification summaries visually secondary to tasks and revision.
- Use responsive grids and avoid horizontal scrolling for ordinary content.

## 5. Core screens
### Dashboard
- Greeting and date.
- Today's mission with task completion controls.
- Focus timer/quick session action.
- Daily plan progress.
- Due revisions.
- Weekly goal summary.
- Small growth snapshot.
- Daily quote/intention.
- “Review and reschedule” action when tasks remain.

### Planner
- Day and week modes.
- Task creation/edit dialog or sheet.
- Task status, priority, duration, linked subject/topic.
- Weekly goals and workload meter.
- Rest-day indicators.
- Reschedule proposal preview with current versus proposed day, reason, and capacity warning.
- Accept, edit, reject controls.

### Syllabus
- Exam selector and subject navigation.
- Search and filters by status, mastery, revision due, shared/exam-specific, verification status.
- Topic detail with mapped exams, progress, notes/resources, and revision action.
- Clearly distinguish shared topic progress from exam-specific depth.

### Exam overlap
- Compare selected exams by common, related, and exam-specific topics.
- Show mapping source/verification status.
- Avoid misleading percentages if mappings are unverified or syllabus depth differs.

### Mock tests
- List/filter tests.
- Add/edit test form.
- Performance charts and topic breakdown.
- Create mistake/revision from a test.

### Analytics
- Consistency, focused time, plan adherence, syllabus coverage, mastery, mock trends, revisions, and recurring error types as separate panels.
- All charts have labels, empty states, tooltips, and accessible summaries.
- Use comparable date ranges and do not conflate hours with learning.

### Journal
- Calendar/list of private daily reflections.
- Fast entry editor.
- Optional prompts; no forced mood/health fields.

### AI mentor
- Chat-like interaction plus suggested prompts.
- Context and data period clearly shown.
- Explain recommendations with links to relevant app records.
- Display uncertainty and data gaps.
- AI recommendations require confirmation before changing the plan.

### Settings
- Profile, timezone, daily availability, preferred study hours, target exams, rest-day allowance, theme, privacy/export (when implemented), and notification preferences.

## 6. Data fetching and state
- Use TanStack Query for API state, cache, retries, and invalidation.
- Use React Hook Form + Zod for complex forms.
- Use local React state for local dialogs, tabs, and temporary selections.
- Use Zustand only if a clear cross-route client-state requirement appears.
- Avoid storing duplicated derived state; derive totals from canonical data or server aggregates.
- Invalidate/refetch affected queries after mutations.
- Handle stale schedule versions and server conflict responses.

## 7. UX states
Every data-driven screen must include:
- Loading skeleton or progress state.
- Empty state with a clear next action.
- Error state with retry where safe.
- Success feedback.
- Disabled/submitting states.
- Confirmation for destructive actions.
- Optimistic updates only when rollback and conflict handling are safe.

## 8. Accessibility and responsive behaviour
- Semantic HTML, visible focus, keyboard-accessible menus/dialogs, proper labels, and sufficient contrast.
- Do not rely on color alone to communicate completion, priority, or errors.
- Respect reduced motion.
- Make charts readable on small screens and provide text summaries.
- Ensure task movement is possible without drag-and-drop.
- Test common widths including narrow mobile screens.

## 9. Frontend security
- Do not treat route guards as API security.
- Send Firebase ID tokens only to the configured API origin over HTTPS in production.
- Never include AI/database secrets in frontend code.
- Sanitize/render user-generated text safely; avoid unsafe HTML injection.
- Do not log private journal contents or tokens to the console.
