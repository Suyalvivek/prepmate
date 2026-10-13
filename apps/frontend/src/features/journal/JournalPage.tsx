import { useState, useEffect } from 'react'
import { Clock, Play, Pause, RotateCcw, BookMarked, Smile, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useAuth } from '@/app/providers/AuthProvider'

interface JournalEntry {
  id: string
  date: string
  mood: string
  accomplishments: string
  blockers: string
}

const DEMO_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '11 Oct 2026',
    mood: '🔥 Productive',
    accomplishments: 'Solved 40 Trigonometry PYQs. Understood max/min shortcuts.',
    blockers: 'Calculation speed in 3-digit multiplication needs more daily drills.',
  },
  {
    id: '2',
    date: '10 Oct 2026',
    mood: '🧠 Focused',
    accomplishments: 'Reviewed Fundamental Rights Articles 12-35 in Indian Polity.',
    blockers: 'Fell 30 mins short on evening English vocabulary reading.',
  },
]

export function JournalPage() {
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'

  // Focus Timer state
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<25 | 50 | 10>(25)
  const [sessionsLogged, setSessionsLogged] = useState(isDemo ? 2 : 0)

  // Journal state
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (isDemo) return DEMO_ENTRIES
    try {
      const saved = localStorage.getItem('prepmate_journal_entries')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return []
  })
  const [mood, setMood] = useState('🔥 Productive')
  const [accomplishments, setAccomplishments] = useState('')
  const [blockers, setBlockers] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1)
      }, 1000)
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false)
      setSessionsLogged((s) => s + 1)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, secondsLeft])

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const setPreset = (mins: 25 | 50 | 10) => {
    setIsRunning(false)
    setTimerMode(mins)
    setSecondsLeft(mins * 60)
  }

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accomplishments.trim()) return
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: 'Today',
      mood,
      accomplishments,
      blockers,
    }
    setEntries([newEntry, ...entries])
    setAccomplishments('')
    setBlockers('')
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <BookMarked className="h-6 w-6 text-primary" />
          Focus Timer & Study Journal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log focused study blocks and record daily reflections to cultivate consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Timer Card */}
        <div className="pm-card p-6 flex flex-col items-center justify-between min-h-[420px]">
          <div className="w-full flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Focus Clock
            </span>
            <span className="text-xs font-bold text-primary">
              {sessionsLogged} Sessions Logged Today
            </span>
          </div>

          <div className="flex flex-col items-center my-6">
            <div className="text-6xl sm:text-7xl font-mono font-bold text-foreground tabular-nums tracking-tight">
              {formatTimer(secondsLeft)}
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {isRunning ? 'Focus mode active — stay distraction free' : 'Ready to start your next session'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  'px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all',
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'pm-btn-primary'
                )}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Start Focus
                  </>
                )}
              </button>

              <button
                onClick={() => setPreset(timerMode)}
                className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              {[
                { label: '25m Pomodoro', mins: 25 as const },
                { label: '50m Deep Work', mins: 50 as const },
                { label: '10m Sprint', mins: 10 as const },
              ].map((p) => (
                <button
                  key={p.mins}
                  onClick={() => setPreset(p.mins)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                    timerMode === p.mins
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Reflection Form */}
        <div className="pm-card p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground">Daily Study Reflection</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Take 2 minutes at the end of your day to summarize learnings and unblock tomorrow.
              </p>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  How was your study session today?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['🔥 Productive', '🧠 Focused', '🌀 Distracted', '😴 Exhausted'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMood(m)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                        mood === m
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  What went well today? (Key topics mastered)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Mastered 30 Syllogism questions and revised Indian Polity articles..."
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Any blockers or items to reschedule?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need to re-watch Trigonometry maximum values lecture tomorrow..."
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Reflection saved! (+50 XP)
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    Builds your consistency habit.
                  </span>
                )}

                <button type="submit" className="pm-btn-primary px-4 py-2 text-xs">
                  Save Daily Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Past Entries */}
      <div className="pm-card p-6">
        <h3 className="text-sm font-bold text-foreground mb-4">Past Reflection Logs</h3>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No reflection logs yet. Take 2 minutes to record your first daily reflection above!
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-3.5 rounded-lg border border-border bg-background space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">{entry.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-foreground text-[11px] font-medium">
                    {entry.mood}
                  </span>
                </div>
                <p className="text-xs text-foreground font-medium">{entry.accomplishments}</p>
                {entry.blockers && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Note: {entry.blockers}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
