import { Link } from 'react-router-dom'

interface TopicMetric {
  name: string
  percentage: number
  colorClass: string
  dotClass: string
}

const TOPICS: TopicMetric[] = [
  {
    name: 'Quant',
    percentage: 78,
    colorClass: 'text-blue-500',
    dotClass: 'bg-blue-500',
  },
  {
    name: 'Reasoning',
    percentage: 70,
    colorClass: 'text-emerald-500',
    dotClass: 'bg-emerald-500',
  },
  {
    name: 'English',
    percentage: 68,
    colorClass: 'text-purple-500',
    dotClass: 'bg-purple-500',
  },
  {
    name: 'GK/GS',
    percentage: 52,
    colorClass: 'text-amber-500',
    dotClass: 'bg-amber-500',
  },
]

export function TopicAccuracyCard() {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Topic-wise Accuracy
          </h2>
          <Link
            to="/analytics"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
          >
            <span>View Details</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Content: Donut + Legend */}
        <div className="mt-5 flex items-center justify-between gap-4">
          {/* Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="3.5"
              />
              {/* Multi-segment active stroke or overall 72% ring */}
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className="stroke-blue-500"
                strokeWidth="3.5"
                strokeDasharray="72 100"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className="stroke-emerald-400"
                strokeWidth="3.5"
                strokeDasharray="25 100"
                strokeDashoffset="-72"
                strokeLinecap="round"
              />
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                72%
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Overall
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 flex-1">
            {TOPICS.map((topic) => (
              <div key={topic.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${topic.dotClass}`} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {topic.name}
                  </span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  {topic.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
