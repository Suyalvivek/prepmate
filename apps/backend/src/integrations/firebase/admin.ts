import admin from 'firebase-admin'
import { env } from '../../config/env'
import { logger } from '../../lib/logger'

let initialized = false

export function initFirebaseAdmin() {
  if (initialized) return
  initialized = true

  if (env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Option A: service account file path (local dev)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID,
    })
    logger.info('Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS')
  } else if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY && env.FIREBASE_PROJECT_ID) {
    // Option B: inline credentials (CI / production)
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in env vars
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
    logger.info('Firebase Admin initialized via inline credentials')
  } else {
    logger.warn(
      'Firebase Admin NOT initialized — set GOOGLE_APPLICATION_CREDENTIALS or ' +
        'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY. ' +
        'Protected routes will reject all requests.'
    )
  }
}

export { admin }
