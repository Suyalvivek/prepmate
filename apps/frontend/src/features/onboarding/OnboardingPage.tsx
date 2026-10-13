import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { apiClient } from '@/lib/api-client'
import { GraduationCap, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const SSC_EXAMS = [
  { id: 'SSC_CGL', name: 'SSC CGL', desc: 'Combined Graduate Level' },
  { id: 'SSC_CPO', name: 'SSC CPO', desc: 'Central Police Organisations' },
  { id: 'SSC_CHSL', name: 'SSC CHSL', desc: 'Combined Higher Secondary Level' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface OnboardingData {
  selectedExamCodes: string[]
  dailyHours: number
  preferredDays: number[]
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { signOutUser, setOnboardingCompleted, onboardingCompleted } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (onboardingCompleted) {
      navigate('/app', { replace: true })
    }
  }, [onboardingCompleted, navigate])

  const [data, setData] = useState<OnboardingData>({
    selectedExamCodes: [],
    dailyHours: 3,
    preferredDays: [1, 2, 3, 4, 5], // Mon–Fri default
  })

  const toggleExam = (code: string) => {
    setData((d) => ({
      ...d,
      selectedExamCodes: d.selectedExamCodes.includes(code)
        ? d.selectedExamCodes.filter((c) => c !== code)
        : [...d.selectedExamCodes, code],
    }))
  }

  const toggleDay = (day: number) => {
    setData((d) => ({
      ...d,
      preferredDays: d.preferredDays.includes(day)
        ? d.preferredDays.filter((d) => d !== day)
        : [...d.preferredDays, day],
    }))
  }

  const handleSubmit = async () => {
    if (data.selectedExamCodes.length === 0) {
      setError('Please select at least one exam.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const dailyStudyMinutes = Math.round(data.dailyHours * 60)
      const weeklyStudyMinutes = Math.round(data.dailyHours * data.preferredDays.length * 60)

      await apiClient.post('/me/onboarding', {
        examIds: data.selectedExamCodes,
        dailyStudyMinutes,
        weeklyStudyMinutes,
        preferredStudyDays: data.preferredDays,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      })

      setOnboardingCompleted(true)
      navigate('/app', { replace: true })
    } catch (err) {
      console.error('Onboarding save error:', err)
      const message =
        err instanceof Error ? err.message : 'Failed to save preferences. Please try again.'
      setError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">PrepMate</span>
          </div>
          <button
            onClick={() => signOutUser()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  s <= step ? 'bg-primary w-8' : 'bg-border w-4'
                )}
              />
            </div>
          ))}
          <span className="ml-1 text-xs text-muted-foreground">Step {step} of 3</span>
        </div>

        {/* Card */}
        <div className="pm-card p-8">
          {/* Step 1: Choose exams */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Which exams are you preparing for?</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select one or more. You can update this later in Settings.
                </p>
              </div>
              <div className="space-y-3">
                {SSC_EXAMS.map((exam) => {
                  const selected = data.selectedExamCodes.includes(exam.id)
                  return (
                    <button
                      key={exam.id}
                      onClick={() => toggleExam(exam.id)}
                      aria-pressed={selected}
                      className={cn(
                        'w-full flex items-center justify-between rounded-lg border px-4 py-3.5',
                        'text-left transition-all hover:border-primary/50',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                      )}
                    >
                      <div>
                        <div className="font-medium text-sm">{exam.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{exam.desc}</div>
                      </div>
                      {selected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground bg-warning/10 rounded-md px-3 py-2 border border-warning/20">
                ⚠️ Exam dates and syllabus details shown in this app are sample data until verified against official SSC notifications.
              </p>
            </div>
          )}

          {/* Step 2: Daily availability */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">How much can you study each day?</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  This sets your daily capacity. You can always adjust it.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-primary">{data.dailyHours}h</span>
                  <span className="text-sm text-muted-foreground">per day</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={0.5}
                  value={data.dailyHours}
                  onChange={(e) => setData((d) => ({ ...d, dailyHours: Number(e.target.value) }))}
                  className="w-full accent-primary"
                  aria-label="Daily study hours"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Preferred study days</label>
                <div className="flex gap-2">
                  {DAYS.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(i)}
                      aria-pressed={data.preferredDays.includes(i)}
                      className={cn(
                        'flex-1 py-2 rounded-md text-xs font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        data.preferredDays.includes(i)
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">You're all set!</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Here's your study configuration. You can change everything in Settings.
                </p>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exams</span>
                    <span className="font-medium">
                      {data.selectedExamCodes.join(', ').replace(/_/g, ' ') || 'None selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily goal</span>
                    <span className="font-medium">{data.dailyHours}h per day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Study days</span>
                    <span className="font-medium">
                      {data.preferredDays.map((d) => DAYS[d]).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weekly total</span>
                    <span className="font-medium">
                      {data.dailyHours * data.preferredDays.length}h per week
                    </span>
                  </div>
                </div>
              </div>
              {error && (
                <div role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-4 py-2 text-sm',
                'text-muted-foreground hover:text-foreground border border-border',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && data.selectedExamCodes.length === 0) {
                  setError('Please select at least one exam.')
                  return
                }
                setError(null)
                setStep((s) => (s + 1) as 1 | 2 | 3)
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-5 py-2 text-sm font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-5 py-2 text-sm font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isSubmitting ? 'Saving…' : 'Start studying'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
