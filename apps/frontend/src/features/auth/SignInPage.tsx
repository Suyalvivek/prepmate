import { useAuth } from '@/app/providers/AuthProvider'
import { GraduationCap, Chrome } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SignInPage() {
  const { signInWithGoogle, isLoading, error } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo + Brand */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">PrepMate</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Your adaptive SSC study operating system
            </p>
          </div>
        </div>

        {/* Sign in card */}
        <div className="pm-card p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your study dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20"
            >
              {error}
            </div>
          )}

          {/* Google sign-in button */}
          <button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-3 rounded-lg border border-border',
              'bg-card px-4 py-3 text-sm font-medium text-foreground',
              'hover:bg-secondary transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Chrome className="h-4 w-4" />
            )}
            {isLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to keep your exam dates and syllabus details{' '}
            <span className="font-medium">verified against official sources</span>.
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground">
          PrepMate helps you plan and track — it does not guarantee exam selection.
        </p>
      </div>
    </div>
  )
}
