// Environment configuration — parsed and typed at startup
// Fails fast with clear errors if required variables are missing

import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  TEST_DATABASE_URL: z.string().optional(),

  // Firebase Admin — either GOOGLE_APPLICATION_CREDENTIALS (file path)
  // or the three individual fields below
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  // AI provider (platform key for dev; users supply BYOK in DB)
  AI_PROVIDER: z.enum(['gemini']).default('gemini'),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default('gemini-1.5-pro'),

  // BYOK credential encryption (32-byte hex)
  ENCRYPTION_KEY: z.string().optional(),

  // Security
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
})

function parseEnv() {
  const result = EnvSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    console.error(result.error.flatten().fieldErrors)
    process.exit(1)
  }
  return result.data
}

export const env = parseEnv()
export type Env = typeof env
