import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  subtitle: string
  cardBg: string
  badgeColor: string
  textColor: string
  subtextColor: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak',
    title: '7',
    subtitle: 'Days Streak',
    cardBg:
      'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/80 dark:border-amber-700/50 hover:border-amber-400',
    badgeColor: '#f59e0b',
    textColor: 'text-amber-950 dark:text-amber-100',
    subtextColor: 'text-amber-800/80 dark:text-amber-300/80',
  },
  {
    id: 'solved',
    title: '1000',
    subtitle: 'Questions Solved',
    cardBg:
      'bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/80 dark:border-purple-700/50 hover:border-purple-400',
    badgeColor: '#9333ea',
    textColor: 'text-purple-950 dark:text-purple-100',
    subtextColor: 'text-purple-800/80 dark:text-purple-300/80',
  },
  {
    id: 'mock',
    title: 'First',
    subtitle: 'Mock Test',
    cardBg:
      'bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent border-blue-200/80 dark:border-blue-700/50 hover:border-blue-400',
    badgeColor: '#3b82f6',
    textColor: 'text-blue-950 dark:text-blue-100',
    subtextColor: 'text-blue-800/80 dark:text-blue-300/80',
  },
  {
    id: 'revision',
    title: 'Revision',
    subtitle: 'Master',
    cardBg:
      'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200/80 dark:border-emerald-700/50 hover:border-emerald-400',
    badgeColor: '#10b981',
    textColor: 'text-emerald-950 dark:text-emerald-100',
    subtextColor: 'text-emerald-800/80 dark:text-emerald-300/80',
  },
]

export function RecentAchievementsCard() {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Achievements
          </h2>
          <Link
            to="/achievements"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-0.5 group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* 4 Medallion Badges Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-3.5">
          {/* Badge 1: 7 Days Streak */}
          <div
            className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${ACHIEVEMENTS[0].cardBg}`}
          >
            {/* Gold Medallion SVG */}
            <div className="shrink-0 mb-1.5 drop-shadow-sm">
              <svg width="40" height="44" viewBox="0 0 44 48" fill="none">
                <defs>
                  <linearGradient id="goldRibbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="goldMedal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path d="M14 26 L10 44 L18 39 L22 44 L22 26 Z" fill="url(#goldRibbon)" opacity="0.9" />
                <path d="M30 26 L34 44 L26 39 L22 44 L22 26 Z" fill="url(#goldRibbon)" opacity="0.8" />
                <circle cx="22" cy="20" r="17" fill="url(#goldMedal)" />
                <circle
                  cx="22"
                  cy="20"
                  r="14.5"
                  stroke="#fef3c7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  fill="none"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="12" fill="#d97706" />
                <text
                  x="22"
                  y="25"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="#ffffff"
                  fontFamily="system-ui, sans-serif"
                >
                  7
                </text>
              </svg>
            </div>
            <div className="w-full">
              <p className={`text-xs font-bold leading-tight ${ACHIEVEMENTS[0].textColor}`}>7</p>
              <p
                className={`text-[9px] font-semibold mt-0.5 leading-tight ${ACHIEVEMENTS[0].subtextColor}`}
              >
                Days Streak
              </p>
            </div>
          </div>

          {/* Badge 2: 1000 Questions Solved */}
          <div
            className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${ACHIEVEMENTS[1].cardBg}`}
          >
            {/* Purple Trophy Rosette SVG */}
            <div className="shrink-0 mb-1.5 drop-shadow-sm">
              <svg width="40" height="44" viewBox="0 0 44 48" fill="none">
                <defs>
                  <linearGradient id="purpleRibbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#5b21b6" />
                  </linearGradient>
                  <linearGradient id="purpleMedal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e9d5ff" />
                    <stop offset="35%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#6b21a8" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 26 L10 44 L18 39 L22 44 L22 26 Z"
                  fill="url(#purpleRibbon)"
                  opacity="0.9"
                />
                <path
                  d="M30 26 L34 44 L26 39 L22 44 L22 26 Z"
                  fill="url(#purpleRibbon)"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="17" fill="url(#purpleMedal)" />
                <circle
                  cx="22"
                  cy="20"
                  r="14.5"
                  stroke="#f3e8ff"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  fill="none"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="12" fill="#6b21a8" />
                <path
                  d="M17 14 H27 V18.5 C27 20.8 24.8 22.5 22 22.5 C19.2 22.5 17 20.8 17 18.5 V14 Z M15.5 15 H17 V17.5 H15.5 Z M27 15 H28.5 V17.5 H27 Z M21 22.5 H23 V25 H21 Z M19 25 H25 V26 H19 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div className="w-full">
              <p className={`text-xs font-bold leading-tight ${ACHIEVEMENTS[1].textColor}`}>1000</p>
              <p
                className={`text-[9px] font-semibold mt-0.5 leading-tight ${ACHIEVEMENTS[1].subtextColor}`}
              >
                Questions Solved
              </p>
            </div>
          </div>

          {/* Badge 3: First Mock Test */}
          <div
            className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${ACHIEVEMENTS[2].cardBg}`}
          >
            {/* Blue Star Medallion SVG */}
            <div className="shrink-0 mb-1.5 drop-shadow-sm">
              <svg width="40" height="44" viewBox="0 0 44 48" fill="none">
                <defs>
                  <linearGradient id="blueRibbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="blueMedal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="35%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <path d="M14 26 L10 44 L18 39 L22 44 L22 26 Z" fill="url(#blueRibbon)" opacity="0.9" />
                <path d="M30 26 L34 44 L26 39 L22 44 L22 26 Z" fill="url(#blueRibbon)" opacity="0.8" />
                <circle cx="22" cy="20" r="17" fill="url(#blueMedal)" />
                <circle
                  cx="22"
                  cy="20"
                  r="14.5"
                  stroke="#dbeafe"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  fill="none"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="12" fill="#1d4ed8" />
                <path
                  d="M22 13.5 L23.8 17.2 L28 17.8 L24.8 21 L25.6 25.2 L22 23 L18.4 25.2 L19.2 21 L16 17.8 L20.2 17.2 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div className="w-full">
              <p className={`text-xs font-bold leading-tight ${ACHIEVEMENTS[2].textColor}`}>First</p>
              <p
                className={`text-[9px] font-semibold mt-0.5 leading-tight ${ACHIEVEMENTS[2].subtextColor}`}
              >
                Mock Test
              </p>
            </div>
          </div>

          {/* Badge 4: Revision Master */}
          <div
            className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${ACHIEVEMENTS[3].cardBg}`}
          >
            {/* Green Clover / Laurel Medallion SVG */}
            <div className="shrink-0 mb-1.5 drop-shadow-sm">
              <svg width="40" height="44" viewBox="0 0 44 48" fill="none">
                <defs>
                  <linearGradient id="greenRibbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="greenMedal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="35%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 26 L10 44 L18 39 L22 44 L22 26 Z"
                  fill="url(#greenRibbon)"
                  opacity="0.9"
                />
                <path
                  d="M30 26 L34 44 L26 39 L22 44 L22 26 Z"
                  fill="url(#greenRibbon)"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="17" fill="url(#greenMedal)" />
                <circle
                  cx="22"
                  cy="20"
                  r="14.5"
                  stroke="#d1fae5"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  fill="none"
                  opacity="0.8"
                />
                <circle cx="22" cy="20" r="12" fill="#047857" />
                <path
                  d="M22 14.5 A5.5 5.5 0 0 1 27.5 20 H26 L28.5 23 L31 20 H29.5 A7.5 7.5 0 0 0 22 12.5 Z M22 25.5 A5.5 5.5 0 0 1 16.5 20 H18 L15.5 17 L13 20 H14.5 A7.5 7.5 0 0 0 22 27.5 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div className="w-full">
              <p className={`text-xs font-bold leading-tight ${ACHIEVEMENTS[3].textColor}`}>
                Revision
              </p>
              <p
                className={`text-[9px] font-semibold mt-0.5 leading-tight ${ACHIEVEMENTS[3].subtextColor}`}
              >
                Master
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone Footer Bar (fills vertical space elegantly) */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-amber-500/10 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 shrink-0">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              Next: 14 Days Streak
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">12 / 14 days · +150 XP</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">85%</span>
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
