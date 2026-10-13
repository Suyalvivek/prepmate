import { z } from 'zod'

// ── Standard API Response Envelope ───────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.unknown()).optional(),
    requestId: z.string().optional(),
  }),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
})
export type PaginationParams = z.infer<typeof PaginationSchema>

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
  })
