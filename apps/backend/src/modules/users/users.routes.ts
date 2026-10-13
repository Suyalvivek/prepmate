import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validate'
import { UpdateUserSchema, UpdatePreferenceSchema, OnboardingPayloadSchema } from '@prepmate/shared-types'
import * as usersController from './users.controller'

export const usersRouter = Router()

// All user routes require authentication
usersRouter.use(authenticate)

// Profile
usersRouter.get('/me', usersController.getMe)
usersRouter.patch('/me', validate(UpdateUserSchema), usersController.updateMe)

// Preferences
usersRouter.get('/me/preferences', usersController.getPreferences)
usersRouter.patch('/me/preferences', validate(UpdatePreferenceSchema), usersController.updatePreferences)

// Onboarding
usersRouter.post('/me/onboarding', validate(OnboardingPayloadSchema), usersController.completeOnboarding)
