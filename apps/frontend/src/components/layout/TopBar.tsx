import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { Search, Sun, Moon, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  sidebarCollapsed: boolean
}

export function TopBar({ sidebarCollapsed: _ }: TopBarProps) {
  const { user, signOutUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isDarkMode = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
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

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
        </button>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
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
