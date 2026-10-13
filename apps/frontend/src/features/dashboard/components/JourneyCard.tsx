import { format } from 'date-fns'

export function JourneyCard() {
  const today = new Date()
  const formattedDate = format(today, 'EEE, d MMM yyyy')

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-6 shadow-sm h-full min-h-[148px] flex flex-col justify-between">
      {/* Date & Day count */}
      <div>
        <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          {formattedDate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Day 142 of your journey
        </p>
      </div>

      {/* Quote */}
      <div className="mt-4 relative z-10">
        <p className="text-xs font-medium italic text-slate-600 dark:text-slate-300">
          “Progress, not perfection.”
        </p>
      </div>

      {/* Decorative Botanical Branch Illustration */}
      <div className="absolute right-3 bottom-2 pointer-events-none opacity-80 dark:opacity-60">
        <svg
          width="84"
          height="84"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-emerald-600/80 dark:text-emerald-400/80"
        >
          {/* Main stem */}
          <path
            d="M85 85 C65 60, 45 40, 20 20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path
            d="M20 20 C25 10, 40 12, 38 25 C36 38, 20 20, 20 20 Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <path
            d="M35 32 C48 24, 60 30, 52 42 C44 50, 35 32, 35 32 Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
          <path
            d="M48 44 C62 42, 68 56, 58 64 C50 68, 48 44, 48 44 Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <path
            d="M40 37 C28 42, 24 55, 34 60 C42 60, 40 37, 40 37 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
          <path
            d="M58 56 C74 58, 80 72, 70 80 C60 84, 58 56, 58 56 Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <path
            d="M52 50 C40 56, 38 70, 48 76 C56 78, 52 50, 52 50 Z"
            fill="currentColor"
            fillOpacity="0.65"
          />
        </svg>
      </div>
    </div>
  )
}
