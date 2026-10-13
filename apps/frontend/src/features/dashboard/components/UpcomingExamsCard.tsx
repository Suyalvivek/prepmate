import { Link } from 'react-router-dom'
import { GraduationCap, ShieldAlert, Award } from 'lucide-react'

interface ExamItem {
  name: string
  tier: string
  date: string
  daysLeft: number
  color: 'amber' | 'rose' | 'red'
  daysBadgeColor?: string
}

const UPCOMING_EXAMS: ExamItem[] = [
  {
    name: 'SSC CGL 2025',
    tier: 'Tier 1 (Expected)',
    date: '12 Jun 2025',
    daysLeft: 240,
    color: 'amber',
  },
  {
    name: 'SSC CPO 2025',
    tier: 'Tier 1 (Expected)',
    date: '20 Jul 2025',
    daysLeft: 278,
    color: 'rose',
  },
  {
    name: 'SSC CHSL 2025',
    tier: 'Tier 1 (Expected)',
    date: '05 Aug 2025',
    daysLeft: 294,
    color: 'red',
  },
]

export function UpcomingExamsCard() {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Upcoming Exams
        </h2>
        <Link
          to="/syllabus"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Exam Items */}
      <div className="mt-3 space-y-3">
        {UPCOMING_EXAMS.map((exam, i) => (
          <div
            key={exam.name}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
          >
            {/* Left Icon & Exam Title */}
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  exam.color === 'amber'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                    : exam.color === 'rose'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-600'
                }`}
              >
                {i === 0 ? (
                  <GraduationCap className="h-5 w-5" />
                ) : i === 1 ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <Award className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {exam.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {exam.tier}
                </p>
              </div>
            </div>

            {/* Right Date & Days Counter */}
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{exam.date}</p>
              <p
                className={`text-[11px] font-medium mt-0.5 ${
                  exam.name.includes('CHSL')
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {exam.daysLeft} days left
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
