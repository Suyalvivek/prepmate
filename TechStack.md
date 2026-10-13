# Technology Stack

## 1. Recommended stack

| Layer | Technology | Purpose |
|---|---|---|
| Language | TypeScript | Shared type safety across frontend and backend |
| Frontend | React + Vite | Fast SPA development |
| Routing | React Router | Public/authenticated route handling |
| Styling | Tailwind CSS | Consistent utility-first styling |
| UI primitives | shadcn/ui + Radix UI | Accessible, composable controls |
| Icons | Lucide React | Consistent icon set |
| Server state | TanStack Query | API caching, mutations, invalidation |
| Local UI state | React state; Zustand only if justified | Dialogs, local filters, small cross-page state |
| Forms | React Hook Form + Zod | Validated forms |
| Charts | Recharts | Study and performance analytics |
| Calendar | Accessible calendar component / custom planner grid | Weekly and monthly views |
| Authentication | Firebase Authentication | Google sign-in |
| Backend | Node.js + Express + TypeScript | REST API and domain services |
| Validation | Zod | Request and AI output validation |
| Database | PostgreSQL | Relational exam, syllabus, planner, and user data |
| ORM/migrations | Prisma | Schema, migrations, typed queries |
| AI | Provider adapter (Gemini or other approved API) | AI mentor and structured recommendations |
| Testing | Vitest, React Testing Library, Supertest; Playwright for critical flows | Unit, integration, and end-to-end tests |
| Lint/format | ESLint + Prettier | Consistent code quality |
| Logging | Pino or equivalent structured logger | Server observability |
| Security middleware | Helmet, CORS allowlist, rate limiting | API hardening |
| Deployment | Any suitable static host + Node host + managed PostgreSQL | Keep deployment portable |

## 2. Key decisions

## AI agent and BYOK decisions
- Use a single LangGraph study-mentor workflow with conditional routes for planning, analysis, revision, and Q&A; avoid multiple autonomous agents in the MVP.
- Use LangChain integrations where useful, not for every backend operation.
- Keep calculations, permissions, scheduling constraints, and database writes deterministic.
- Add a backend provider factory. Gemini is first; other providers are added only when supported and tested.
- Store BYOK credentials encrypted using a managed secrets service/KMS where practical, or authenticated encryption with keys outside the database.
- Never return or log saved keys. Never put provider secrets in `VITE_` variables.
- Do not silently fall back to a platform key that could incur unexpected charges.

- Use PostgreSQL because exam-topic relationships, user progress, schedule revisions, and analytics benefit from relational constraints and transactions.
- Use Firebase Authentication for Google sign-in. Do not also add Clerk or custom JWT issuance unless a documented requirement changes the decision.
- Verify Firebase ID tokens on the API with Firebase Admin SDK.
- Use the AI provider only from the backend.
- Use TanStack Query for remote data; do not duplicate server state in Zustand.
- Prefer server-derived analytics for correctness. Client charts should display API data.
- Use UTC timestamps in storage and the user's configured timezone for day/week boundaries.
- Avoid microservices and unnecessary infrastructure for the MVP.

## 3. Environment variables
Frontend `.env` values must use Vite's public prefix and contain only public Firebase client configuration and API base URL, for example:
- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Backend variables:
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `FIREBASE_PROJECT_ID`
- Firebase Admin credentials via platform identity/application default credentials where possible; if a service account is used locally, keep its path/secret outside version control.
- `AI_PROVIDER`
- `AI_API_KEY`
- `AI_MODEL`
- `CORS_ORIGINS`
- `LOG_LEVEL`

Do not put AI keys, database URLs, or Firebase Admin private credentials in any `VITE_` variable. Firebase client config is public configuration, but security must rely on authentication, API checks, and appropriate Firebase project configuration—not secrecy of the client config.

## 4. Version policy
- Use mutually compatible stable versions at implementation time.
- Pin dependencies via lockfile.
- Do not upgrade major versions opportunistically mid-build.
- Document any deviation from this stack and why it is needed.
