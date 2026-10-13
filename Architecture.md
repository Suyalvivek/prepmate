# Architecture
## Adaptive SSC Study Planner

## 1. Architecture goals
- Support a single candidate today and many independent users later.
- Keep the first release simple to develop and deploy.
- Preserve strong user-data isolation.
- Separate shared reference data (exam syllabi) from private user data.
- Make scheduling deterministic and testable; use AI as an assistant, not the source of truth.
- Enable future integrations without starting with microservices.

## 2. Recommended architecture
Use a **modular monolith** with a React SPA, a Node.js/Express TypeScript API, PostgreSQL, Prisma, Firebase Authentication, and a server-side AI provider adapter.

```text
Browser
  ├── React + TypeScript + Vite
  ├── Firebase client SDK (Google sign-in)
  └── API client (Firebase ID token in Authorization header)
             |
             v
Node.js + Express + TypeScript API
  ├── Authentication middleware (verify Firebase ID token)
  ├── Request validation / rate limits / request ID
  ├── Modules
  │    ├── Users & Preferences
  │    ├── Exams & Syllabus
  │    ├── Planner & Tasks
  │    ├── Scheduling & Rescheduling
  │    ├── Study Sessions
  │    ├── Mock Tests & Error Notebook
  │    ├── Revisions
  │    ├── Analytics
  │    ├── Gamification
  │    └── AI Mentor
  ├── Domain services / policies
  └── Prisma data access
             |
             v
PostgreSQL
  ├── Shared reference data: exams, subjects, topics, mappings, sources
  └── User-owned data: profiles, plans, tasks, logs, progress, tests, diary

External services:
  ├── Firebase Authentication
  └── AI provider API (called only by backend)
```

## 3. Why modular monolith
Do not use microservices for the MVP. Modules can be separated internally with explicit service boundaries. A single API and database simplify local development, migrations, transactions, tests, and deployment. If usage later justifies separation, extract a module only after observing a real scaling or ownership need.

## 4. Multi-user model
- Firebase UID is the external identity key.
- A local `User` record maps to a Firebase UID with a unique constraint.
- Every private row includes `userId`, either directly or through a parent relation whose ownership is checked.
- Every private query derives user identity from verified token claims, never from an arbitrary client-supplied `userId`.
- Shared syllabus records are read-only for candidates; modifications require a protected admin/content workflow.
- Unique constraints and indexes include user-scoped dimensions where appropriate.
- Test cross-user read, update, delete, and indirect parent-child access.
- If organisations/coaching centres are introduced later, add an explicit tenant/organisation model and membership/role checks. Do not confuse ordinary multi-user support with organisation tenancy.

## 5. Authentication and request flow
1. Frontend signs in using Firebase Authentication and Google provider.
2. Firebase client SDK obtains an ID token.
3. API client attaches `Authorization: Bearer <idToken>`.
4. Backend verifies the token with Firebase Admin SDK.
5. Middleware upserts/loads local user profile using verified UID.
6. Route validates request body/params/query.
7. Service enforces ownership and business rules.
8. Prisma executes queries/transactions.
9. API returns a stable response shape with request ID where appropriate.
10. Errors are translated to safe, consistent API errors; do not return stack traces in production.

## 6. Data ownership boundaries
### Shared reference data
- Exam, ExamStage, Subject, Topic, ExamTopicMapping, ContentSource, SyllabusVersion.
- Shared reference data is not deleted when a user deletes their account.

### Private user data
- User profile/preferences, selected exams, weekly plans, daily tasks, study sessions, topic progress, mock tests, question mistakes, revision items, journal entries, XP ledger, achievements, schedule revisions, AI usage metadata.

## 7. Scheduling domain
Keep scheduling logic in a pure domain service where possible:
- Input: candidate preferences, available minutes, existing tasks, goals, rest days, deadlines, and strategy.
- Output: proposed task placements, deferred tasks, capacity warnings, and human-readable reasons.
- It must not write to the database during proposal generation.
- Accepting a proposal runs a transaction: validate plan version, persist task changes, create revision/audit record, and update relevant derived records.
- Use optimistic concurrency/version checking to prevent stale proposals overwriting a newer plan.
- Do not let the AI directly apply mutations.
- Scheduler must be deterministic for the same input and algorithm version.

## 8. AI boundary

## AI agent, provider boundary, and BYOK
- Start with one LangGraph workflow with conditional paths for planner, analyst, revision coach, and study Q&A.
- Use LangChain integrations for model calls, tools, structured outputs, and retrieval where useful.
- CRUD, syllabus-overlap calculations, analytics formulas, and schedule validation remain normal backend services.
- Resolve provider/model from the authenticated user's configuration.
- BYOK keys are verified server-side and encrypted before persistence. Prefer a managed secrets service/KMS; otherwise use authenticated encryption with keys kept outside PostgreSQL.
- Never return full keys to the frontend, log them, or place them in URLs/errors/traces.
- Never silently fall back to a platform key. Tell the user if their key is invalid or out of quota.
- AI outputs are untrusted suggestions and must pass through authenticated domain services.

- Create an `AIProvider` interface and a provider implementation behind the backend.
- AI request receives minimum required, redacted user context.
- Validate structured response with Zod or equivalent.
- AI can return explanations and recommendations, but scheduling service enforces all capacity and priority rules.
- Apply rate limits and usage caps.
- Keep provider keys only in server environment.
- Store metadata such as model, latency, request type, token usage if available, and status; avoid retaining private journal text in logs by default.

## 9. API versioning and conventions
- Prefix routes with `/api/v1`.
- JSON request/response.
- Validate every write payload.
- Use pagination for logs, sessions, tasks, and test history.
- Standard error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields.",
    "details": [],
    "requestId": "..."
  }
}
```
- Avoid leaking whether another user's record exists. Return 404 for inaccessible private resources.
- Use ISO 8601 timestamps in API contracts; store timestamps in UTC and use user's timezone for day boundaries and display.

## 10. Reliability and security
- Firebase Admin token verification.
- Rate limiting for authentication-sensitive and AI routes.
- Helmet, strict CORS allowlist, request-size limits.
- Validate all input with Zod.
- Parameterised access through Prisma; avoid raw SQL unless parameterised and justified.
- No API secrets in frontend environment variables except intentionally public Firebase client config.
- Structured logging with redaction.
- Database migrations checked into version control.
- Backups and retention policy appropriate to deployment.
- Idempotency keys or unique event constraints for XP awards and other retry-prone actions.
- Audit schedule modifications.
- Use transactions for multi-record changes.

## 11. Scaling path
### MVP
- One frontend deployment.
- One API deployment.
- Managed PostgreSQL.
- Firebase Authentication.
- One AI provider integration.
- Scheduled jobs only if needed.

### Growth
- Add caching only after measurement.
- Add background worker/queue for long AI tasks, imports, reminders, and reports.
- Add read replicas or query optimisation when database metrics justify them.
- Separate analytics workload from transactional queries if needed.
- Add object storage if users upload files; validate file types, size, access, and retention.
- Extract services only when independently scaling or deploying a module provides real value.

## 12. Deployment environments
- Local development, staging, production.
- Separate Firebase projects and databases by environment.
- Run migrations as a controlled deployment step.
- Configure allowed frontend origins explicitly.
- Health endpoints: liveness and readiness; readiness may check database connectivity.
- Keep `.env.example` placeholder-only and never commit real credentials.

## 13. Architecture decision records
- ADR-001: Firebase Authentication for Google sign-in; backend verifies Firebase ID tokens.
- ADR-002: PostgreSQL + Prisma for relational syllabus mappings and structured planner data.
- ADR-003: Modular monolith before microservices.
- ADR-004: Deterministic scheduler; AI proposes, domain rules validate.
- ADR-005: Shared syllabus reference data separated from private user progress.
