import { Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { format } from 'date-fns'
import { BookOpen, CheckCircle2, Clock, Target, RefreshCw, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { user } = useAuth()
  const today = new Date()
  const firstName = user?.displayName?.split(' ')[0] ?? 'there'
  const hour = today.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(today, "EEEE, d MMMM yyyy")} · Your study day awaits.
        </p>
      </div>

      {/* Today's mission + weekly progress row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's mission */}
        <DashboardCard
          className="lg:col-span-2"
          icon={<Target className="h-4 w-4 text-primary" />}
          title="Today's mission"
        >
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <p className="text-sm text-muted-foreground">No tasks scheduled for today.</p>
            <Link to="/planner" className="text-xs text-primary font-semibold hover:underline">
              Add your first task in Planner →
            </Link>
          </div>
        </DashboardCard>

        {/* Weekly progress */}
        <DashboardCard
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          title="Weekly progress"
        >
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <p className="text-sm text-muted-foreground">No weekly plan yet.</p>
            <Link to="/planner" className="text-xs text-primary font-semibold hover:underline">
              Open Planner to set weekly goals →
            </Link>
          </div>
        </DashboardCard>
      </div>

      {/* Focus session + revisions row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Focus timer */}
        <DashboardCard
          icon={<Clock className="h-4 w-4 text-primary" />}
          title="Focus session"
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-4xl font-mono font-bold text-foreground tabular-nums">
              25:00
            </div>
            <Link
              to="/journal"
              className={cn(
                'rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              Start Focus Session
            </Link>
          </div>
        </DashboardCard>

        {/* Due revisions */}
        <DashboardCard
          icon={<RefreshCw className="h-4 w-4 text-primary" />}
          title="Due revisions"
        >
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <p className="text-sm text-muted-foreground">3 spaced repetition items due.</p>
            <Link to="/revisions" className="text-xs text-primary font-semibold hover:underline">
              Review Revisions Queue →
            </Link>
          </div>
        </DashboardCard>

        {/* Completed tasks */}
        <DashboardCard
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          title="Today's progress"
        >
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-primary rounded-full w-1/4 transition-all duration-500" />
            </div>
            <span className="text-sm font-medium tabular-nums">1 / 4</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">tasks completed today</p>
        </DashboardCard>
      </div>

      {/* Syllabus snapshot */}
      <DashboardCard
        icon={<BookOpen className="h-4 w-4 text-primary" />}
        title="Syllabus coverage"
      >
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-sm text-muted-foreground">Track topic mastery across Tier 1 & Tier 2.</p>
          <Link to="/syllabus" className="text-xs text-primary font-semibold hover:underline">
            Visit Syllabus to mark topics →
          </Link>
        </div>
      </DashboardCard>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

function DashboardCard({ icon, title, children, className }: DashboardCardProps) {
  return (
    <section className={cn('pm-card p-5', className)}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function EmptyState({ message, action }: { message: string; action: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/70">{action}</p>
    </div>
  )
}
