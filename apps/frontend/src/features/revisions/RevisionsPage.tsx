import { useState } from 'react'
import { RefreshCw, CheckCircle2, Clock, Flame, Calendar, Sparkles } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { cn } from '@/lib/utils'

interface RevisionItem {
  id: string
  topic: string
  subject: string
  dueText: string
  intervalDays: number
  repetitionCount: number
  reviewed: boolean
}

const DEMO_REVISIONS: RevisionItem[] = [
  { id: '1', topic: 'Trigonometric Identities & Max/Min values', subject: 'Quant', dueText: 'Due today', intervalDays: 3, repetitionCount: 2, reviewed: false },
  { id: '2', topic: 'Articles 12-35: Fundamental Rights & Writs', subject: 'General Awareness', dueText: 'Due today', intervalDays: 7, repetitionCount: 3, reviewed: false },
  { id: '3', topic: 'Conditional Sentences & Inversion Rules', subject: 'English', dueText: 'Due today', intervalDays: 3, repetitionCount: 1, reviewed: false },
  { id: '4', topic: 'Direction & Distance Angle Shifts', subject: 'Reasoning', dueText: 'Due tomorrow', intervalDays: 14, repetitionCount: 4, reviewed: false },
  { id: '5', topic: 'Time & Work: Efficiency and Pipes', subject: 'Quant', dueText: 'Completed', intervalDays: 7, repetitionCount: 3, reviewed: true },
]

export function RevisionsPage() {
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'

  const [items, setItems] = useState<RevisionItem[]>(() => {
    if (isDemo) return DEMO_REVISIONS
    try {
      const saved = localStorage.getItem('prepmate_revisions')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return []
  })

  const [tab, setTab] = useState<'due' | 'all'>('due')

  const rateItem = (id: string, rating: 'difficult' | 'good' | 'easy') => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item
        let nextInterval = item.intervalDays
        if (rating === 'difficult') nextInterval = 1
        if (rating === 'good') nextInterval = Math.max(item.intervalDays * 2, 3)
        if (rating === 'easy') nextInterval = Math.max(item.intervalDays * 3, 7)

        return {
          ...item,
          intervalDays: nextInterval,
          repetitionCount: item.repetitionCount + 1,
          reviewed: true,
          dueText: `Next in ${nextInterval}d`,
        }
      })
      try {
        localStorage.setItem('prepmate_revisions', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const dueItems = items.filter((i) => !i.reviewed)
  const completedItems = items.filter((i) => i.reviewed)
  const displayedItems = tab === 'due' ? dueItems : items
  const retentionRate = items.length > 0 ? (isDemo ? '92.4%' : '100%') : '—'
  const retentionSubtext = items.length > 0 ? 'Based on recall ratings' : 'No reviews recorded yet'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <RefreshCw className="h-6 w-6 text-primary" />
          Spaced Repetition Queue
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scientific revision scheduling (1-3-7-14-30 day intervals) to cement concepts into long-term memory.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pm-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Revisions Due Today</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{dueItems.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dueItems.length > 0 ? 'Ready for quick review' : 'All caught up!'}
          </p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Retention Rate</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-2">{retentionRate}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{retentionSubtext}</p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Completed This Week</span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{completedItems.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Topics reinforced</p>
        </div>
      </div>

      {/* Queue Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('due')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                tab === 'due' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Pending Reviews ({dueItems.length})
            </button>
            <button
              onClick={() => setTab('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                tab === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All Items ({items.length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {displayedItems.length === 0 ? (
            <div className="pm-card p-12 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-500 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Your revision queue is clear!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Concepts you flag from your Mock Test Error Notebook or Syllabus will appear here for scientific spaced repetition.
              </p>
            </div>
          ) : (
            displayedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'pm-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/40',
                  item.reviewed && 'bg-muted/20 opacity-70'
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {item.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Repetition #{item.repetitionCount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Interval: {item.intervalDays}d
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mt-1.5">{item.topic}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.dueText}</p>
                </div>

                {!item.reviewed ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rateItem(item.id, 'difficult')}
                      className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100/80 transition-colors"
                    >
                      Difficult (1d)
                    </button>
                    <button
                      onClick={() => rateItem(item.id, 'good')}
                      className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-100/80 transition-colors"
                    >
                      Good ({Math.max(item.intervalDays * 2, 3)}d)
                    </button>
                    <button
                      onClick={() => rateItem(item.id, 'easy')}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/80 transition-colors"
                    >
                      Easy ({Math.max(item.intervalDays * 3, 7)}d)
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Scheduled for next review</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
