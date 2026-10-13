import pino from 'pino'
import { env } from '../config/env'

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        // Production: structured JSON, redact sensitive fields
        redact: {
          paths: [
            'req.headers.authorization',
            '*.token',
            '*.key',
            '*.password',
            '*.privateKey',
          ],
          censor: '[REDACTED]',
        },
      }),
})
