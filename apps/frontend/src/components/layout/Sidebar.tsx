import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  LayoutDashboard,
  ClipboardList,
  CalendarRange,
  BookOpen,
  FileSpreadsheet,
  BarChart2,
  FileText,
  Sparkles,
  TrendingUp,
  CalendarDays,
  Award,
  Settings,
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  Flame,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/planner', label: 'My Plan', icon: ClipboardList },
  { to: '/weekly-planner', label: 'Weekly Planner', icon: CalendarRange },
  { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { to: '/mock-tests', label: 'Mock Tests', icon: FileSpreadsheet },
  { to: '/analytics', label: 'Analysis', icon: BarChart2 },
  { to: '/journal', label: 'Notes & Resources', icon: FileText },
  { to: '/mentor', label: 'AI Mentor', icon: Sparkles },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const userName = user?.displayName || 'Aman'

  return (
    <aside
      className={cn(
        'flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out select-none',
        'bg-[#121c2d] text-slate-200 border-r border-[#1e2d45] z-30',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center h-16 px-4 shrink-0 border-b border-[#1c2a40]',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight leading-none block">
                PrepMate
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Plan • Study • Grow
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
        )}

        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar" role="navigation">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.08]',
                    collapsed && 'justify-center px-0 py-2.5'
                  )
                }
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
              >
                <Icon className={cn('h-4 w-4 shrink-0', collapsed ? 'h-5 w-5' : '')} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Motivation Card (when expanded) */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-[#18243a] border border-[#233552] p-3.5 shadow-md">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>Stay Consistent</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 italic pt-0.5">
                "Discipline today creates the freedom tomorrow."
              </p>
            </div>
            {/* Scenic background illustration */}
            <div className="mt-2.5 h-16 w-full overflow-hidden rounded-xl relative">
              <img
                src="/assets/sidebar-mountain.jpg"
                alt="Scenic sunset"
                className="h-full w-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18243a] via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#1c2a40] bg-[#0e1624]/60">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl p-1.5 hover:bg-white/[0.06] transition-colors cursor-pointer',
            collapsed && 'justify-center p-1'
          )}
        >
          <img
            src="/assets/aman-avatar.jpg"
            alt={userName}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate">SSC CGL Aspirant</p>
            </div>
          )}
          {!collapsed && <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
        </div>
      </div>
    </aside>
  )
}

