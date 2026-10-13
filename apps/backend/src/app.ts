import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { requestId } from './middleware/request-id'
import { defaultLimiter } from './middleware/rate-limit'
import { errorHandler } from './middleware/error-handler'
import { logger } from './lib/logger'

// Route modules
import { healthRouter } from './modules/health/health.routes'
import { usersRouter } from './modules/users/users.routes'

export function createApp() {
  const app = express()

  // ── Security ──────────────────────────────────────────────────────────────
  app.use(helmet())
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim())
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        if (
          env.NODE_ENV === 'development' &&
          /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
          return callback(null, true)
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
    })
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))

  // ── Observability ─────────────────────────────────────────────────────────
  app.use(requestId)
  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request')
    next()
  })

  // ── Rate limiting ─────────────────────────────────────────────────────────
  app.use('/api/', defaultLimiter)

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use('/api/v1', healthRouter)
  app.use('/api/v1', usersRouter)

  // 404 handler for unknown routes
  app.use((_req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Route not found.' },
    })
  })

  // ── Error handler (must be last) ──────────────────────────────────────────
  app.use(errorHandler)

  return app
}
