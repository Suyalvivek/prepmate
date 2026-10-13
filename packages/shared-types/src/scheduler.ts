import { z } from 'zod'

// ── Scheduler Domain ─────────────────────────────────────────────────────────

export const ScheduleStrategySchema = z.enum([
  'balance',         // spread evenly across remaining week days
  'next_day',        // push to next available day
  'prioritise_high', // keep high-priority, defer low
  'manual',          // one task at a time user-driven
])
export type ScheduleStrategy = z.infer<typeof ScheduleStrategySchema>

export const ProposalStatusSchema = z.enum(['pending', 'accepted', 'rejected', 'expired'])
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>

export const TaskMoveSchema = z.object({
  taskId: z.string().uuid(),
  taskTitle: z.string(),
  fromDate: z.string().nullable(),
  toDate: z.string().nullable(),
  reason: z.string(),
  isDeferred: z.boolean().default(false),
})
export type TaskMove = z.infer<typeof TaskMoveSchema>

export const CapacityWarningSchema = z.object({
  date: z.string(),
  plannedMinutes: z.number(),
  capacityMinutes: z.number(),
  overloadMinutes: z.number(),
})
export type CapacityWarning = z.infer<typeof CapacityWarningSchema>

export const ScheduleProposalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  weeklyPlanId: z.string().uuid().nullable(),
  basePlanVersion: z.number().int(),
  algorithmVersion: z.string(),
  strategy: ScheduleStrategySchema,
  status: ProposalStatusSchema,
  moves: z.array(TaskMoveSchema),
  deferredTasks: z.array(TaskMoveSchema),
  warnings: z.array(CapacityWarningSchema),
  summary: z.object({
    totalMoved: z.number(),
    totalDeferred: z.number(),
    totalRemain: z.number(),
  }),
  createdAt: z.string().datetime(),
  acceptedAt: z.string().datetime().nullable(),
  rejectedAt: z.string().datetime().nullable(),
})
export type ScheduleProposal = z.infer<typeof ScheduleProposalSchema>

export const CreateProposalSchema = z.object({
  weeklyPlanId: z.string().uuid().optional(),
  strategy: ScheduleStrategySchema.default('balance'),
  horizon: z.number().int().min(1).max(14).default(7), // days to look ahead
})
export type CreateProposalPayload = z.infer<typeof CreateProposalSchema>
