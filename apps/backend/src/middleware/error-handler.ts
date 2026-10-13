import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import { logger } from '../lib/logger'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string | undefined

  if (err instanceof AppError) {
    // Known operational error — log at appropriate level
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, 'Application error')
    } else {
      logger.warn({ code: err.code, statusCode: err.statusCode, details: err.details, requestId }, err.message)
    }

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    })
  }

  // Unknown / programming error — never leak internals
  logger.error({ err, requestId }, 'Unexpected error')
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
      ...(requestId ? { requestId } : {}),
    },
  })
}
