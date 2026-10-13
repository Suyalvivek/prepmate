import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

// Shows a blank screen (not a flash of content) while Firebase resolves auth state
function AuthLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading PrepMate…</p>
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, onboardingCompleted } = useAuth()
  const location = useLocation()

  if (isLoading) return <AuthLoading />

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  // After sign-in, redirect new users to onboarding
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { isAuthenticated, isLoading, onboardingCompleted } = useAuth()

  if (isLoading) return <AuthLoading />

  if (isAuthenticated) {
    return <Navigate to={onboardingCompleted ? '/app' : '/onboarding'} replace />
  }

  return <Outlet />
}
