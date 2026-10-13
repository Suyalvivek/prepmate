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
  enterDemoMode: () => void
  error: string | null
}

const AuthContext = createContext<AuthState | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(() => {
    return localStorage.getItem('prepmate_onboarding_completed') === 'true'
  })
  const [error, setError] = useState<string | null>(null)

  const setOnboardingCompleted = (completed: boolean, uid?: string) => {
    setOnboardingCompletedState(completed)
    const targetUid = uid || user?.uid
    if (completed) {
      localStorage.setItem('prepmate_onboarding_completed', 'true')
      if (targetUid) {
        localStorage.setItem(`prepmate_onboarding_${targetUid}`, 'true')
      }
    } else {
      localStorage.removeItem('prepmate_onboarding_completed')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Immediate cache check to avoid flash of onboarding
        const userCached =
          localStorage.getItem(`prepmate_onboarding_${firebaseUser.uid}`) === 'true' ||
          localStorage.getItem('prepmate_onboarding_completed') === 'true'
        if (userCached) {
          setOnboardingCompletedState(true)
        }

        setUser(firebaseUser)

        try {
          // Bootstrap: create/update local profile and check onboarding status
          const profile = await apiClient.get<{ onboardingCompleted: boolean }>('/me')
          setOnboardingCompleted(profile.onboardingCompleted, firebaseUser.uid)
        } catch {
          if (userCached) {
            setOnboardingCompletedState(true)
          }
        }
      } else {
        setUser(null)
        setOnboardingCompletedState(false)
        localStorage.removeItem('prepmate_onboarding_completed')
        queryClient.clear()
      }

      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        try {
          const profile = await apiClient.get<{ onboardingCompleted: boolean }>('/me')
          setOnboardingCompleted(profile.onboardingCompleted, result.user.uid)
        } catch {
          // Handled in onAuthStateChanged
        }
      }
    } catch (err: unknown) {
      setIsLoading(false)
      const e = err as { code?: string }
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.')
      }
    }
  }

  const refreshProfile = async () => {
    try {
      const profile = await apiClient.get<{ onboardingCompleted: boolean }>('/me')
      setOnboardingCompleted(profile.onboardingCompleted, user?.uid)
    } catch {
      // ignore
    }
  }

  const signOutUser = async () => {
    setUser(null)
    setOnboardingCompletedState(false)
    localStorage.removeItem('prepmate_onboarding_completed')
    await signOut(auth).catch(() => {})
  }

  const enterDemoMode = () => {
    setUser({
      uid: 'demo-aman-101',
      displayName: 'Aman',
      email: 'aman@prepmate.app',
      photoURL: '/assets/aman-avatar.jpg',
    } as unknown as User)
    setOnboardingCompleted(true)
    setIsLoading(false)
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
        enterDemoMode,
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
