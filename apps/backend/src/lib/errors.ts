// Centralised application errors
// Keeps error codes stable and stack traces out of API responses

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: unknown[]
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const Errors = {
  // Auth
  UNAUTHORIZED: (msg = 'Authentication required') =>
    new AppError('UNAUTHORIZED', msg, 401),
  FORBIDDEN: (msg = 'Access denied') =>
    new AppError('FORBIDDEN', msg, 403),

  // Resources
  NOT_FOUND: (resource = 'Resource') =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),
  CONFLICT: (msg = 'Conflict') =>
    new AppError('CONFLICT', msg, 409),

  // Validation
  VALIDATION: (details: unknown[]) =>
    new AppError('VALIDATION_ERROR', 'Validation failed. Please check the submitted data.', 422, details),

  // Scheduling
  STALE_PLAN: () =>
    new AppError(
      'STALE_PLAN_VERSION',
      'The plan has changed since this proposal was created. Please refresh and try again.',
      409
    ),

  // Server
  INTERNAL: (msg = 'An unexpected error occurred') =>
    new AppError('INTERNAL_ERROR', msg, 500),
}
