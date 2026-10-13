import { useState } from 'react'
import { ChevronDown, CheckCircle2, Target, TrendingUp } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { cn } from '@/lib/utils'

interface DayData {
  day: string
  completed: number
  remaining: number
}

const DEMO_WEEK_DATA: DayData[] = [
  { day: 'Mon', completed: 4.0, remaining: 1.0 },
  { day: 'Tue', completed: 5.0, remaining: 0.0 },
  { day: 'Wed', completed: 3.0, remaining: 2.0 },
  { day: 'Thu', completed: 4.5, remaining: 0.5 },
  { day: 'Fri', completed: 3.5, remaining: 1.5 },
  { day: 'Sat', completed: 2.0, remaining: 3.0 },
  { day: 'Sun', completed: 0.0, remaining: 5.0 },
]

const FRESH_WEEK_DATA: DayData[] = [
  { day: 'Mon', completed: 0.0, remaining: 8.0 },
  { day: 'Tue', completed: 0.0, remaining: 8.0 },
  { day: 'Wed', completed: 0.0, remaining: 8.0 },
  { day: 'Thu', completed: 0.0, remaining: 8.0 },
  { day: 'Fri', completed: 0.0, remaining: 8.0 },
  { day: 'Sat', completed: 0.0, remaining: 0.0 },
  { day: 'Sun', completed: 0.0, remaining: 0.0 },
]

export function WeeklyProgressCard() {
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'
  const [activeDay, setActiveDay] = useState<string | null>(null)

  const weekData = isDemo ? DEMO_WEEK_DATA : FRESH_WEEK_DATA
  const maxHeightHours = isDemo ? 6.0 : 8.0
  const completedTotal = isDemo ? 22 : 0
  const targetTotal = isDemo ? 30 : 40
  const progressPct = targetTotal > 0 ? Math.round((completedTotal / targetTotal) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Weekly Progress
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              14 Oct – 20 Oct
            </p>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span>This Week</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>

        {/* Bar Chart Area */}
        <div className="mt-5 relative pt-4 pb-2">
          {/* Target Reference Line */}
          <div
            className="absolute left-8 right-2 border-b border-dashed border-emerald-400 dark:border-emerald-500/80 z-10 pointer-events-none"
            style={{ bottom: isDemo ? '58px' : '40px' }}
          >
            <span className="absolute -top-3.5 right-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-card px-1 rounded">
              -- Target ({isDemo ? '5h' : '8h'})
            </span>
          </div>

          {/* Chart Columns */}
          <div className="flex items-end justify-between gap-2 h-36 pl-8 pr-2">
            {weekData.map((item) => {
              const completedHeightPct = (item.completed / maxHeightHours) * 100
              const remainingHeightPct = (item.remaining / maxHeightHours) * 100
              const isHovered = activeDay === item.day

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setActiveDay(item.day)}
                  onMouseLeave={() => setActiveDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-9 z-30 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-lg shadow-md whitespace-nowrap pointer-events-none animate-fade-in">
                      {item.completed}h done / {item.completed + item.remaining}h total
                    </div>
                  )}

                  {/* Stacked Bar Container */}
                  <div className="w-full max-w-[28px] flex flex-col justify-end rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-800 h-28 relative">
                    {/* Remaining hours segment (top) */}
                    <div
                      style={{ height: `${remainingHeightPct}%` }}
                      className="w-full bg-emerald-200 dark:bg-emerald-800/50 transition-all duration-300"
                    />
                    {/* Completed hours segment (bottom) */}
                    <div
                      style={{ height: `${completedHeightPct}%` }}
                      className="w-full bg-emerald-500 dark:bg-emerald-500 transition-all duration-300"
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={cn(
                      'text-[11px] font-semibold mt-2 transition-colors',
                      isHovered
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-5 mt-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-800" />
              <span>Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Pill Badges */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
          <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-none">
              {completedTotal}h
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
          <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 shrink-0">
            <Target className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-none">
              {targetTotal}h
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Target</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
          <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-none">
              {progressPct}%
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}
