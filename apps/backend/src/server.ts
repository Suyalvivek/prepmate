import { createApp } from './app'
import { env } from './config/env'
import { connectDatabase, disconnectDatabase } from './lib/prisma'
import { initFirebaseAdmin } from './integrations/firebase/admin'
import { logger } from './lib/logger'

// Main server entrypoint

async function main() {
  // Initialize external services
  initFirebaseAdmin()
  await connectDatabase()

  const app = createApp()
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 PrepMate API running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`)
    server.close(async () => {
      await disconnectDatabase()
      logger.info('Server closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  console.error('Fatal startup error:', err)
  process.exit(1)
})
