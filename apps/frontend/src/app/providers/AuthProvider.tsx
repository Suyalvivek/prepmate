import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { apiClient } from '@/lib/api-client'
import { queryClient } from '@/lib/query-client'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  onboardingCompleted: boolean
  setOnboardingCompleted: (completed: boolean) => void
  refreshProfile: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthState | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          // Bootstrap: create/update local profile and check onboarding status
          const profile = await apiClient.get<{ onboardingCompleted: boolean }>('/me')
          setOnboardingCompleted(profile.onboardingCompleted)
        } catch {
          // Profile fetch failing shouldn't block the auth state from resolving
          setOnboardingCompleted(false)
        }
      } else {
        setOnboardingCompleted(false)
        // Clear all cached user data on sign-out
        queryClient.clear()
      }

      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged will handle the rest
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.')
      }
    }
  }

  const refreshProfile = async () => {
    try {
      const profile = await apiClient.get<{ onboardingCompleted: boolean }>('/me')
      setOnboardingCompleted(profile.onboardingCompleted)
    } catch {
      // ignore
    }
  }

  const signOutUser = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        onboardingCompleted,
        setOnboardingCompleted,
        refreshProfile,
        signInWithGoogle,
        signOutUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
