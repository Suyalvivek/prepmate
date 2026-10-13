import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { HeroGreetingBanner } from './components/HeroGreetingBanner'
import { JourneyCard } from './components/JourneyCard'
import { MetricStatsRow } from './components/MetricStatsRow'
import { TodayPlanCard, TodayTask, TaskStatus } from './components/TodayPlanCard'
import { WeeklyProgressCard } from './components/WeeklyProgressCard'
import { UpcomingExamsCard } from './components/UpcomingExamsCard'
import { MonthlyCalendarCard } from './components/MonthlyCalendarCard'
import { AIMentorCard } from './components/AIMentorCard'
import { SubjectProgressCard } from './components/SubjectProgressCard'
import { MockTestPerformanceCard } from './components/MockTestPerformanceCard'
import { TopicAccuracyCard } from './components/TopicAccuracyCard'

const DEMO_TASKS: TodayTask[] = [
  {
    id: '1',
    time: '7:00 – 8:00 AM',
    subject: 'Quantitative Aptitude',
    title: 'Number System - PYQs (50 questions)',
    status: 'Completed',
  },
  {
    id: '2',
    time: '8:15 – 9:00 AM',
    subject: 'English',
    title: 'Vocabulary + RC practice',
    status: 'Completed',
  },
  {
    id: '3',
    time: '10:00 – 11:30 AM',
    subject: 'Reasoning',
    title: 'Syllogism + Practice Questions',
    status: 'In Progress',
  },
  {
    id: '4',
    time: '1:00 – 2:00 PM',
    subject: 'GK/GS',
    title: 'Polity - Parliament & Constitution',
    status: 'Pending',
  },
  {
    id: '5',
    time: '3:00 – 4:00 PM',
    subject: 'Revision',
    title: "Yesterday's weak topics",
    status: 'Pending',
  },
  {
    id: '6',
    time: '7:00 – 8:00 PM',
    subject: 'Mock Test Analysis',
    title: 'Discuss errors + make notes',
    status: 'Pending',
  },
]

export function DashboardPage() {
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'

  // Load real user tasks from planner storage or fall back to demo tasks
  const [tasks, setTasks] = useState<TodayTask[]>(() => {
    if (isDemo) return DEMO_TASKS

    try {
      const saved = localStorage.getItem('prepmate_planner_tasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Look for tasks scheduled for today (or default to empty for new accounts)
          const todayIso = new Date().toISOString().split('T')[0]
          const todayTasks = parsed.filter(
            (t: { date?: string }) => t.date === '2026-10-12' || t.date === todayIso
          )
          if (todayTasks.length > 0) {
            return todayTasks.map((t: any, i: number) => ({
              id: t.id || String(i),
              time: `${9 + i * 2}:00 – ${10 + i * 2}:00`,
              subject: t.subject || 'General Study',
              title: t.title || 'Study Session',
              status: t.completed ? ('Completed' as TaskStatus) : ('Pending' as TaskStatus),
            }))
          }
        }
      }
    } catch {
      // fallback
    }

    // New registered candidate starts with a clean slate
    return []
  })

  // Listen for tasks added in Planner or from AI Mentor
  useEffect(() => {
    if (isDemo) return

    const handleSync = () => {
      try {
        const saved = localStorage.getItem('prepmate_planner_tasks')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            const todayIso = new Date().toISOString().split('T')[0]
            const todayTasks = parsed.filter(
              (t: { date?: string }) => t.date === '2026-10-12' || t.date === todayIso
            )
            setTasks(
              todayTasks.map((t: any, i: number) => ({
                id: t.id || String(i),
                time: `${9 + i * 2}:00 – ${10 + i * 2}:00`,
                subject: t.subject || 'General Study',
                title: t.title || 'Study Session',
                status: t.completed ? ('Completed' as TaskStatus) : ('Pending' as TaskStatus),
              }))
            )
          }
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener('prepmate_tasks_updated', handleSync)
    return () => window.removeEventListener('prepmate_tasks_updated', handleSync)
  }, [isDemo])

  // Toggle task between Completed <-> Pending <-> In Progress
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const nextStatus: TaskStatus =
          t.status === 'Completed'
            ? 'Pending'
            : t.status === 'Pending'
            ? 'In Progress'
            : 'Completed'
        return { ...t, status: nextStatus }
      })
    )
  }

  // Defer task to next day
  const handleDeferTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      const saved = localStorage.getItem('prepmate_planner_tasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const updated = parsed.map((t: any) => {
            if (t.id === id) {
              const current = t.date || '2026-10-12'
              const d = new Date(current)
              d.setDate(d.getDate() + 1)
              const nextDate = d.toISOString().split('T')[0]
              return { ...t, date: nextDate }
            }
            return t
          })
          localStorage.setItem('prepmate_planner_tasks', JSON.stringify(updated))
          window.dispatchEvent(new Event('prepmate_tasks_updated'))
        }
      }
    } catch {
      // ignore
    }
  }

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      const saved = localStorage.getItem('prepmate_planner_tasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((t: any) => t.id !== id)
          localStorage.setItem('prepmate_planner_tasks', JSON.stringify(updated))
          window.dispatchEvent(new Event('prepmate_tasks_updated'))
        }
      }
    } catch {
      // ignore
    }
  }

  // Calculate task counts
  const completedCount = isDemo
    ? tasks.filter((t) => t.status === 'Completed').length + 2
    : tasks.filter((t) => t.status === 'Completed').length
  const totalCount = isDemo ? 6 : tasks.length

  // Calculate dynamic metrics based on whether it's a demo account or real candidate
  const dayNumber = isDemo ? 142 : 1
  const plannedHours = isDemo ? 6 : 8
  const studyMinutes = isDemo
    ? 260
    : tasks
        .filter((t) => t.status === 'Completed')
        .reduce((acc) => acc + 60, 0)
  const streakDays = isDemo ? 12 : 0
  const streakSubtitle = isDemo ? 'Keep it going! 🔥' : 'Start your streak today! 🔥'
  const level = isDemo ? 4 : 1
  const xp = isDemo ? 320 : completedCount * 50
  const xpMax = isDemo ? 500 : 200
  const levelTitle = isDemo ? 'Disciplined Aspirant' : 'Foundation Aspirant'

  return (
    <div className="space-y-5 pb-20">
      {/* ── ROW 1: Hero Banner + Journey Card ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <HeroGreetingBanner />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <JourneyCard dayNumber={dayNumber} />
        </div>
      </div>

      {/* ── ROW 2: Key Metric Stats Row ──────────────────────────────────── */}
      <MetricStatsRow
        completedTasks={completedCount}
        totalTasks={totalCount}
        studyMinutes={studyMinutes}
        plannedHours={plannedHours}
        streakDays={streakDays}
        streakSubtitle={streakSubtitle}
        level={level}
        xp={xp}
        xpMax={xpMax}
        levelTitle={levelTitle}
      />

      {/* ── ROW 3: Main 3-Column Section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Today's Plan */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <TodayPlanCard
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeferTask={handleDeferTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Center Column: Weekly Progress & Upcoming Exams */}
        <div className="lg:col-span-4 flex flex-col gap-5 h-full">
          <WeeklyProgressCard />
          <UpcomingExamsCard />
        </div>

        {/* Right Column: Monthly Calendar & AI Mentor */}
        <div className="lg:col-span-3 flex flex-col gap-5 h-full">
          <MonthlyCalendarCard />
          <AIMentorCard />
        </div>
      </div>

      {/* ── ROW 4: Bottom Analytics Section ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SubjectProgressCard />
        <MockTestPerformanceCard />
        <TopicAccuracyCard />
      </div>
    </div>
  )
}
