// Authentication middleware
// Verifies Firebase ID token → upserts local User → attaches req.user

import type { Request, Response, NextFunction } from 'express'
import { admin } from '../integrations/firebase/admin'
import { prisma } from '../lib/prisma'
import { Errors } from '../lib/errors'
import { logger } from '../lib/logger'

// Extend Express Request with our auth context
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string          // local DB UUID
        firebaseUid: string
        email: string
        role: string
      }
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(Errors.UNAUTHORIZED())
  }

  const idToken = authHeader.slice(7)

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)

    // Upsert local user profile from verified Firebase claims
    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? '',
        displayName: decoded.name ?? null,
        avatarUrl: decoded.picture ?? null,
        timezone: 'Asia/Kolkata', // default; updated during onboarding
        role: 'candidate',
        preferences: {
          create: {}, // create default preferences record
        },
      },
      update: {
        // Keep email and avatar in sync with Firebase
        email: decoded.email ?? undefined,
        avatarUrl: decoded.picture ?? undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        role: true,
      },
    })

    req.user = user
    next()
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    logger.warn({ code: error.code, msg: error.message }, 'Token verification failed')

    // Distinguish expired vs. invalid tokens for better UX messaging
    if (error.code === 'auth/id-token-expired') {
      return next(Errors.UNAUTHORIZED('Session expired. Please sign in again.'))
    }
    return next(Errors.UNAUTHORIZED('Invalid authentication token.'))
  }
}
