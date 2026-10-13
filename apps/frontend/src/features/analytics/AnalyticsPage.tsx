import { useState } from 'react'
import { BarChart3, Trophy, Flame, Zap, Award, Target, TrendingUp, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnalyticsPage() {
  const weekData = [
    { day: 'Mon', hours: 5.5, target: 6.0 },
    { day: 'Tue', hours: 6.0, target: 6.0 },
    { day: 'Wed', hours: 4.5, target: 6.0 },
    { day: 'Thu', hours: 6.5, target: 6.0 },
    { day: 'Fri', hours: 5.0, target: 6.0 },
    { day: 'Sat', hours: 7.0, target: 6.0 },
    { day: 'Sun', hours: 3.0, target: 6.0, restDay: true },
  ]

  const subjects = [
    { name: 'Quantitative Aptitude', hours: 14.5, percent: 38, color: 'bg-blue-500' },
    { name: 'Reasoning & Intelligence', hours: 9.0, percent: 24, color: 'bg-emerald-500' },
    { name: 'English Language', hours: 8.0, percent: 21, color: 'bg-amber-500' },
    { name: 'General Awareness', hours: 6.0, percent: 17, color: 'bg-purple-500' },
  ]

  const achievements = [
    { code: '7_streak', title: '7-Day Streak', desc: 'Studied consistently for a full week without breaking momentum.', unlocked: true },
    { code: 'first_mock', title: 'Test Taker', desc: 'Completed your first full-length diagnostic mock test.', unlocked: true },
    { code: 'revision_habit', title: 'Revision Habit', desc: 'Mastered 10 items in the spaced repetition queue.', unlocked: true },
    { code: 'rest_day', title: 'Planned Recovery', desc: 'Utilized planned rest days cleanly without guilt.', unlocked: true },
    { code: 'deep_diver', title: 'Deep Work Master', desc: 'Logged 4+ continuous hours in the Focus Timer.', unlocked: false },
    { code: 'century', title: 'Century Club', desc: 'Solve 100 high-yield questions in a single weekend.', unlocked: false },
  ]

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
          <p className="text-2xl font-bold text-foreground mt-2">37.5h</p>
          <span className="text-[11px] text-emerald-500 font-medium">93% of 40h target</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Streak</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500 mt-2">7 Days</p>
          <span className="text-[11px] text-muted-foreground">Longest: 14 days</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Prep Level</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">Level 4</p>
          <span className="text-[11px] text-primary font-medium">1,280 / 1,500 XP to Lvl 5</span>
        </div>

        <div className="pm-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Task Velocity</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-2">88.2%</p>
          <span className="text-[11px] text-muted-foreground">Completion reliability</span>
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
            <span className="text-xs font-bold text-primary">This Week</span>
          </div>

          <div className="grid grid-cols-7 gap-3 items-end h-48 pt-6 pb-2 border-b border-border">
            {weekData.map((d) => {
              const heightPercent = Math.min((d.hours / 8) * 100, 100)
              return (
                <div key={d.day} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {d.hours}h
                  </span>
                  <div
                    className={cn(
                      'w-full max-w-[36px] rounded-t-lg transition-all duration-500',
                      d.restDay
                        ? 'bg-muted-foreground/30'
                        : d.hours >= d.target
                        ? 'bg-primary'
                        : 'bg-primary/60'
                    )}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground mt-2">{d.day}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-primary" /> Goal Reached
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-muted-foreground/30" /> Planned Rest Day
            </span>
          </div>
        </div>

        {/* Subject Allocation */}
        <div className="pm-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Subject Time Allocation</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">Current week distribution</p>

          <div className="space-y-3.5">
            {subjects.map((sub) => (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">{sub.name}</span>
                  <span className="text-muted-foreground">{sub.hours}h ({sub.percent}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className={cn('h-full rounded-full', sub.color)} style={{ width: `${sub.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamification Badges */}
      <div className="pm-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements & Milestones
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Earn badges and gain XP as you complete daily goals and overcome difficult topics.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.code}
              className={cn(
                'p-4 rounded-xl border transition-all flex items-start gap-3',
                ach.unlocked
                  ? 'bg-card border-border hover:border-primary/50'
                  : 'bg-muted/30 border-dashed border-border opacity-60'
              )}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base',
                  ach.unlocked ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'
                )}
              >
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{ach.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{ach.desc}</p>
                <span className="text-[10px] font-bold mt-1.5 inline-block text-primary">
                  {ach.unlocked ? '✓ Unlocked (+150 XP)' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
