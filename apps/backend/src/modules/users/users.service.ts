import { prisma } from '../../lib/prisma'
import { Errors } from '../../lib/errors'
import type { UpdateUserPayload, UpdatePreferencePayload, OnboardingPayload } from '@prepmate/shared-types'

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firebaseUid: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      timezone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      onboardingCompleted: true,
    },
  })
  if (!user) throw Errors.NOT_FOUND('User')
  return user
}

export async function updateProfile(userId: string, data: UpdateUserPayload) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.displayName ? { displayName: data.displayName } : {}),
      ...(data.timezone ? { timezone: data.timezone } : {}),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      displayName: true,
      timezone: true,
      updatedAt: true,
    },
  })
}

export async function getPreferences(userId: string) {
  const prefs = await prisma.userPreference.findUnique({
    where: { userId },
  })
  if (!prefs) throw Errors.NOT_FOUND('Preferences')
  return prefs
}

export async function updatePreferences(userId: string, data: UpdatePreferencePayload) {
  return prisma.userPreference.upsert({
    where: { userId },
    create: { userId, ...data },
    update: { ...data, updatedAt: new Date() },
  })
}

export async function completeOnboarding(userId: string, payload: OnboardingPayload) {
  return prisma.$transaction(async (tx) => {
    // Update user timezone and mark onboarding done
    await tx.user.update({
      where: { id: userId },
      data: {
        timezone: payload.timezone,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
    })

    // Update study preferences
    await tx.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        dailyStudyMinutes: payload.dailyStudyMinutes,
        weeklyStudyMinutes: payload.weeklyStudyMinutes,
        preferredStudyDays: JSON.stringify(payload.preferredStudyDays),
      },
      update: {
        dailyStudyMinutes: payload.dailyStudyMinutes,
        weeklyStudyMinutes: payload.weeklyStudyMinutes,
        preferredStudyDays: JSON.stringify(payload.preferredStudyDays),
        updatedAt: new Date(),
      },
    })

    // Upsert selected exams (resolve by code or id)
    for (const examIdOrCode of payload.examIds) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(examIdOrCode)
      const exam = await tx.exam.findFirst({
        where: isUuid ? { id: examIdOrCode } : { code: examIdOrCode },
      })
      if (!exam) continue

      const targetDate = payload.targetDates?.[examIdOrCode]
        ? new Date(payload.targetDates[examIdOrCode]!)
        : null

      await tx.userExam.upsert({
        where: { userId_examId: { userId, examId: exam.id } },
        create: {
          userId,
          examId: exam.id,
          targetDate,
          isPrimary: payload.examIds.indexOf(examIdOrCode) === 0,
        },
        update: {
          targetDate,
        },
      })
    }

    return { success: true, onboardingCompleted: true }
  })
}
