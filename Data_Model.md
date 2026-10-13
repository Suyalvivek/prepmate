# Data Model and Domain Entities

This is a proposed relational model, not a requirement to implement every entity on day one. Use Prisma migrations and review constraints against actual feature flows.

## 1. Identity and preferences
### User
- `id` UUID primary key
- `firebaseUid` unique, required
- `email`
- `displayName`
- `avatarUrl` nullable
- `timezone` default configured on onboarding
- `role` candidate/admin (server controlled)
- `createdAt`, `updatedAt`, `deletedAt` nullable

### UserPreference
- `id`, `userId` unique FK
- `theme`: system/light/dark
- `dailyStudyMinutes`
- `weeklyStudyMinutes`
- `preferredStudyDays` JSON or normalised table
- `preferredTimeWindows` JSON initially
- `monthlyRestDayAllowance` default 3, configurable
- `notificationSettings` JSON
- `createdAt`, `updatedAt`

## 2. Shared reference data
### Exam
- `id`, `code` unique, `name`, `organisation`, `description`, `isActive`

### ExamStage
- `id`, `examId`, `code`, `name`, `sortOrder`, `sourceId` nullable

### Subject
- `id`, `name` unique or canonical slug, `description` nullable

### Topic
- `id`, `subjectId`, `parentTopicId` nullable, `slug`, `name`, `description`, `sortOrder`
- Use parent relation for nested topic/subtopic hierarchy if adequate.

### ExamTopicMapping
- `id`, `examStageId`, `topicId`
- `relevanceType`: common_core / related / exam_specific / unverified
- `depthNote` nullable
- `verificationStatus`: verified / needs_review / sample
- `sourceId` nullable, `verifiedAt` nullable
- unique constraint on exam stage + topic where appropriate

### ContentSource
- `id`, `title`, `url`, `publisher`, `publishedAt` nullable, `accessedAt`, `notes`

## 3. User selections and progress
### UserExam
- `id`, `userId`, `examId`, `targetDate` nullable, `isPrimary`, `createdAt`
- unique user + exam

### TopicProgress
- `id`, `userId`, `topicId`
- `learningStatus`: not_started / learning / practising / completed
- `mastery`: unknown / weak / developing / strong
- `confidence` nullable, constrained to valid range if used
- `lastPractisedAt` nullable, `nextRevisionAt` nullable
- `notes` nullable, `updatedAt`
- unique user + topic
- Progress belongs to a canonical topic, not duplicated per exam. Exam-specific depth may later require a separate user/exam/topic progress entity.

## 4. Planning
### WeeklyPlan
- `id`, `userId`, `weekStartDate`, `status`, `targetMinutes`, `version`, `createdAt`, `updatedAt`
- unique user + weekStartDate where appropriate

### WeeklyGoal
- `id`, `weeklyPlanId`, `subjectId` nullable, `topicId` nullable, `goalType`, `targetValue`, `unit`, `completedValue`

### StudyTask
- `id`, `userId`, `weeklyPlanId` nullable, `title`, `description` nullable
- `taskType`, `status`, `priority`, `estimatedMinutes`
- `scheduledStartAt` nullable, `scheduledEndAt` nullable, `dueDate` nullable
- `subjectId` nullable, `topicId` nullable
- `sourceTaskId` nullable for generated/copied tasks if needed
- `completedAt` nullable, `createdAt`, `updatedAt`, `archivedAt` nullable
- Use timestamps in UTC; derive local date in user's timezone.
- Index user + scheduled date/status and user + due date.

### ScheduleProposal
- `id`, `userId`, `weeklyPlanId` nullable, `basePlanVersion`, `algorithmVersion`, `strategy`, `status`
- `proposalPayload` JSON, `warnings` JSON, `createdAt`, `acceptedAt` nullable, `rejectedAt` nullable
- Proposal payload stores proposed moves and human-readable reasons; validate before acceptance.

### ScheduleRevision
- `id`, `userId`, `proposalId` nullable, `planVersionBefore`, `planVersionAfter`, `changeSummary` JSON, `createdAt`
- Supports audit/history and undo design later.

### RestDay
- `id`, `userId`, `localDate`, `type` full/light/exceptional, `note` nullable, `createdAt`
- unique user + localDate.

## 5. Study and assessment
### StudySession
- `id`, `userId`, `taskId` nullable, `topicId` nullable, `subjectId` nullable
- `startedAt`, `endedAt` nullable, `durationSeconds`, `status`, `notes` nullable
- `createdAt`, `updatedAt`

### MockTest
- `id`, `userId`, `examId` nullable, `examStageId` nullable, `title`, `testDate`
- `durationSeconds` nullable, `score` nullable, `maxScore` nullable
- `correctCount` nullable, `incorrectCount` nullable, `unattemptedCount` nullable
- `markingScheme` JSON nullable, `notes` nullable, `createdAt`, `updatedAt`

### MockTestTopicResult
- `id`, `mockTestId`, `topicId`, `attempted`, `correct`, `incorrect`, `timeSpentSeconds` nullable

### Mistake
- `id`, `userId`, `mockTestId` nullable, `topicId` nullable
- `category`, `questionReference` nullable, `userReasoning` nullable
- `correctExplanation` nullable, `resolutionNotes` nullable
- `nextReviewAt` nullable, `resolvedAt` nullable, `createdAt`, `updatedAt`

### RevisionItem
- `id`, `userId`, `topicId` nullable, `mistakeId` nullable, `title`, `content` nullable
- `dueAt`, `lastReviewedAt` nullable, `intervalDays`, `easeFactor` nullable
- `status`, `createdAt`, `updatedAt`

### RevisionReview
- `id`, `revisionItemId`, `userId`, `rating` again/difficult/good/easy, `reviewedAt`, `nextDueAt`

## 6. Diary and gamification
### JournalEntry
- `id`, `userId`, `localDate`, `wins` nullable, `difficulties` nullable
- `distractions` nullable, `lessonsLearned` nullable, `tomorrowIntention` nullable
- `energyRating` nullable and optional
- unique user + localDate

### XPEvent
- `id`, `userId`, `eventType`, `points`, `sourceType`, `sourceId`, `idempotencyKey` unique per user or globally unique
- `createdAt`
- XP total is aggregated from ledger; cache total only if justified.

### Achievement
- `id`, `code` unique, `name`, `description`, `criteria` JSON, `isActive`

### UserAchievement
- `id`, `userId`, `achievementId`, `earnedAt`
- unique user + achievement

## 7. AI usage metadata
### AIRequestLog
- `id`, `userId`, `requestType`, `provider`, `model`, `status`, `latencyMs`, `inputTokenCount` nullable, `outputTokenCount` nullable, `createdAt`
- Do not store raw private prompt/diary text by default.

## 8. Modelling rules

## AI provider configuration and credentials
- `UserAIConfiguration`: user ID, provider, model, key source, connection status, masked suffix, verification timestamp, and timestamps. Never store plaintext credentials in this table.
- Prefer a managed secrets service/KMS and store only a secret reference. If encrypted DB storage is chosen, store ciphertext, nonce, authentication tag, key version, provider, user ID, and timestamps.
- Use authenticated encryption and keep encryption keys outside PostgreSQL. Restrict access to the backend provider service. Support credential rotation and deletion.
- Never expose credentials through normal user APIs or include them in logs. Usage records may include provider/model, status, latency, and usage counts, but not full keys or raw prompts by default.

- Add `userId` to private entities for direct ownership and query efficiency where appropriate, but validate parent ownership too.
- Add foreign keys, unique constraints, and indexes.
- Use enums for constrained status fields when appropriate.
- Avoid JSON for data that needs joins, constraints, filtering, or analytics; JSON is suitable for flexible settings/proposal snapshots.
- Shared reference data and user-specific progress must remain separate.
- Review cascade deletion rules carefully.
- Use soft deletion/archive only where history matters; document retention.
- Use UTC timestamps for instants and explicit local-date values for diary/rest-day calendar semantics.
