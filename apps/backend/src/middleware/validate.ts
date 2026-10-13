import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { Errors } from '../lib/errors'

type ValidateTarget = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const details = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return next(Errors.VALIDATION(details))
    }
    // Replace the target with the parsed (coerced + defaulted) value
    ;(req as Record<string, unknown>)[target] = result.data
    next()
  }
}
