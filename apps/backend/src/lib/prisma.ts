import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

declare global {
  // Prevent multiple Prisma instances during hot reload in dev
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
        : ['warn', 'error'],
  })

if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma
  // Log slow queries in dev
  prisma.$on('query' as never, (e: { duration: number; query: string }) => {
    if (e.duration > 200) {
      logger.warn({ duration: e.duration, query: e.query }, 'Slow query detected')
    }
  })
}

export async function connectDatabase() {
  try {
    await prisma.$connect()
    logger.info('Database connected')
  } catch (err) {
    logger.error({ err }, 'Database connection failed')
    process.exit(1)
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
  logger.info('Database disconnected')
}
