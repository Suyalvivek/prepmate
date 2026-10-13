import { Target, Clock, Flame, Shield } from 'lucide-react'

interface MetricStatsRowProps {
  completedTasks: number
  totalTasks: number
  studyMinutes?: number
  plannedHours?: number
  streakDays?: number
  streakSubtitle?: string
  level?: number
  xp?: number
  xpMax?: number
  levelTitle?: string
}

export function MetricStatsRow({
  completedTasks,
  totalTasks,
  studyMinutes = 260,
  plannedHours = 6,
  streakDays = 12,
  streakSubtitle = 'Keep it going! 🔥',
  level = 4,
  xp = 320,
  xpMax = 500,
  levelTitle = 'Disciplined Aspirant',
}: MetricStatsRowProps) {
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const hours = Math.floor(studyMinutes / 60)
  const mins = studyMinutes % 60
  const studyHoursText = `${hours}h ${mins > 0 ? `${mins}m` : '0m'}`
  const totalPlannedMinutes = plannedHours * 60
  const studyPercentage =
    totalPlannedMinutes > 0 ? Math.min(100, Math.round((studyMinutes / totalPlannedMinutes) * 100)) : 0
  const xpPercentage = xpMax > 0 ? Math.min(100, Math.round((xp / xpMax) * 100)) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* 1. Today's Focus */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 shadow-sm flex flex-col justify-between min-h-[128px]">
        {/* Top: Icon + Label */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Today's Focus
          </span>
        </div>

        {/* Bottom: Numbers + Circular Ring */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
              {completedTasks} / {totalTasks}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              tasks completed
            </p>
          </div>

          {/* Circular SVG Ring */}
          <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 dark:text-blue-500 transition-all duration-500 ease-out"
                strokeDasharray={`${taskPercentage}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
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
      </div>

      {/* 2. Study Hours */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 shadow-sm flex flex-col justify-between min-h-[128px]">
        {/* Top: Icon + Label */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Study Hours
          </span>
        </div>

        {/* Bottom: Numbers + Circular Ring */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
              {studyHoursText}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              of {plannedHours}h planned
            </p>
          </div>

          {/* Circular SVG Ring */}
          <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 dark:text-emerald-400"
                strokeDasharray={`${studyPercentage}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-100">
              {studyPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Current Streak */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 shadow-sm flex flex-col justify-between min-h-[128px]">
        {/* Top: Icon + Label */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="h-4 w-4 fill-amber-500" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Current Streak
          </span>
        </div>

        {/* Bottom: Numbers */}
        <div className="mt-3">
          <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
            {streakDays} {streakDays === 1 ? 'day' : 'days'}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            {streakSubtitle}
          </p>
        </div>
      </div>

      {/* 4. Level */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 shadow-sm flex flex-col justify-between min-h-[128px]">
        {/* Top: Icon + Label */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Level</span>
        </div>

        {/* Bottom: Level + Inset XP bar */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
              Level {level}
            </p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {xp} / {xpMax} XP
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 mb-2">
            {levelTitle}
          </p>

          {/* XP Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
