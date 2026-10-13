import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Search,
  Sun,
  Moon,
  Bell,
  LogOut,
  Flame,
  RotateCw,
  Award,
  Calendar,
  CheckCheck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  sidebarCollapsed: boolean
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  type: 'streak' | 'revision' | 'mock' | 'exam'
  route?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '7-Day Streak Active 🔥',
    message: '2 tasks remaining on your schedule for today (Mon, 12 Oct).',
    time: '15m ago',
    unread: true,
    type: 'streak',
    route: '/planner',
  },
  {
    id: '2',
    title: 'Flashcards Due for Review 🗂️',
    message: '3 Quant formula cards are due for spaced repetition today.',
    time: '1h ago',
    unread: true,
    type: 'revision',
    route: '/revisions',
  },
  {
    id: '3',
    title: 'Mock Test #5 Analysis Ready 📊',
    message: 'Scored 148.5/200 (+6.5 in English). Check mistake logs in Error Notebook.',
    time: '3h ago',
    unread: true,
    type: 'mock',
    route: '/mock-tests',
  },
  {
    id: '4',
    title: 'SSC CGL 2026 Notification 📅',
    message: '332 days until Tier 1. Syllabus is currently 56% completed.',
    time: '1d ago',
    unread: false,
    type: 'exam',
    route: '/syllabus',
  },
]

export function TopBar({ sidebarCollapsed: _ }: TopBarProps) {
  const { user, signOutUser } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isDarkMode = resolvedTheme === 'dark'
  const unreadCount = notifications.filter((n) => n.unread).length

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  // Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    )
    setShowNotifications(false)
    if (item.route) {
      navigate(item.route)
    }
  }

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'streak':
        return <Flame className="h-4 w-4 text-amber-500 shrink-0" />
      case 'revision':
        return <RotateCw className="h-4 w-4 text-blue-500 shrink-0" />
      case 'mock':
        return <Award className="h-4 w-4 text-emerald-500 shrink-0" />
      case 'exam':
        return <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-card/60 backdrop-blur-md px-6 z-20">
      {/* Search Input Bar */}
      <div className="flex items-center flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, tasks, tests..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-xl text-xs',
              'bg-slate-100/90 dark:bg-slate-800/80 text-foreground placeholder:text-muted-foreground',
              'border border-slate-200/80 dark:border-slate-700/80',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
              'transition-all duration-200 shadow-inner'
            )}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Sleek Theme Switcher */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm">
          <Sun
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              !isDarkMode ? 'text-amber-500' : 'text-slate-400'
            )}
          />
          <button
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            onClick={toggleTheme}
            className={cn(
              'relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
              isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
            )}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                isDarkMode ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </button>
          <Moon
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              isDarkMode ? 'text-blue-400' : 'text-slate-400'
            )}
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications((v) => !v)
              setShowUserMenu(false)
            }}
            className={cn(
              'relative p-2 rounded-xl text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
              showNotifications && 'bg-slate-100 dark:bg-slate-800 text-foreground'
            )}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-card shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl py-2 z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No new notifications right now.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        'group flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left',
                        item.unread
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/35'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      )}
                    >
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/50 shrink-0">
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={cn(
                              'text-xs truncate',
                              item.unread
                                ? 'font-semibold text-foreground'
                                : 'font-medium text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDismiss(e, item.id)}
                        title="Dismiss"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Study & Exam alerts</span>
                <button
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/settings')
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Notification Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu((v) => !v)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-blue-500/40 transition-all focus:outline-none"
            title={user?.displayName || 'Aman'}
          >
            <img
              src="/assets/aman-avatar.jpg"
              alt={user?.displayName || 'Aman'}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-border shadow-sm"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg py-1.5 z-50 animate-fade-in">
              <div className="px-3.5 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.displayName || 'Aman'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || 'aman@prepmate.app'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  signOutUser()
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
