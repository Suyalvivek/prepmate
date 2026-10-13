import { useState } from 'react'
import { RefreshCw, CheckCircle2, Clock, Flame, Calendar, Sparkles } from 'lucide-react'
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

const INITIAL_REVISIONS: RevisionItem[] = [
  { id: '1', topic: 'Trigonometric Identities & Max/Min values', subject: 'Quant', dueText: 'Due today', intervalDays: 3, repetitionCount: 2, reviewed: false },
  { id: '2', topic: 'Articles 12-35: Fundamental Rights & Writs', subject: 'General Awareness', dueText: 'Due today', intervalDays: 7, repetitionCount: 3, reviewed: false },
  { id: '3', topic: 'Conditional Sentences & Inversion Rules', subject: 'English', dueText: 'Due today', intervalDays: 3, repetitionCount: 1, reviewed: false },
  { id: '4', topic: 'Direction & Distance Angle Shifts', subject: 'Reasoning', dueText: 'Due tomorrow', intervalDays: 14, repetitionCount: 4, reviewed: false },
  { id: '5', topic: 'Time & Work: Efficiency and Pipes', subject: 'Quant', dueText: 'Completed', intervalDays: 7, repetitionCount: 3, reviewed: true },
]

export function RevisionsPage() {
  const [items, setItems] = useState<RevisionItem[]>(INITIAL_REVISIONS)
  const [tab, setTab] = useState<'due' | 'all'>('due')

  const rateItem = (id: string, rating: 'difficult' | 'good' | 'easy') => {
    setItems((prev) =>
      prev.map((item) => {
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
    )
  }

  const dueItems = items.filter((i) => !i.reviewed)
  const completedItems = items.filter((i) => i.reviewed)

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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Revisions Due Today</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{dueItems.length}</p>
          <span className="text-[11px] text-muted-foreground">Ready for quick review</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Retention Rate</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-2">92.4%</p>
          <span className="text-[11px] text-muted-foreground">Based on recall ratings</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Completed This Week</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{completedItems.length}</p>
          <span className="text-[11px] text-muted-foreground">Topics reinforced</span>
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
          {(tab === 'due' ? dueItems : items).map((item) => (
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

              {/* Rating actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!item.reviewed ? (
                  <>
                    <button
                      onClick={() => rateItem(item.id, 'difficult')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                      title="Reset interval to 1 day"
                    >
                      Difficult (1d)
                    </button>
                    <button
                      onClick={() => rateItem(item.id, 'good')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                      title="Multiply interval by 2"
                    >
                      Good ({item.intervalDays * 2}d)
                    </button>
                    <button
                      onClick={() => rateItem(item.id, 'easy')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                      title="Multiply interval by 3"
                    >
                      Easy ({item.intervalDays * 3}d)
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Reviewed ({item.dueText})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
