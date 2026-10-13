import { cn } from '@/lib/utils'

interface SubjectItem {
  name: string
  code: string
  percentage: number
  color: string
  barColor: string
  textColor: string
}

const SUBJECTS: SubjectItem[] = [
  {
    name: 'Quantitative Aptitude',
    code: 'Q',
    percentage: 65,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Reasoning',
    code: 'R',
    percentage: 48,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    barColor: 'bg-emerald-400',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'English',
    code: 'E',
    percentage: 38,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    barColor: 'bg-sky-400',
    textColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    name: 'General Awareness',
    code: 'A',
    percentage: 22,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
]

export function SubjectProgressCard() {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Subject Progress
          </h2>
          <div className="text-right">
            <span className="text-base font-bold text-slate-900 dark:text-white">42%</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Overall Syllabus Completion
        </p>

        {/* Subjects list */}
        <div className="mt-5 space-y-4">
          {SUBJECTS.map((sub) => (
            <div key={sub.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      sub.color
                    )}
                  >
                    {sub.code}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {sub.name}
                  </span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  {sub.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', sub.barColor)}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
