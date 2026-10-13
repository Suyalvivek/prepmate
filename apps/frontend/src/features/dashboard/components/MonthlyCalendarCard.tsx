import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type DayType = 'study' | 'partial' | 'rest'

interface CalendarDay {
  dayNumber: number
  type?: DayType
  isCurrentMonth: boolean
}

// October 2024 Calendar representation
// Oct 1 was Tuesday -> 1 empty slot on Monday
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Pre-configured day statuses matching the screenshot:
// Mon 14 Oct is selected
const OCTOBER_DAYS: { day: number; type?: DayType }[] = [
  { day: 1, type: 'study' },
  { day: 2, type: 'study' },
  { day: 3, type: 'study' },
  { day: 4, type: 'partial' },
  { day: 5, type: 'rest' },
  { day: 6, type: 'rest' },
  { day: 7, type: 'study' },
  { day: 8, type: 'study' },
  { day: 9, type: 'study' },
  { day: 10, type: 'partial' },
  { day: 11, type: 'study' },
  { day: 12, type: 'partial' },
  { day: 13, type: 'rest' },
  { day: 14, type: 'study' }, // Active selected day
  { day: 15, type: 'study' },
  { day: 16, type: 'study' },
  { day: 17, type: 'partial' },
  { day: 18, type: 'study' },
  { day: 19, type: 'partial' },
  { day: 20, type: 'rest' },
  { day: 21, type: 'study' },
  { day: 22, type: 'study' },
  { day: 23, type: 'study' },
  { day: 24, type: 'study' },
  { day: 25, type: 'partial' },
  { day: 26, type: 'study' },
  { day: 27, type: 'rest' },
  { day: 28, type: 'study' },
  { day: 29, type: 'study' },
  { day: 30, type: 'study' },
  { day: 31, type: 'partial' },
]

export function MonthlyCalendarCard() {
  const [selectedDay, setSelectedDay] = useState<number>(14)

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Monthly Calendar
        </h2>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mt-3 px-1">
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            October 2024
          </span>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="mt-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_OF_WEEK.map((d) => (
              <span
                key={d}
                className="text-[10px] font-semibold text-slate-400 tracking-wider"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
            {/* Blank cell for Monday offset (Oct 1 2024 was Tuesday) */}
            <div className="h-8" />

            {OCTOBER_DAYS.map((item) => {
              const isSelected = selectedDay === item.day

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedDay(item.day)}
                  className="h-8 flex flex-col items-center justify-center relative group focus:outline-none"
                >
                  <span
                    className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all',
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                        : 'text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                    )}
                  >
                    {item.day}
                  </span>

                  {/* Dot status indicator under the day */}
                  {!isSelected && item.type && (
                    <span
                      className={cn(
                        'w-1 h-1 rounded-full absolute bottom-0.5',
                        item.type === 'study' && 'bg-emerald-500',
                        item.type === 'partial' && 'bg-amber-500',
                        item.type === 'rest' && 'bg-slate-300 dark:bg-slate-600'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Study Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Partial Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>Rest Day</span>
        </div>
      </div>
    </div>
  )
}
