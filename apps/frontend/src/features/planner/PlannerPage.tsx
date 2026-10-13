import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Flame,
  BookOpen,
  Target,
  BarChart3,
  X,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const TODAY_DATE = '2026-10-12'
export const isDatePast = (date: string) => date < TODAY_DATE

interface TaskItem {
  id: string
  title: string
  subject: string
  durationMinutes: number
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  date: string
  taskType?: 'learn' | 'practice' | 'revision' | 'mock_test'
}

const WEEK_DAYS = [
  { num: 0, day: 'Sun', date: '2026-10-11', displayDate: '11 Oct', tag: 'Revision & Recap', isToday: false },
  { num: 1, day: 'Mon', date: '2026-10-12', displayDate: '12 Oct', tag: 'Foundation Drills', isToday: true },
  { num: 2, day: 'Tue', date: '2026-10-13', displayDate: '13 Oct', tag: 'Geometry & Reasoning', isToday: false },
  { num: 3, day: 'Wed', date: '2026-10-14', displayDate: '14 Oct', tag: 'Algebra & Vocab', isToday: false },
  { num: 4, day: 'Thu', date: '2026-10-15', displayDate: '15 Oct', tag: 'Trig & Polity', isToday: false },
  { num: 5, day: 'Fri', date: '2026-10-16', displayDate: '16 Oct', tag: 'Sectional Drills', isToday: false },
  { num: 6, day: 'Sat', date: '2026-10-17', displayDate: '17 Oct', tag: 'Full Mock Test 05', isToday: false },
]

const INITIAL_TASKS: TaskItem[] = [
  // Sunday 11 Oct
  {
    id: 'sun-1',
    title: 'Weekly Error Log & Weak Topic Remedial Review',
    subject: 'Quantitative Aptitude',
    durationMinutes: 45,
    completed: true,
    priority: 'high',
    date: '2026-10-11',
    taskType: 'revision',
  },
  {
    id: 'sun-2',
    title: 'Grammar 120 Rules Master Flashcards Review',
    subject: 'English',
    durationMinutes: 45,
    completed: true,
    priority: 'medium',
    date: '2026-10-11',
    taskType: 'revision',
  },

  // Monday 12 Oct (Today)
  {
    id: 'mon-1',
    title: 'Percentage & Ratio Shortcuts (Tier 1)',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: true,
    priority: 'high',
    date: '2026-10-12',
    taskType: 'learn',
  },
  {
    id: 'mon-2',
    title: 'Syllogism & Venn Diagrams Practice (50 Qs)',
    subject: 'Reasoning',
    durationMinutes: 45,
    completed: false,
    priority: 'high',
    date: '2026-10-12',
    taskType: 'practice',
  },
  {
    id: 'mon-3',
    title: 'Error Spotting & Idioms Revision (Set 4)',
    subject: 'English',
    durationMinutes: 40,
    completed: false,
    priority: 'medium',
    date: '2026-10-12',
    taskType: 'practice',
  },
  {
    id: 'mon-4',
    title: 'Indian Polity: Articles 1-51A & Fundamental Rights',
    subject: 'General Awareness',
    durationMinutes: 60,
    completed: false,
    priority: 'medium',
    date: '2026-10-12',
    taskType: 'learn',
  },
  {
    id: 'mon-5',
    title: 'Speed Maths & Mental Calculations drills',
    subject: 'Quantitative Aptitude',
    durationMinutes: 30,
    completed: false,
    priority: 'low',
    date: '2026-10-12',
    taskType: 'practice',
  },

  // Tuesday 13 Oct
  {
    id: 'tue-1',
    title: 'Geometry: Circles, Chords & Tangent Theorems',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-13',
    taskType: 'learn',
  },
  {
    id: 'tue-2',
    title: 'Circular Seating Arrangement & Ranking Puzzles',
    subject: 'Reasoning',
    durationMinutes: 45,
    completed: false,
    priority: 'high',
    date: '2026-10-13',
    taskType: 'practice',
  },
  {
    id: 'tue-3',
    title: 'Reading Comprehension Passages & Tone Analysis',
    subject: 'English',
    durationMinutes: 40,
    completed: false,
    priority: 'medium',
    date: '2026-10-13',
    taskType: 'practice',
  },
  {
    id: 'tue-4',
    title: 'Modern History: Revolt of 1857 & Freedom Movement',
    subject: 'General Awareness',
    durationMinutes: 50,
    completed: false,
    priority: 'medium',
    date: '2026-10-13',
    taskType: 'learn',
  },

  // Wednesday 14 Oct
  {
    id: 'wed-1',
    title: 'Algebra: Symmetric Functions & Min/Max Values',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-14',
    taskType: 'learn',
  },
  {
    id: 'wed-2',
    title: 'Coding-Decoding & High-Frequency Number Analogies',
    subject: 'Reasoning',
    durationMinutes: 45,
    completed: false,
    priority: 'medium',
    date: '2026-10-14',
    taskType: 'practice',
  },
  {
    id: 'wed-3',
    title: '100 One-Word Substitutions & Spelling Drills',
    subject: 'English',
    durationMinutes: 35,
    completed: false,
    priority: 'medium',
    date: '2026-10-14',
    taskType: 'revision',
  },
  {
    id: 'wed-4',
    title: 'Physical Geography: Indian Drainage System & Passes',
    subject: 'General Awareness',
    durationMinutes: 45,
    completed: false,
    priority: 'low',
    date: '2026-10-14',
    taskType: 'learn',
  },

  // Thursday 15 Oct
  {
    id: 'thu-1',
    title: 'Trigonometry: Heights, Distances & Identities',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-15',
    taskType: 'learn',
  },
  {
    id: 'thu-2',
    title: 'Coded Blood Relations & Family Tree Drills',
    subject: 'Reasoning',
    durationMinutes: 40,
    completed: false,
    priority: 'medium',
    date: '2026-10-15',
    taskType: 'practice',
  },
  {
    id: 'thu-3',
    title: 'Cloze Test & Sentence Improvement (4 Sets)',
    subject: 'English',
    durationMinutes: 45,
    completed: false,
    priority: 'medium',
    date: '2026-10-15',
    taskType: 'practice',
  },
  {
    id: 'thu-4',
    title: 'General Science: Human Physiology & Diseases',
    subject: 'General Awareness',
    durationMinutes: 45,
    completed: false,
    priority: 'low',
    date: '2026-10-15',
    taskType: 'learn',
  },

  // Friday 16 Oct
  {
    id: 'fri-1',
    title: 'Data Interpretation: Tabular Charts & Caselets',
    subject: 'Quantitative Aptitude',
    durationMinutes: 50,
    completed: false,
    priority: 'high',
    date: '2026-10-16',
    taskType: 'practice',
  },
  {
    id: 'fri-2',
    title: 'Statement & Conclusions + Course of Action',
    subject: 'Reasoning',
    durationMinutes: 40,
    completed: false,
    priority: 'medium',
    date: '2026-10-16',
    taskType: 'practice',
  },
  {
    id: 'fri-3',
    title: 'Voice (Active/Passive) & Narration Drills',
    subject: 'English',
    durationMinutes: 45,
    completed: false,
    priority: 'medium',
    date: '2026-10-16',
    taskType: 'practice',
  },
  {
    id: 'fri-4',
    title: 'Current Affairs: 6-Month Highlights & Schemes',
    subject: 'General Awareness',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-16',
    taskType: 'revision',
  },

  // Saturday 17 Oct
  {
    id: 'sat-1',
    title: 'SSC CGL Full-Length Mock Test 05 (Tier 1)',
    subject: 'Quantitative Aptitude',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-17',
    taskType: 'mock_test',
  },
  {
    id: 'sat-2',
    title: 'Mock Test 05 Analysis & Sectional Accuracy Log',
    subject: 'Reasoning',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
    date: '2026-10-17',
    taskType: 'practice',
  },
  {
    id: 'sat-3',
    title: 'Weak Area Revision & Formula Book Refresh',
    subject: 'English',
    durationMinutes: 45,
    completed: false,
    priority: 'medium',
    date: '2026-10-17',
    taskType: 'revision',
  },
]

const SUBJECT_COLORS: Record<string, { badge: string; dot: string; text: string }> = {
  'Quantitative Aptitude': {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dot: 'bg-blue-500',
    text: 'text-blue-500',
  },
  'Reasoning': {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
    text: 'text-emerald-500',
  },
  'English': {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
    text: 'text-amber-500',
  },
  'General Awareness': {
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dot: 'bg-purple-500',
    text: 'text-purple-500',
  },
}

export function PlannerPage() {
  const location = useLocation()
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('prepmate_planner_tasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback to initial tasks
    }
    return INITIAL_TASKS
  })

  // Synchronize tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('prepmate_planner_tasks', JSON.stringify(tasks))
    } catch {
      // ignore
    }
  }, [tasks])

  // Listen for tasks added from AI Mentor or other components
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('prepmate_planner_tasks')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) setTasks(parsed)
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener('prepmate_tasks_updated', handleSync)
    return () => window.removeEventListener('prepmate_tasks_updated', handleSync)
  }, [])

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>(() =>
    location.pathname === '/weekly-planner' ? 'weekly' : 'daily'
  )
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    if (location.pathname === '/weekly-planner') {
      setActiveTab('weekly')
    } else if (location.pathname === '/planner') {
      setActiveTab('daily')
    }
  }, [location.pathname])
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('2026-10-12') // Monday today
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Focus Timer Session State
  const [activeFocusTask, setActiveFocusTask] = useState<TaskItem | null>(null)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Add Task Modal Form State
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Quantitative Aptitude')
  const [newDuration, setNewDuration] = useState(45)
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [newTaskDate, setNewTaskDate] = useState('2026-10-12')
  const [newTaskType, setNewTaskType] = useState<'learn' | 'practice' | 'revision' | 'mock_test'>('practice')

  // Auto-sync form date when modal opens with selectedDate (prevent past dates)
  const handleOpenAddModal = (dateToUse?: string) => {
    const targetDate = dateToUse || selectedDate
    // Past days cannot have new tasks added; fallback to today
    const safeDate = isDatePast(targetDate) ? TODAY_DATE : targetDate
    setNewTaskDate(safeDate)
    setNewTitle('')
    setShowAddModal(true)
  }

  // Timer Countdown Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1)
      }, 1000)
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      if (activeFocusTask) {
        toggleTask(activeFocusTask.id)
        showToast(`🎉 Focus session completed: "${activeFocusTask.title}"`)
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerSecondsLeft, activeFocusTask])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    if (isDatePast(task.date)) {
      showToast('🔒 Plan locked: Tasks from previous days cannot be modified.')
      return
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed
          if (nextCompleted) {
            showToast(`Mission completed! +${t.durationMinutes * 2} XP earned.`)
          }
          return { ...t, completed: nextCompleted }
        }
        return t
      })
    )
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    if (!taskToDelete) return
    if (isDatePast(taskToDelete.date)) {
      showToast('🔒 Plan locked: Tasks from previous days cannot be deleted.')
      return
    }
    setTasks((prev) => prev.filter((t) => t.id !== id))
    showToast(`Removed "${taskToDelete.title}"`)
  }

  const deferTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    if (isDatePast(task.date)) {
      showToast('🔒 Plan locked: Tasks from previous days cannot be deferred.')
      return
    }

    const currentIndex = WEEK_DAYS.findIndex((d) => d.date === task.date)
    let nextIndex =
      currentIndex >= 0 && currentIndex < WEEK_DAYS.length - 1
        ? currentIndex + 1
        : currentIndex

    // Ensure target day is not past
    while (nextIndex < WEEK_DAYS.length && isDatePast(WEEK_DAYS[nextIndex].date)) {
      nextIndex++
    }
    if (nextIndex >= WEEK_DAYS.length) {
      nextIndex = WEEK_DAYS.findIndex((d) => d.date === TODAY_DATE)
    }

    const nextDate = WEEK_DAYS[nextIndex].date
    const nextDayLabel = WEEK_DAYS[nextIndex].day ?? 'next day'

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, date: nextDate } : t))
    )
    showToast(`Deferred "${task.title.slice(0, 30)}..." to ${nextDayLabel}`)
  }

  const handleStartFocus = (task: TaskItem) => {
    if (isDatePast(task.date)) {
      showToast('🔒 Focus timer cannot be started for previous days.')
      return
    }
    setActiveFocusTask(task)
    setTimerSecondsLeft(task.durationMinutes * 60)
    setIsTimerRunning(true)
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    if (isDatePast(newTaskDate)) {
      showToast('🔒 Cannot add tasks to previous days.')
      return
    }

    const newTask: TaskItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      durationMinutes: Number(newDuration),
      completed: false,
      priority: newPriority,
      date: newTaskDate,
      taskType: newTaskType,
    }

    setTasks((prev) => [newTask, ...prev])
    setShowAddModal(false)
    setNewTitle('')
    showToast(`Added new task to ${WEEK_DAYS.find((d) => d.date === newTaskDate)?.day || newTaskDate}!`)
  }

  // Selected Day Calculation
  const selectedDayInfo = WEEK_DAYS.find((d) => d.date === selectedDate) || WEEK_DAYS[1]
  const isSelectedDayPast = isDatePast(selectedDate)
  const currentDayTasks = tasks.filter((t) => t.date === selectedDate)

  const dayTotalMinutes = currentDayTasks.reduce((sum, t) => sum + t.durationMinutes, 0)
  const dayCompletedMinutes = currentDayTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.durationMinutes, 0)

  const dayPlannedHours = (dayTotalMinutes / 60).toFixed(1)
  const dayCompletedHours = (dayCompletedMinutes / 60).toFixed(1)
  const capacityHours = 6.0
  const dayProgressPercent = Math.min(
    Math.round((dayCompletedMinutes / (dayTotalMinutes || 1)) * 100),
    100
  )

  // Filter tasks for Daily View
  const filteredDailyTasks = currentDayTasks.filter((t) => {
    if (filter === 'pending' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    if (subjectFilter !== 'all' && t.subject !== subjectFilter) return false
    return true
  })

  // Weekly Overview Computations
  const totalWeeklyMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0)
  const completedWeeklyMinutes = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.durationMinutes, 0)
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1)
  const completedWeeklyHours = (completedWeeklyMinutes / 60).toFixed(1)
  const weeklyTargetHours = 36.0
  const weeklyProgressPercent = Math.min(
    Math.round((completedWeeklyMinutes / (totalWeeklyMinutes || 1)) * 100),
    100
  )

  // Weekly Subject Hours
  const subjectHours = ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'].map(
    (subj) => {
      const minutes = tasks
        .filter((t) => t.subject === subj)
        .reduce((sum, t) => sum + t.durationMinutes, 0)
      return {
        subject: subj,
        hours: (minutes / 60).toFixed(1),
        percentage: Math.round((minutes / (totalWeeklyMinutes || 1)) * 100),
      }
    }
  )

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border shadow-2xl text-foreground text-sm font-medium animate-fade-in">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-primary" />
            Study Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan, track, and adapt your daily study missions and weekly goals for SSC CGL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Daily vs Weekly Toggle */}
          <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('daily')}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all',
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
                'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all',
                activeTab === 'weekly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Weekly Overview
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => handleOpenAddModal(isSelectedDayPast ? TODAY_DATE : selectedDate)}
            className="pm-btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* ── DAILY VIEW CONTENT ──────────────────────────────────────────────── */}
      {activeTab === 'daily' && (
        <>
          {/* Week Strip Navigation */}
          <div className="rounded-xl bg-card border border-border p-2">
            <div className="grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((d) => {
                const isSelected = selectedDate === d.date
                const isPast = isDatePast(d.date)
                const dayTasks = tasks.filter((t) => t.date === d.date)
                const dayCompleted = dayTasks.length > 0 && dayTasks.every((t) => t.completed)
                const hasPending = dayTasks.some((t) => !t.completed)

                return (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    title={isPast ? `${d.day} ${d.displayDate} • Previous Day (Locked)` : `${d.day} ${d.displayDate}`}
                    className={cn(
                      'flex flex-col items-center py-2.5 px-2 rounded-lg transition-all text-center relative group',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-md font-semibold'
                        : isPast
                        ? 'hover:bg-muted/70 text-muted-foreground/80'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium">
                      <span>{d.day}</span>
                      {isPast && (
                        <Lock
                          className={cn(
                            'h-2.5 w-2.5 shrink-0',
                            isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground/60'
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold mt-0.5',
                        isSelected ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {d.displayDate}
                    </span>

                    {/* Status Dots */}
                    <div className="flex items-center gap-1 mt-1.5">
                      {d.isToday && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-white' : 'bg-primary'
                          )}
                          title="Today"
                        />
                      )}
                      {dayCompleted && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                          )}
                          title="All tasks completed"
                        />
                      )}
                      {!dayCompleted && hasPending && !d.isToday && (
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-amber-300' : 'bg-amber-500'
                          )}
                          title={isPast ? 'Incomplete historical items' : 'Pending tasks'}
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Sub-strip with Selected Day Banner */}
            <div className="mt-2.5 pt-2.5 border-t border-border/60 px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">
                  {selectedDayInfo.day}, {selectedDayInfo.displayDate}:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[11px]">
                  {selectedDayInfo.tag}
                </span>
                {selectedDayInfo.isToday ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                    Today
                  </span>
                ) : isSelectedDayPast ? (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold text-[10px] flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    Past Day • Read-Only
                  </span>
                ) : null}
              </div>

              {!selectedDayInfo.isToday && (
                <button
                  onClick={() => setSelectedDate(TODAY_DATE)}
                  className="text-primary hover:underline font-semibold text-xs self-start sm:self-auto flex items-center gap-1"
                >
                  <span>Jump back to Today (Mon 12 Oct) →</span>
                </button>
              )}
            </div>

            {/* Locked Warning Alert Bar if past day */}
            {isSelectedDayPast && (
              <div className="mt-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">Historical Record (Locked):</span> You cannot edit, complete, delete, defer, or add tasks for previous days.
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDate(TODAY_DATE)}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] shrink-0 transition-colors shadow-sm self-start sm:self-auto"
                >
                  Switch to Today
                </button>
              </div>
            )}
          </div>

          {/* Stats and Capacity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Daily Capacity */}
            <div className="pm-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Daily Capacity</span>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{dayPlannedHours}h</span>
                <span className="text-xs text-muted-foreground">/ {capacityHours}h target</span>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min((Number(dayPlannedHours) / capacityHours) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {dayPlannedHours}h planned out of {capacityHours}h maximum capacity (
                {Math.round((Number(dayPlannedHours) / capacityHours) * 100)}%)
              </p>
            </div>

            {/* Tasks Progress */}
            <div className="pm-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Tasks Progress</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {currentDayTasks.filter((t) => t.completed).length} / {currentDayTasks.length}
                </span>
                <span className="text-xs text-muted-foreground">completed</span>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {dayProgressPercent}% of planned items checked off for this day
              </p>
            </div>

            {/* Focus Completed */}
            <div className="pm-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Focus Completed</span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{dayCompletedHours}h</span>
                <span className="text-xs text-muted-foreground">studied</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                🔥 <strong>7-Day Streak active</strong>. Complete all daily targets to maintain your multiplier!
              </p>
            </div>
          </div>

          {/* Filter Bar & Subject Pill Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'completed'] as const).map((tab) => {
                const count =
                  tab === 'all'
                    ? currentDayTasks.length
                    : tab === 'pending'
                    ? currentDayTasks.filter((t) => !t.completed).length
                    : currentDayTasks.filter((t) => t.completed).length
                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors',
                      filter === tab
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {tab} ({count})
                  </button>
                )
              })}
            </div>

            {/* Subject Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              <span className="text-muted-foreground text-[11px] font-medium mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Subject:
              </span>
              <button
                onClick={() => setSubjectFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border',
                  subjectFilter === 'all'
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                )}
              >
                All
              </button>
              {['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSubjectFilter(subj)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border whitespace-nowrap',
                    subjectFilter === subj
                      ? 'bg-primary/15 text-primary border-primary font-semibold'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {subj === 'Quantitative Aptitude'
                    ? 'Quant'
                    : subj === 'General Awareness'
                    ? 'GA'
                    : subj}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Task List */}
          <div className="space-y-3">
            {filteredDailyTasks.length === 0 ? (
              <div className="pm-card p-12 text-center">
                <ListTodo className="h-9 w-9 text-muted-foreground mx-auto mb-3 opacity-60" />
                <p className="font-semibold text-foreground text-base">No tasks match this filter</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  {currentDayTasks.length === 0
                    ? isSelectedDayPast
                      ? `No records found for ${selectedDayInfo.day}, ${selectedDayInfo.displayDate}. Historical days are locked.`
                      : `No tasks scheduled for ${selectedDayInfo.day}, ${selectedDayInfo.displayDate}. Click Add Task to schedule one!`
                    : 'Try selecting a different filter tab or clear the subject filter.'}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setFilter('all')
                      setSubjectFilter('all')
                    }}
                    className="pm-btn-secondary text-xs px-3 py-1.5"
                  >
                    Reset Filters
                  </button>
                  {isSelectedDayPast ? (
                    <button
                      onClick={() => setSelectedDate(TODAY_DATE)}
                      className="pm-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                    >
                      <span>Jump to Today's Plan →</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAddModal(selectedDate)}
                      className="pm-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Task for {selectedDayInfo.day}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredDailyTasks.map((task) => {
                const isTaskPast = isDatePast(task.date)
                const subjectColor =
                  SUBJECT_COLORS[task.subject] || {
                    badge: 'bg-muted text-muted-foreground border-border',
                    dot: 'bg-muted-foreground',
                    text: 'text-muted-foreground',
                  }

                return (
                  <div
                    key={task.id}
                    className={cn(
                      'pm-card p-4 flex items-center justify-between gap-4 transition-all hover:border-primary/40 group',
                      task.completed && 'opacity-65 bg-muted/20'
                    )}
                  >
                    {/* Left: Complete Checkbox + Title + Meta */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <button
                        disabled={isTaskPast}
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          'shrink-0 transition-transform',
                          isTaskPast
                            ? 'cursor-not-allowed opacity-75'
                            : 'text-muted-foreground hover:text-primary active:scale-95'
                        )}
                        title={
                          isTaskPast
                            ? 'Past day record (Locked — cannot be modified)'
                            : task.completed
                            ? 'Mark incomplete'
                            : 'Mark completed'
                        }
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle
                            className={cn(
                              'h-5 w-5',
                              isTaskPast ? 'text-muted-foreground/50' : 'hover:text-primary'
                            )}
                          />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={cn(
                              'text-sm font-semibold text-foreground truncate',
                              task.completed && 'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </p>

                          <span
                            className={cn(
                              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                              subjectColor.badge
                            )}
                          >
                            {task.subject}
                          </span>

                          {task.taskType && (
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {task.taskType.replace('_', ' ')}
                            </span>
                          )}

                          {task.priority === 'high' && (
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                              High Priority
                            </span>
                          )}
                          {task.priority === 'medium' && (
                            <span className="text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              Medium
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3 text-primary" />
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

                    {/* Right: Actions or Locked Badge */}
                    {isTaskPast ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/70 border border-border/70 px-2.5 py-1.5 rounded-lg select-none shrink-0">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        {!task.completed && (
                          <>
                            <button
                              onClick={() => handleStartFocus(task)}
                              title="Start study focus timer for this mission"
                              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary px-2.5 py-1.5 rounded-lg border border-primary/30 transition-all"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Start Focus</span>
                            </button>

                            <button
                              onClick={() => deferTask(task.id)}
                              title="Defer mission to tomorrow"
                              className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-medium flex items-center gap-1 transition-colors border border-transparent hover:border-border"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                              <span className="hidden md:inline">Defer</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {/* ── WEEKLY OVERVIEW CONTENT ─────────────────────────────────────────── */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          {/* Weekly Summary Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="pm-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Weekly Target</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{totalWeeklyHours}h</span>
                <span className="text-xs text-muted-foreground">/ {weeklyTargetHours}h target</span>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min((Number(totalWeeklyHours) / weeklyTargetHours) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {Math.round((Number(totalWeeklyHours) / weeklyTargetHours) * 100)}% scheduled
              </p>
            </div>

            <div className="pm-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Weekly Completion</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {tasks.filter((t) => t.completed).length} / {tasks.length}
                </span>
                <span className="text-xs text-muted-foreground">missions done</span>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${weeklyProgressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {completedWeeklyHours}h finished out of {totalWeeklyHours}h planned
              </p>
            </div>

            <div className="pm-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Study Velocity</span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">4.8h</span>
                <span className="text-xs text-muted-foreground">daily average</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                ⚡ Optimal pace for SSC Tier 1 syllabus completion before test date.
              </p>
            </div>

            <div className="pm-card p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
              <div className="flex items-center justify-between text-primary">
                <span className="text-xs font-semibold">Milestone Event</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-sm font-bold text-foreground">
                Full Mock Test 05
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saturday, 17 Oct • 100 Questions simulation
              </p>
              <button
                onClick={() => {
                  setSelectedDate('2026-10-17')
                  setActiveTab('daily')
                }}
                className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Saturday plan</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 7-Day Agenda Board */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                7-Day Weekly Schedule & Agenda
              </h2>
              <span className="text-xs text-muted-foreground">
                Click any day card to view or manage tasks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
              {WEEK_DAYS.map((day) => {
                const dayTasks = tasks.filter((t) => t.date === day.date)
                const completedCount = dayTasks.filter((t) => t.completed).length
                const dayMinutes = dayTasks.reduce((sum, t) => sum + t.durationMinutes, 0)
                const dayHours = (dayMinutes / 60).toFixed(1)

                return (
                  <div
                    key={day.date}
                    className={cn(
                      'pm-card p-3.5 flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/40',
                      day.isToday && 'ring-2 ring-primary/40 bg-primary/5',
                      day.date === selectedDate && 'border-primary'
                    )}
                  >
                    <div>
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground uppercase">
                              {day.day}
                            </span>
                            {day.isToday ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary text-primary-foreground">
                                Today
                              </span>
                            ) : isDatePast(day.date) ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-0.5">
                                <Lock className="h-2.5 w-2.5" />
                                Past
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {day.displayDate}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                          {dayHours}h
                        </span>
                      </div>

                      {/* Day Focus Tag */}
                      <div className="mt-2 text-[10px] font-medium text-muted-foreground truncate">
                        {day.tag}
                      </div>

                      {/* Task Chips List */}
                      <div className="mt-3 space-y-1.5">
                        {dayTasks.map((t) => {
                          const dotColor =
                            SUBJECT_COLORS[t.subject]?.dot || 'bg-muted-foreground'
                          return (
                            <div
                              key={t.id}
                              onClick={() => {
                                setSelectedDate(day.date)
                                setActiveTab('daily')
                              }}
                              className={cn(
                                'text-[11px] p-2 rounded-lg bg-muted/40 hover:bg-muted cursor-pointer transition-colors border border-border/40 flex items-start gap-1.5 group',
                                t.completed && 'opacity-60 line-through'
                              )}
                              title={t.title}
                            >
                              <span
                                className={cn('w-2 h-2 rounded-full mt-1 shrink-0', dotColor)}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-foreground">
                                  {t.title}
                                </p>
                                <span className="text-[10px] text-muted-foreground">
                                  {t.durationMinutes}m
                                </span>
                              </div>
                            </div>
                          )
                        })}

                        {dayTasks.length === 0 && (
                          <p className="text-[11px] text-muted-foreground italic py-3 text-center">
                            Rest day / No tasks
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                      {isDatePast(day.date) ? (
                        <span className="text-muted-foreground/75 flex items-center gap-1 font-medium select-none">
                          <Lock className="h-3 w-3 text-muted-foreground/70" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenAddModal(day.date)}
                          className="text-primary hover:underline font-semibold flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedDate(day.date)
                          setActiveTab('daily')
                        }}
                        className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Subject Distribution Breakdown */}
          <div className="pm-card p-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              Weekly Subject Distribution & Time Allocation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectHours.map((sh) => {
                const colorConfig =
                  SUBJECT_COLORS[sh.subject] || {
                    badge: '',
                    dot: 'bg-muted-foreground',
                    text: 'text-muted-foreground',
                  }
                return (
                  <div key={sh.subject} className="p-3.5 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground truncate">
                        {sh.subject}
                      </span>
                      <span className={cn('text-xs font-bold', colorConfig.text)}>
                        {sh.hours}h
                      </span>
                    </div>

                    <div className="mt-2.5 w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', colorConfig.dot)}
                        style={{ width: `${sh.percentage}%` }}
                      />
                    </div>

                    <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                      <span>{sh.percentage}% of weekly study</span>
                      <span>Target: ~8h</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── FOCUS TIMER SESSION MODAL ───────────────────────────────────────── */}
      {activeFocusTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-5 text-center relative">
            <button
              onClick={() => {
                setIsTimerRunning(false)
                setActiveFocusTask(null)
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                Active Study Mission
              </span>
              <h3 className="text-lg font-bold text-foreground mt-2">
                {activeFocusTask.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeFocusTask.subject} • {activeFocusTask.durationMinutes} min allocation
              </p>
            </div>

            {/* Giant Timer Display */}
            <div className="py-6 bg-muted/40 rounded-2xl border border-border/80">
              <span className="text-5xl font-extrabold tracking-tight text-foreground font-mono">
                {formatTimerTime(timerSecondsLeft)}
              </span>
              <p className="text-xs text-muted-foreground mt-2">
                {isTimerRunning ? '🔥 Deep focus mode engaged...' : 'Timer paused'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="pm-btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false)
                  setTimerSecondsLeft(activeFocusTask.durationMinutes * 60)
                }}
                className="pm-btn-secondary px-3.5 py-2.5 text-sm"
                title="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  toggleTask(activeFocusTask.id)
                  setIsTimerRunning(false)
                  setActiveFocusTask(null)
                  showToast(`🎉 Mission Completed: "${activeFocusTask.title}"`)
                }}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Mark Done</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TASK MODAL ──────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Add Study Mission</h3>
                <p className="text-xs text-muted-foreground">
                  Schedule a focused target for your SSC CGL prep.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 pt-2">
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
                  className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Reasoning">Reasoning & Intelligence</option>
                    <option value="English">English Comprehension</option>
                    <option value="General Awareness">General Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Scheduled Day
                  </label>
                  <select
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    {WEEK_DAYS.map((d) => {
                      const isPast = isDatePast(d.date)
                      return (
                        <option key={d.date} value={d.date} disabled={isPast}>
                          {d.day} ({d.displayDate}) {d.isToday ? '• Today' : isPast ? '• Past (Locked)' : ''}
                        </option>
                      )
                    })}
                  </select>
                  {isDatePast(newTaskDate) && (
                    <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>Past dates cannot be scheduled. Please select today or later.</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Mission Type
                  </label>
                  <select
                    value={newTaskType}
                    onChange={(e) =>
                      setNewTaskType(e.target.value as 'learn' | 'practice' | 'revision' | 'mock_test')
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="practice">Practice</option>
                    <option value="learn">Learn</option>
                    <option value="revision">Revision</option>
                    <option value="mock_test">Mock Test</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="pm-btn-secondary px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || isDatePast(newTaskDate)}
                  className="pm-btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
