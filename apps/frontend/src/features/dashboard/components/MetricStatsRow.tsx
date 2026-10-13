import { Target, Clock, Flame, Shield } from 'lucide-react'

interface MetricStatsRowProps {
  completedTasks: number
  totalTasks: number
}

export function MetricStatsRow({ completedTasks, totalTasks }: MetricStatsRowProps) {
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Today's Focus */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-4.5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Target className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Today's Focus
            </span>
          </div>
          <div className="pt-1">
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {completedTasks} / {totalTasks}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">tasks completed</p>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0 ml-3">
          <svg className="w-13 h-13 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600 dark:text-blue-500 transition-all duration-500 ease-out"
              strokeDasharray={`${taskPercentage}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-100">
            {taskPercentage}%
          </span>
        </div>
      </div>

      {/* 2. Study Hours */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-4.5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Study Hours
            </span>
          </div>
          <div className="pt-1">
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              4h 20m
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">of 6h planned</p>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0 ml-3">
          <svg className="w-13 h-13 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 dark:text-emerald-400"
              strokeDasharray="73, 100"
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-100">
            73%
          </span>
        </div>
      </div>

      {/* 3. Current Streak */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-4.5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Current Streak
            </span>
          </div>
          <div className="pt-1">
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              12 days
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Keep it going! 🔥
            </p>
          </div>
        </div>
      </div>

      {/* 4. Level */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-4.5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Level</span>
          </div>
          <div className="pt-1">
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Level 4
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Disciplined Aspirant</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-2.5">
          <div className="flex justify-end text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">
            320 / 500 XP
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: '64%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
