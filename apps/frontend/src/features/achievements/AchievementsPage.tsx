import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Shield,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  Sparkles,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/providers/AuthProvider'

interface Achievement {
  code: string
  title: string
  desc: string
  category: 'streak' | 'mock' | 'mastery' | 'focus'
  unlocked: boolean
  unlockedAt?: string
  xpReward: number
  progress?: { current: number; max: number; unit: string }
  iconColor: string
}

const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    code: '7_streak',
    title: '7-Day Consistency Streak',
    desc: 'Maintained your study schedule for a full 7 consecutive days without missing a single day.',
    category: 'streak',
    unlocked: true,
    unlockedAt: '12 Oct 2026',
    xpReward: 150,
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    code: 'first_mock',
    title: 'Diagnostic Test Taker',
    desc: 'Completed your first full-length diagnostic mock test under real exam timing.',
    category: 'mock',
    unlocked: true,
    unlockedAt: '04 Oct 2026',
    xpReward: 200,
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    code: 'revision_habit',
    title: 'Spaced Memory Pioneer',
    desc: 'Mastered 10 items in the spaced repetition flashcard queue.',
    category: 'mastery',
    unlocked: true,
    unlockedAt: '08 Oct 2026',
    xpReward: 100,
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    code: 'rest_day',
    title: 'Planned Recovery Champion',
    desc: 'Utilized your scheduled Sunday rest day cleanly without stress or study guilt.',
    category: 'streak',
    unlocked: true,
    unlockedAt: '11 Oct 2026',
    xpReward: 80,
    iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    code: 'speed_demon',
    title: 'Sectional Speed Demon',
    desc: 'Solved 25 Quantitative Aptitude questions with 90%+ accuracy in under 20 minutes.',
    category: 'focus',
    unlocked: true,
    unlockedAt: '09 Oct 2026',
    xpReward: 120,
    iconColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    code: 'polity_scholar',
    title: 'Constitution & Polity Scholar',
    desc: 'Achieved 100% accuracy on Articles 12-51A fundamental rights and duties.',
    category: 'mastery',
    unlocked: true,
    unlockedAt: '10 Oct 2026',
    xpReward: 100,
    iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    code: 'deep_diver',
    title: 'Deep Work Master',
    desc: 'Log 4+ continuous hours in the Focus Timer within a single study day.',
    category: 'focus',
    unlocked: false,
    xpReward: 180,
    progress: { current: 2.8, max: 4.0, unit: 'hours' },
    iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  {
    code: 'century',
    title: 'Century Club',
    desc: 'Solve 100 high-yield questions in a single weekend revision sprint.',
    category: 'mastery',
    unlocked: false,
    xpReward: 250,
    progress: { current: 64, max: 100, unit: 'questions' },
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    code: 'mock_160',
    title: 'Tier 1 Cutoff Crusher',
    desc: 'Score 160+ marks in an SSC CGL Full-Length Mock Test.',
    category: 'mock',
    unlocked: false,
    xpReward: 300,
    progress: { current: 148.5, max: 160.0, unit: 'marks' },
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    code: '30_streak',
    title: '30-Day Legend',
    desc: 'Maintain study consistency for 30 consecutive days without breaking streak.',
    category: 'streak',
    unlocked: false,
    xpReward: 500,
    progress: { current: 7, max: 30, unit: 'days' },
    iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  },
  {
    code: 'error_eradicator',
    title: 'Error Eradicator',
    desc: 'Successfully resolve and master 25 mistakes from your Error Notebook.',
    category: 'mastery',
    unlocked: false,
    xpReward: 200,
    progress: { current: 11, max: 25, unit: 'mistakes' },
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
]

const FRESH_ACHIEVEMENTS: Achievement[] = DEMO_ACHIEVEMENTS.map((a) => ({
  ...a,
  unlocked: false,
  unlockedAt: undefined,
  progress: undefined,
}))

const DEMO_XP_LOG = [
  { id: '1', title: 'Completed Daily Study Plan (6.0h Target)', xp: 120, time: 'Yesterday at 9:30 PM', icon: Zap },
  { id: '2', title: 'Unlocked: 7-Day Consistency Streak Badge', xp: 150, time: 'Yesterday at 9:35 PM', icon: Trophy },
  { id: '3', title: 'Full Mock #5 Error Logging & Analysis', xp: 80, time: '10 Oct at 6:15 PM', icon: Target },
  { id: '4', title: 'Mastered 3 Trigonometry Due Flashcards', xp: 45, time: '10 Oct at 11:20 AM', icon: Sparkles },
  { id: '5', title: 'Focused Pomodoro Session (50m Block)', xp: 35, time: '09 Oct at 4:40 PM', icon: Clock },
]

export function AchievementsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'streak' | 'mock' | 'mastery' | 'focus'>('all')

  const totalXP = isDemo ? 1280 : 0
  const nextLevelXP = isDemo ? 1500 : 200
  const currentLevel = isDemo ? 4 : 1
  const progressPercent = totalXP > 0 ? Math.round((totalXP / nextLevelXP) * 100) : 0
  const rankTitle = isDemo ? 'Disciplined Aspirant' : 'Novice Aspirant'
  const nextRankNotice = isDemo
    ? 'Earn 220 more XP to reach Level 5 ("Mock Strategist")'
    : 'Earn 200 more XP to reach Level 2 ("Focused Aspirant")'

  const achievements = isDemo ? DEMO_ACHIEVEMENTS : FRESH_ACHIEVEMENTS
  const xpLog = isDemo ? DEMO_XP_LOG : []

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked
    if (filter === 'locked') return !a.unlocked
    if (filter === 'streak') return a.category === 'streak'
    if (filter === 'mock') return a.category === 'mock'
    if (filter === 'mastery') return a.category === 'mastery'
    if (filter === 'focus') return a.category === 'focus'
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-500" />
            Achievements & Gamification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Earn XP, maintain consistency streaks, and unlock study milestones on your way to SSC CGL 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted/50 text-foreground transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>View Study Analytics</span>
          </button>
        </div>
      </div>

      {/* Hero: Level & Streak Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level & XP Banner */}
        <div className="md:col-span-2 pm-card p-6 relative overflow-hidden bg-gradient-to-br from-card via-card to-blue-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Level {currentLevel}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {rankTitle}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {totalXP.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">XP Earned</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {nextRankNotice}
              </p>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-500 shrink-0">
              <Trophy className="h-8 w-8 stroke-[1.75]" />
              <span className="text-[11px] font-bold mt-1">Lvl {currentLevel}</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
              <span className="text-primary">{progressPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden p-0.5 border border-border/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak & Consistency Card */}
        <div className="pm-card p-6 flex flex-col justify-between bg-gradient-to-br from-card to-orange-500/5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Active Momentum</span>
              <span className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                <Flame className="h-4 w-4 fill-orange-500" />
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-orange-500 flex items-center gap-2">
                <span>{isDemo ? '7 Days' : '0 Days'}</span>
                {isDemo && <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isDemo ? 'All 7 study days completed this week' : 'Start your consistency streak with your first study day'}
              </p>
            </div>

            {/* Week days visual strip */}
            <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-border">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-transform',
                      isDemo
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-muted/60 text-muted-foreground border border-border/50'
                    )}
                  >
                    {isDemo ? '✓' : '—'}
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Longest Streak: <strong>{isDemo ? '14 Days' : '0 Days'}</strong></span>
            <span className={cn('font-semibold flex items-center gap-0.5', isDemo ? 'text-emerald-500' : 'text-muted-foreground')}>
              <Shield className="h-3 w-3" /> {isDemo ? 'Protected' : 'Day 1'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-border">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
            { id: 'locked', label: `In Progress (${totalCount - unlockedCount})` },
            { id: 'streak', label: 'Streaks' },
            { id: 'mock', label: 'Mocks' },
            { id: 'mastery', label: 'Mastery' },
            { id: 'focus', label: 'Focus' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap',
                filter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-muted-foreground shrink-0 hidden sm:block">
          {unlockedCount} of {totalCount} Badges Unlocked
        </span>
      </div>

      {/* Badges Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border/80 rounded-2xl bg-card">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No Badges in This Category</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {filter === 'unlocked'
              ? 'Complete tasks from your daily planner, log focus sessions, or solve mock tests to unlock your first badge!'
              : 'Switch filters above to view other milestone categories.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.code}
              className={cn(
                'p-5 rounded-2xl border transition-all flex flex-col justify-between group',
                ach.unlocked
                  ? 'bg-card border-border hover:border-primary/50 shadow-xs'
                  : 'bg-muted/20 border-dashed border-border/80 opacity-80 hover:opacity-100'
              )}
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105',
                      ach.unlocked
                        ? ach.iconColor
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {ach.unlocked ? (
                      <Award className="h-6 w-6 stroke-[1.8]" />
                    ) : (
                      <Lock className="h-5 w-5 stroke-[1.8]" />
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1',
                        ach.unlocked
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Zap className="h-3 w-3" />
                      +{ach.xpReward} XP
                    </span>
                    {ach.unlockedAt && (
                      <span className="text-[10px] text-muted-foreground block mt-1">
                        Earned {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mt-3.5 space-y-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ach.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Status / Progress Meter */}
              <div className="mt-4 pt-3 border-t border-border/60">
                {ach.unlocked ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Completed</span>
                  </div>
                ) : ach.progress ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">
                        {ach.progress.current} / {ach.progress.max} {ach.progress.unit}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            (ach.progress.current / ach.progress.max) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent XP Activity Log */}
      <div className="pm-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              Recent XP History
            </h3>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {xpLog.length > 0 ? `Last ${xpLog.length} Transactions` : 'Day 1'}
          </span>
        </div>

        {xpLog.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-border/70 rounded-xl bg-muted/10">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
              <Zap className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">No XP earned yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mx-auto">
              Complete daily planner tasks, log focus sessions, or solve mock tests to earn XP and level up your aspirant rank!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {xpLog.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    +{item.xp} XP
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
