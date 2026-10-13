import { format } from 'date-fns'

interface JourneyCardProps {
  dayNumber?: number
}

export function JourneyCard({ dayNumber = 142 }: JourneyCardProps) {
  const today = new Date()
  const formattedDate = format(today, 'EEE, d MMM yyyy')

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-6 shadow-sm h-full min-h-[150px] flex flex-col justify-between">
      {/* Date & Day count */}
      <div className="relative z-10">
        <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          {formattedDate}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Day {dayNumber} of your journey
        </p>
      </div>

      {/* Quote */}
      <div className="relative z-10 max-w-[200px]">
        <p className="text-xs font-medium italic text-slate-600 dark:text-slate-300">
          “Progress, not perfection.”
        </p>
      </div>

      {/* Elegant upright botanical sprig in the right margin (never overlaps text) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="64"
          height="88"
          viewBox="0 0 64 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-emerald-600/80 dark:text-emerald-400/70"
        >
          {/* Main stem curving gracefully up */}
          <path
            d="M50 84 C38 64, 30 40, 26 8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Top Leaf */}
          <path
            d="M26 8 C22 2, 28 0, 32 4 C36 8, 30 14, 26 8 Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          {/* Right leaf upper */}
          <path
            d="M28 22 C38 18, 48 22, 42 30 C36 36, 28 26, 28 22 Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Left leaf middle */}
          <path
            d="M29 36 C18 32, 10 40, 16 48 C22 52, 29 42, 29 36 Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
          {/* Right leaf middle */}
          <path
            d="M32 50 C44 48, 52 56, 46 64 C40 70, 32 56, 32 50 Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Left leaf lower */}
          <path
            d="M36 64 C26 62, 20 72, 28 78 C34 80, 38 70, 36 64 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>
      </div>
    </div>
  )
}
