import { z } from 'zod'

// ── Syllabus Reference Data ───────────────────────────────────────────────────

export const VerificationStatusSchema = z.enum(['verified', 'needs_review', 'sample'])
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>

export const RelevanceTypeSchema = z.enum([
  'common_core',
  'related',
  'exam_specific',
  'unverified',
])
export type RelevanceType = z.infer<typeof RelevanceTypeSchema>

export const ExamSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  organisation: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
})
export type Exam = z.infer<typeof ExamSchema>

export const SubjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
})
export type Subject = z.infer<typeof SubjectSchema>

export const TopicSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid(),
  parentTopicId: z.string().uuid().nullable(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  sortOrder: z.number().int(),
})
export type Topic = z.infer<typeof TopicSchema>

// ── User Topic Progress ───────────────────────────────────────────────────────

export const LearningStatusSchema = z.enum([
  'not_started',
  'learning',
  'practising',
  'completed',
])
export type LearningStatus = z.infer<typeof LearningStatusSchema>

export const MasterySchema = z.enum(['unknown', 'weak', 'developing', 'strong'])
export type Mastery = z.infer<typeof MasterySchema>

export const TopicProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  topicId: z.string().uuid(),
  learningStatus: LearningStatusSchema,
  mastery: MasterySchema,
  lastPractisedAt: z.string().datetime().nullable(),
  nextRevisionAt: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.string().datetime(),
})
export type TopicProgress = z.infer<typeof TopicProgressSchema>

export const UpsertTopicProgressSchema = z.object({
  learningStatus: LearningStatusSchema.optional(),
  mastery: MasterySchema.optional(),
  nextRevisionAt: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
})
export type UpsertTopicProgressPayload = z.infer<typeof UpsertTopicProgressSchema>
