import { z } from 'zod'

// ── User & Preferences ────────────────────────────────────────────────────────

export const ThemeSchema = z.enum(['light', 'dark', 'system'])
export type Theme = z.infer<typeof ThemeSchema>

export const UserRoleSchema = z.enum(['candidate', 'admin'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserSchema = z.object({
  id: z.string().uuid(),
  firebaseUid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  timezone: z.string().default('Asia/Kolkata'),
  role: UserRoleSchema.default('candidate'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type User = z.infer<typeof UserSchema>

export const UserPreferenceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  dailyStudyMinutes: z.number().int().min(0).max(1440).default(120),
  weeklyStudyMinutes: z.number().int().min(0).default(600),
  preferredStudyDays: z.array(z.number().int().min(0).max(6)).default([1, 2, 3, 4, 5]),
  monthlyRestDayAllowance: z.number().int().min(0).max(31).default(3),
  notificationSettings: z
    .object({
      enabled: z.boolean().default(true),
      quietHoursStart: z.string().nullable().default(null),
      quietHoursEnd: z.string().nullable().default(null),
    })
    .default({}),
})
export type UserPreference = z.infer<typeof UserPreferenceSchema>

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
})
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>

export const UpdatePreferenceSchema = UserPreferenceSchema.omit({
  id: true,
  userId: true,
}).partial()
export type UpdatePreferencePayload = z.infer<typeof UpdatePreferenceSchema>

// ── Onboarding ────────────────────────────────────────────────────────────────

export const OnboardingPayloadSchema = z.object({
  examIds: z.array(z.string()).min(1, 'Select at least one exam'),
  targetDates: z.record(z.string(), z.string().nullable()).optional(),
  dailyStudyMinutes: z.number().int().min(30).max(1440),
  weeklyStudyMinutes: z.number().int().min(60),
  preferredStudyDays: z.array(z.number().int().min(0).max(6)),
  timezone: z.string(),
})
export type OnboardingPayload = z.infer<typeof OnboardingPayloadSchema>
