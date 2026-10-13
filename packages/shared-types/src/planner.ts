import { z } from 'zod'

// ── Task types & statuses ─────────────────────────────────────────────────────

export const TaskStatusSchema = z.enum([
  'planned',
  'in_progress',
  'completed',
  'skipped',
  'cancelled',
  'deferred',
])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

export const TaskTypeSchema = z.enum([
  'learn',
  'practice',
  'revision',
  'mock_test',
  'mock_analysis',
  'admin',
  'custom',
])
export type TaskType = z.infer<typeof TaskTypeSchema>

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical'])
export type Priority = z.infer<typeof PrioritySchema>

// ── Task ──────────────────────────────────────────────────────────────────────

export const StudyTaskSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  weeklyPlanId: z.string().uuid().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  taskType: TaskTypeSchema,
  status: TaskStatusSchema,
  priority: PrioritySchema,
  estimatedMinutes: z.number().int().min(1).max(720),
  scheduledDate: z.string().nullable(), // YYYY-MM-DD in user's timezone
  dueDate: z.string().nullable(),       // YYYY-MM-DD
  subjectId: z.string().uuid().nullable(),
  topicId: z.string().uuid().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type StudyTask = z.infer<typeof StudyTaskSchema>

export const CreateTaskSchema = StudyTaskSchema.omit({
  id: true,
  userId: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: TaskStatusSchema.default('planned'),
  priority: PrioritySchema.default('medium'),
})
export type CreateTaskPayload = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = CreateTaskSchema.partial()
export type UpdateTaskPayload = z.infer<typeof UpdateTaskSchema>

// ── Weekly Plan ───────────────────────────────────────────────────────────────

export const WeeklyPlanStatusSchema = z.enum(['draft', 'active', 'completed', 'archived'])
export type WeeklyPlanStatus = z.infer<typeof WeeklyPlanStatusSchema>

export const WeeklyPlanSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  weekStartDate: z.string(), // YYYY-MM-DD Monday
  status: WeeklyPlanStatusSchema,
  targetMinutes: z.number().int().min(0),
  version: z.number().int().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tasks: z.array(StudyTaskSchema).optional(),
})
export type WeeklyPlan = z.infer<typeof WeeklyPlanSchema>

export const CreateWeeklyPlanSchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  targetMinutes: z.number().int().min(60).default(600),
})
export type CreateWeeklyPlanPayload = z.infer<typeof CreateWeeklyPlanSchema>
