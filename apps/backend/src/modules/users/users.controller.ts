import type { Request, Response, NextFunction } from 'express'
import * as usersService from './users.service'

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await usersService.getProfile(req.user.id)
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await usersService.updateProfile(req.user.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export async function getPreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const prefs = await usersService.getPreferences(req.user.id)
    res.json(prefs)
  } catch (err) {
    next(err)
  }
}

export async function updatePreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const prefs = await usersService.updatePreferences(req.user.id, req.body)
    res.json(prefs)
  } catch (err) {
    next(err)
  }
}

export async function completeOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await usersService.completeOnboarding(req.user.id, req.body)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
