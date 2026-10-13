import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, CircleDot, Circle, CalendarDays, ArrowRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TaskStatus = 'Completed' | 'In Progress' | 'Pending'

export interface TodayTask {
  id: string
  time: string
  subject: string
  title: string
  status: TaskStatus
}

interface TodayPlanCardProps {
  tasks: TodayTask[]
  onToggleTask: (id: string) => void
  onDeferTask?: (id: string) => void
  onDeleteTask?: (id: string) => void
}

export function TodayPlanCard({
  tasks,
  onToggleTask,
  onDeferTask,
  onDeleteTask,
}: TodayPlanCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Today's Plan
          </h2>
          <Link
            to="/planner"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
          >
            <span>View Full Plan</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Task List */}
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/70">
          {tasks.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center px-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 mb-2.5 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-foreground">No tasks scheduled for today</p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Your schedule is clear. Plan your daily missions or let your AI Mentor recommend high-yield drills.
              </p>
              <Link
                to="/planner"
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                + Plan Today's Study
              </Link>
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === 'Completed'
              const isInProgress = task.status === 'In Progress'

              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="py-3.5 first:pt-2 last:pb-1 flex items-start sm:items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-850/40 rounded-xl px-2 transition-colors"
                  title="Click to cycle status"
                >
                  {/* Left check & info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Status Indicator Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleTask(task.id)
                      }}
                      className="mt-0.5 sm:mt-0 shrink-0 text-slate-400 focus:outline-none"
                      aria-label={`Toggle task status for ${task.title}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 fill-blue-100 dark:fill-blue-950/60 dark:text-blue-400" />
                      ) : isInProgress ? (
                        <CircleDot className="h-5 w-5 text-blue-500 animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    {/* Time + Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0 w-24">
                        {task.time}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            'text-xs font-semibold tracking-tight truncate',
                            isCompleted
                              ? 'text-slate-800 dark:text-slate-200'
                              : isInProgress
                              ? 'text-slate-900 dark:text-white font-bold'
                              : 'text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {task.subject}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Badge & Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-200',
                        isCompleted &&
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40',
                        isInProgress &&
                          'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40 shadow-xs',
                        task.status === 'Pending' &&
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40'
                      )}
                    >
                      {task.status}
                    </span>

                    {/* Defer Button */}
                    {onDeferTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeferTask(task.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-[11px] flex items-center gap-1"
                        title="Defer to tomorrow"
                      >
                        <ArrowRight className="h-3 w-3" />
                        <span className="hidden sm:inline text-[10px] font-medium">Defer</span>
                      </button>
                    )}

                    {/* Delete Button */}
                    {onDeleteTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteTask(task.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
