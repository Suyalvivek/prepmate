import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './providers/RouteGuards'
import { SignInPage } from '@/features/auth/SignInPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { PlannerPage } from '@/features/planner/PlannerPage'
import { SyllabusPage } from '@/features/syllabus/SyllabusPage'
import { MockTestsPage } from '@/features/mock-tests/MockTestsPage'
import { RevisionsPage } from '@/features/revisions/RevisionsPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { AchievementsPage } from '@/features/achievements/AchievementsPage'
import { JournalPage } from '@/features/journal/JournalPage'
import { MentorPage } from '@/features/mentor/MentorPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────────
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <SignInPage /> },
      { path: '/sign-in', element: <SignInPage /> },
    ],
  },

  // ── Protected routes ───────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      {
        element: <AppShell />,
        children: [
          { path: '/app', element: <DashboardPage /> },
          { path: '/planner', element: <PlannerPage /> },
          { path: '/weekly-planner', element: <PlannerPage /> },
          { path: '/syllabus', element: <SyllabusPage /> },
          { path: '/mock-tests', element: <MockTestsPage /> },
          { path: '/revisions', element: <RevisionsPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
          { path: '/journal', element: <JournalPage /> },
          { path: '/mentor', element: <MentorPage /> },
          { path: '/progress', element: <Navigate to="/analytics" replace /> },
          { path: '/calendar', element: <PlannerPage /> },
          { path: '/achievements', element: <AchievementsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/app" replace /> },
        ],
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
