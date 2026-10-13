import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Trash2,
  CalendarDays,
  ListTodo,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskItem {
  id: string
  title: string
  subject: string
  durationMinutes: number
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  date: string
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: '1',
    title: 'Percentage & Ratio Shortcuts (Tier 1)',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: true,
    priority: 'high',
    date: '2026-10-12',
  },
  {
    id: '2',
    title: 'Syllogism & Venn Diagrams Practice (50 Qs)',
    subject: 'Reasoning',
    durationMinutes: 45,
    completed: false,
    priority: 'high',
    date: '2026-10-12',
  },
  {
    id: '3',
    title: 'Error Spotting & Idioms Revision (Set 4)',
    subject: 'English',
    durationMinutes: 40,
    completed: false,
    priority: 'medium',
    date: '2026-10-12',
  },
  {
    id: '4',
    title: 'Indian Polity: Articles 1-51A & Fundamental Rights',
    subject: 'General Awareness',
    durationMinutes: 60,
    completed: false,
    priority: 'medium',
    date: '2026-10-12',
  },
  {
    id: '5',
    title: 'Speed Maths & Mental Calculations drills',
    subject: 'Quantitative Aptitude',
    durationMinutes: 30,
    completed: false,
    priority: 'low',
    date: '2026-10-12',
  },
]

const SUBJECT_COLORS: Record<string, string> = {
  'Quantitative Aptitude': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Reasoning': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'English': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'General Awareness': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

export function PlannerPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1) // Monday

  // New task form state
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Quantitative Aptitude')
  const [newDuration, setNewDuration] = useState(45)
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const deferTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, date: '2026-10-13' } : t))
    )
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject,
      durationMinutes: Number(newDuration),
      completed: false,
      priority: newPriority,
      date: '2026-10-12',
    }
    setTasks([newTask, ...tasks])
    setNewTitle('')
    setShowAddModal(false)
  }

  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0)
  const completedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.durationMinutes, 0)
  const plannedHours = (totalMinutes / 60).toFixed(1)
  const completedHours = (completedMinutes / 60).toFixed(1)
  const capacityHours = 6.0
  const progressPercent = Math.min(Math.round((completedMinutes / (totalMinutes || 1)) * 100), 100)

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const weekDays = [
    { label: 'Sun', date: '11 Oct', num: 0 },
    { label: 'Mon', date: '12 Oct', num: 1, active: true },
    { label: 'Tue', date: '13 Oct', num: 2 },
    { label: 'Wed', date: '14 Oct', num: 3 },
    { label: 'Thu', date: '15 Oct', num: 4 },
    { label: 'Fri', date: '16 Oct', num: 5 },
    { label: 'Sat', date: '17 Oct', num: 6 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-primary" />
            Study Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan, track, and adapt your daily study missions and weekly goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('daily')}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-md transition-all',
                activeTab === 'daily'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Daily View
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-md transition-all',
                activeTab === 'weekly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Weekly Overview
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="pm-btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Week Strip Navigation */}
      <div className="grid grid-cols-7 gap-2 p-2 rounded-xl bg-card border border-border">
        {weekDays.map((d) => {
          const isSelected = selectedDay === d.num
          return (
            <button
              key={d.label}
              onClick={() => setSelectedDay(d.num)}
              className={cn(
                'flex flex-col items-center py-2.5 px-2 rounded-lg transition-all text-center',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="text-xs uppercase tracking-wider">{d.label}</span>
              <span className={cn('text-sm mt-0.5', isSelected ? 'text-white' : 'text-foreground')}>
                {d.date}
              </span>
              {d.num === 1 && (
                <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5', isSelected ? 'bg-white' : 'bg-primary')} />
              )}
            </button>
          )
        })}
      </div>

      {/* Stats and Capacity Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pm-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Daily Capacity</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{plannedHours}h</span>
            <span className="text-xs text-muted-foreground">/ {capacityHours}h target</span>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(Number(plannedHours) / capacityHours * 100, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {plannedHours}h planned out of {capacityHours}h capacity ({Math.round(Number(plannedHours) / capacityHours * 100)}%)
          </p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tasks Progress</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {tasks.filter((t) => t.completed).length} / {tasks.length}
            </span>
            <span className="text-xs text-muted-foreground">completed</span>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {progressPercent}% of planned items checked off today
          </p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Focus Completed</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{completedHours}h</span>
            <span className="text-xs text-muted-foreground">studied</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            🔥 <strong>7-Day Streak active</strong>. Planned rest days preserve your momentum.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                filter === tab
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab} ({tab === 'all' ? tasks.length : tab === 'pending' ? tasks.filter((t) => !t.completed).length : tasks.filter((t) => t.completed).length})
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="pm-card p-12 text-center">
            <ListTodo className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground">No tasks match this filter</p>
            <p className="text-xs text-muted-foreground mt-1">Try switching tabs or click Add Task above.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'pm-card p-4 flex items-center justify-between gap-4 transition-all hover:border-primary/40',
                task.completed && 'opacity-60 bg-muted/30'
              )}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={cn(
                        'text-sm font-medium text-foreground truncate',
                        task.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </p>
                    <span
                      className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                        SUBJECT_COLORS[task.subject] || 'bg-muted text-muted-foreground'
                      )}
                    >
                      {task.subject}
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                        High
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.durationMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {task.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!task.completed && (
                  <button
                    onClick={() => deferTask(task.id)}
                    title="Defer to tomorrow"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-xs">Defer</span>
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Add Study Mission</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 30 Trigonometry Questions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Reasoning">Reasoning & General Intelligence</option>
                  <option value="English">English Comprehension</option>
                  <option value="General Awareness">General Awareness</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button type="submit" className="pm-btn-primary px-4 py-2 text-sm">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
