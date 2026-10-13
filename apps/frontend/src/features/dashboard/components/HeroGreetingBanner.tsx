import { useAuth } from '@/app/providers/AuthProvider'

export function HeroGreetingBanner() {
  const { user } = useAuth()
  const name = user?.displayName ? user.displayName.split(' ')[0] : 'Aman'

  const currentHour = new Date().getHours()
  const timeGreeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card shadow-sm h-full min-h-[148px] flex items-center">
      {/* Background panoramic mountain sunrise artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/mountain-banner.jpg"
          alt="Mountain sunrise"
          className="h-full w-full object-cover object-right-bottom scale-105"
        />
        {/* Soft atmospheric gradient overlay for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#111928] dark:via-[#111928]/90 dark:to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-[#111928]/40" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-6 md:p-7 max-w-xl">
        <h1 className="text-2xl md:text-[26px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>
            {timeGreeting}, {name}!
          </span>
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="mt-1.5 text-sm md:text-[15px] font-medium text-slate-700 dark:text-slate-200">
          “Small steps every day lead to big results.”
        </p>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
          — Keep going
        </p>
      </div>
    </div>
  )
}
