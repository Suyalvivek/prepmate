import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  BarChart3,
  Trophy,
  Flame,
  Zap,
  Award,
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnalyticsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'

  const demoWeekData = [
    { day: 'Mon', hours: 5.5, target: 6.0 },
    { day: 'Tue', hours: 6.0, target: 6.0 },
    { day: 'Wed', hours: 4.5, target: 6.0 },
    { day: 'Thu', hours: 6.5, target: 6.0 },
    { day: 'Fri', hours: 5.0, target: 6.0 },
    { day: 'Sat', hours: 7.0, target: 6.0 },
    { day: 'Sun', hours: 3.0, target: 6.0, restDay: true },
  ]

  const freshWeekData = [
    { day: 'Mon', hours: 0.0, target: 8.0 },
    { day: 'Tue', hours: 0.0, target: 8.0 },
    { day: 'Wed', hours: 0.0, target: 8.0 },
    { day: 'Thu', hours: 0.0, target: 8.0 },
    { day: 'Fri', hours: 0.0, target: 8.0 },
    { day: 'Sat', hours: 0.0, target: 0.0, restDay: true },
    { day: 'Sun', hours: 0.0, target: 0.0, restDay: true },
  ]

  const demoSubjects = [
    { name: 'Quantitative Aptitude', hours: 14.5, percent: 38, color: 'bg-blue-500', accuracy: '84%' },
    { name: 'Reasoning & Intelligence', hours: 9.0, percent: 24, color: 'bg-emerald-500', accuracy: '88%' },
    { name: 'English Language', hours: 8.0, percent: 21, color: 'bg-amber-500', accuracy: '80%' },
    { name: 'General Awareness', hours: 6.0, percent: 17, color: 'bg-purple-500', accuracy: '72%' },
  ]

  const freshSubjects = [
    { name: 'Quantitative Aptitude', hours: 0.0, percent: 0, color: 'bg-blue-500', accuracy: '0%' },
    { name: 'Reasoning & Intelligence', hours: 0.0, percent: 0, color: 'bg-emerald-500', accuracy: '0%' },
    { name: 'English Language', hours: 0.0, percent: 0, color: 'bg-amber-500', accuracy: '0%' },
    { name: 'General Awareness', hours: 0.0, percent: 0, color: 'bg-purple-500', accuracy: '0%' },
  ]

  const demoAchievements = [
    { code: '7_streak', title: '7-Day Streak', desc: 'Studied consistently for a full week without breaking momentum.', unlocked: true },
    { code: 'first_mock', title: 'Test Taker', desc: 'Completed your first full-length diagnostic mock test.', unlocked: true },
    { code: 'revision_habit', title: 'Revision Habit', desc: 'Mastered 10 items in the spaced repetition queue.', unlocked: true },
    { code: 'rest_day', title: 'Planned Recovery', desc: 'Utilized planned rest days cleanly without guilt.', unlocked: true },
    { code: 'deep_diver', title: 'Deep Work Master', desc: 'Logged 4+ continuous hours in the Focus Timer.', unlocked: false },
    { code: 'century', title: 'Century Club', desc: 'Solve 100 high-yield questions in a single weekend.', unlocked: false },
  ]

  const freshAchievements = [
    { code: '7_streak', title: '7-Day Streak', desc: 'Studied consistently for a full week without breaking momentum.', unlocked: false },
    { code: 'first_mock', title: 'Test Taker', desc: 'Completed your first full-length diagnostic mock test.', unlocked: false },
    { code: 'revision_habit', title: 'Revision Habit', desc: 'Mastered 10 items in the spaced repetition queue.', unlocked: false },
    { code: 'rest_day', title: 'Planned Recovery', desc: 'Utilized planned rest days cleanly without guilt.', unlocked: false },
    { code: 'deep_diver', title: 'Deep Work Master', desc: 'Logged 4+ continuous hours in the Focus Timer.', unlocked: false },
    { code: 'century', title: 'Century Club', desc: 'Solve 100 high-yield questions in a single weekend.', unlocked: false },
  ]

  const weekData = isDemo ? demoWeekData : freshWeekData
  const subjects = isDemo ? demoSubjects : freshSubjects
  const achievements = isDemo ? demoAchievements : freshAchievements
  const weeklyHours = isDemo ? '37.5h' : '0.0h'
  const weeklyTarget = isDemo ? '93% of 40h target' : '0% of 40h target'
  const activeStreak = isDemo ? '7 Days' : '0 Days'
  const longestStreak = isDemo ? 'Longest: 14 days' : 'Start your streak today'
  const prepLevel = isDemo ? 'Level 4' : 'Level 1'
  const levelXp = isDemo ? '1,280 / 1,500 XP to Lvl 5' : '0 / 200 XP to Lvl 2'
  const taskVelocity = isDemo ? '88.2%' : '0.0%'
  const velocitySubtitle = isDemo ? 'Completion reliability' : 'Complete your first task'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics & Performance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quantified study analytics, syllabus velocity, and gamified progress.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Weekly Study Hours</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{weeklyHours}</p>
          <span className="text-[11px] text-emerald-500 font-medium">{weeklyTarget}</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Streak</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500 mt-2">{activeStreak}</p>
          <span className="text-[11px] text-muted-foreground">{longestStreak}</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Prep Level</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{prepLevel}</p>
          <span className="text-[11px] text-primary font-medium">{levelXp}</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Task Velocity</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-2">{taskVelocity}</p>
          <span className="text-[11px] text-muted-foreground">{velocitySubtitle}</span>
        </div>
      </div>

      {/* Charts & Subject Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours Bar Graph */}
        <div className="pm-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weekly Study Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Hours logged vs daily goal</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              This Week
            </span>
          </div>

          {/* Chart Area */}
          <div className="pt-2">
            {/* Bars Column Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-36 px-1">
              {weekData.map((d) => {
                const heightPercent = d.hours > 0 ? Math.min((d.hours / 8) * 100, 100) : 0
                const reachedGoal = d.hours >= d.target

                return (
                  <div key={d.day} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-semibold shadow-md whitespace-nowrap">
                      {d.hours > 0 ? `${d.hours}h logged` : d.restDay ? 'Rest Day' : '0.0h logged'}
                    </div>

                    {/* Pillar Bar Track */}
                    <div className="w-full max-w-[34px] bg-secondary/50 hover:bg-secondary/70 rounded-t-lg h-32 flex items-end overflow-hidden border border-border/30 transition-colors">
                      {d.hours > 0 && (
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={cn(
                            'w-full transition-all duration-300 rounded-t-md',
                            d.restDay
                              ? 'bg-slate-400 dark:bg-slate-600'
                              : reachedGoal
                              ? 'bg-primary'
                              : 'bg-primary/70'
                          )}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Day Labels Row (Completely decoupled from bar height) */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 px-1 pt-2.5 mt-1 border-t border-border">
              {weekData.map((d) => (
                <div key={d.day} className="text-center">
                  <span className="text-xs font-medium text-muted-foreground block truncate">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend and Guidance Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-4 mt-2 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="font-medium text-foreground">Goal Reached</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span>Planned Rest Day</span>
              </div>
            </div>
            {!isDemo && (
              <span className="text-[11px] text-blue-500 font-medium">
                Log study hours in Focus Timer to populate
              </span>
            )}
          </div>
        </div>

        {/* Subject Allocation */}
        <div className="pm-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Subject Time Allocation</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Current week distribution</p>
          </div>

          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground truncate max-w-[180px]">{s.name}</span>
                  <span className="text-muted-foreground font-semibold">
                    {s.hours}h ({s.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.percent}%` }}
                    className={cn('h-full rounded-full transition-all duration-500', s.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamified Achievements Showcase */}
      <div className="pm-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Achievements & Milestones
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Earn badges and gain XP as you complete daily goals and overcome difficult topics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
            </span>
            <button
              onClick={() => navigate('/achievements')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <span>View All 11 Badges & XP</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((item) => (
            <div
              key={item.code}
              className={cn(
                'p-3.5 rounded-xl border flex items-start gap-3 transition-colors',
                item.unlocked
                  ? 'border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-border/60 bg-card opacity-60'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-sm',
                  item.unlocked
                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                  {item.desc}
                </p>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-semibold mt-1.5',
                    item.unlocked ? 'text-blue-500' : 'text-slate-400'
                  )}
                >
                  {item.unlocked ? '✓ Unlocked (+150 XP)' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
