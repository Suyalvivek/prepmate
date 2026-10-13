# Backend Engineering Specification

## 1. Goals
Provide a secure, versioned REST API with clear modules, deterministic scheduling logic, strict ownership enforcement, and reliable persistence.

## 2. Suggested structure
```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    app.ts
    server.ts
    config/
    middleware/
      authenticate.ts
      validate.ts
      error-handler.ts
      rate-limit.ts
      request-id.ts
    modules/
      users/
      exams/
      syllabus/
      planner/
      scheduler/
      sessions/
      mock-tests/
      revisions/
      analytics/
      journal/
      gamification/
      ai-mentor/
    services/
    integrations/
      firebase/
      ai/
    lib/
    types/
    tests/
```

Each module may have `routes`, `controller`, `service`, `schema`, and `repository` files when useful. Avoid needless boilerplate for trivial modules.

## 3. API conventions
Prefix: `/api/v1`

Representative endpoints:
### User/profile
- `GET /me`
- `PATCH /me`
- `GET /me/preferences`
- `PATCH /me/preferences`

### Exams and syllabus
- `GET /exams`
- `GET /exams/:examId`
- `GET /exams/:examId/syllabus`
- `GET /syllabus/topics/:topicId`
- `GET /syllabus/overlap?examIds=...`
- `PUT /me/topic-progress/:topicId`
- `GET /me/topic-progress`

### Planner/tasks
- `GET /planner/week?weekStart=YYYY-MM-DD`
- `POST /plans`
- `GET /plans/:planId`
- `PATCH /plans/:planId`
- `POST /tasks`
- `PATCH /tasks/:taskId`
- `POST /tasks/:taskId/complete`
- `POST /tasks/:taskId/defer`
- `DELETE /tasks/:taskId` (soft-delete/archive where history matters)

### Scheduling
- `POST /scheduler/proposals`
- `GET /scheduler/proposals/:proposalId`
- `POST /scheduler/proposals/:proposalId/accept`
- `POST /scheduler/proposals/:proposalId/reject`

### Study sessions
- `POST /sessions`
- `PATCH /sessions/:sessionId`
- `POST /sessions/:sessionId/finish`
- `GET /sessions?from=...&to=...&cursor=...`

### Mock tests and mistakes
- `POST /mock-tests`
- `GET /mock-tests`
- `GET /mock-tests/:testId`
- `PATCH /mock-tests/:testId`
- `POST /mock-tests/:testId/mistakes`
- `PATCH /mistakes/:mistakeId`

### Revisions
- `GET /revisions?dueBefore=...`
- `POST /revisions`
- `PATCH /revisions/:revisionId`
- `POST /revisions/:revisionId/review`

### Journal and analytics
- `GET /journal?date=...`
- `PUT /journal/:date`
- `DELETE /journal/:date`
- `GET /analytics/overview?from=...&to=...`
- `GET /analytics/subjects?from=...&to=...`
- `GET /analytics/mock-tests?from=...&to=...`

### Gamification and AI
- `GET /gamification/summary`
- `GET /gamification/achievements`
- `POST /ai/mentor`
- `POST /ai/plan-suggestions`

Endpoint list is a design guide, not a requirement to build every route in the first sprint. Implement routes as features become functional.

## 4. Authentication middleware
- Verify Firebase ID token using Firebase Admin SDK.
- Reject absent, malformed, expired, or invalid tokens.
- Attach verified Firebase UID to request context.
- Resolve local user record from verified UID.
- Never accept `userId` from request body as identity.
- Ensure child resources belong to the authenticated user through direct or parent ownership checks.
- Use 404 for inaccessible private resources to avoid confirming existence.

## 5. Validation and error handling
- Validate params, query strings, and body with Zod.
- Normalise dates and numeric inputs.
- Use a central error handler and stable error codes.
- Return safe messages; do not leak SQL, stack traces, secrets, or provider responses.
- Add request IDs and structured logs.
- Configure CORS with an explicit allowlist, Helmet, request body size limits, and rate limits.

## 6. Scheduling service contract
Create a pure function/service such as:
`proposeSchedule(input: SchedulerInput): SchedulerProposal`

Input includes:
- user timezone and daily capacities;
- tasks with current status, duration, priority, deadlines, and links;
- existing schedule;
- rest/unavailable days;
- remaining weekly goals;
- strategy and scheduling horizon;
- schedule version.

Output includes:
- task moves and proposed dates/time blocks where applicable;
- deferred tasks and reason;
- capacity warnings;
- summary before/after;
- algorithm version and input plan version.

Proposal generation must not mutate stored tasks. On accept:
- verify user ownership;
- verify the plan version is current;
- validate all task moves;
- run a database transaction;
- write schedule revision/audit record;
- update task placement;
- return the accepted version.
If the version is stale, return a conflict and ask the frontend to refresh/review.

## 7. Analytics
- Use database queries/aggregations or dedicated services, not downloading every record to the browser.
- Add indexes for `userId`, dates, statuses, topic IDs, and foreign keys based on actual query patterns.
- Keep analytics definitions documented and consistent.
- Do not compare raw scores across different exam formats without a clear warning.
- Avoid creating a single opaque readiness score.

## 8. AI integration
- Use an interface such as `AIProvider.generateStructuredResponse(input, schema)`.
- Provider-specific code stays in `integrations/ai`.
- Validate outputs with Zod.
- Rate-limit by user and endpoint.
- Set timeouts and graceful fallback.
- Store minimal usage metadata; do not log tokens or full private diary entries by default.
- AI suggestions never bypass scheduling, ownership, validation, or capacity rules.
- Treat prompt content and model responses as untrusted input.

## 9. Database and transactions
- Use Prisma migrations; never rely on `db push` as the production migration strategy.
- Use transactions for schedule acceptance, XP award creation, and operations that span related tables.
- Add unique constraints to prevent duplicate XP events and duplicate daily journal entries per user/date.
- Soft-delete or archive records when audit/history is important.
- Paginate list endpoints.
- Use optimistic concurrency for schedule revisions.

## 10. Testing
- Unit tests: scheduler, revision intervals, XP/idempotency, date-boundary logic, analytics formulas.
- Integration tests: auth middleware, ownership checks, task mutations, proposal acceptance/rejection, user isolation.
- Contract/validation tests for API schemas.
- Use a test database or isolated test schema.
- Never use production user data in tests.


Suggested endpoints:
- `GET /me/ai-config` — provider/model, connected status, masked suffix, and key source; never return the secret.
- `PUT /me/ai-config` — validate provider/model, verify a submitted key server-side, encrypt, and save.
- `DELETE /me/ai-config` — disconnect and remove the credential.

Requirements: submit keys only over HTTPS; prefer a managed secrets service/KMS; redact credentials from logs; never return saved keys; validate provider/model compatibility; never silently use a platform key when the user's key fails; track usage metadata without storing prompts or secrets by default; test isolation, rotation, disconnect, and provider errors.



- Start with one graph and typed state; route requests to planner, analysis, revision, or study Q&A.
- Define narrow tools with validated input/output schemas.
- Tools call domain services and enforce user ownership; no unrestricted SQL or arbitrary HTTP tools.
- Mutations require approval boundaries. Graph checkpointing does not replace database transactions or audit records.

