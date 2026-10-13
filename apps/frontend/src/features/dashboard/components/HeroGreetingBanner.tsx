import { useAuth } from '@/app/providers/AuthProvider'

export function HeroGreetingBanner() {
  const { user } = useAuth()
  const name = user?.displayName ? user.displayName.split(' ')[0] : 'Aman'

  const currentHour = new Date().getHours()
  const timeGreeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card shadow-sm h-full min-h-[150px] flex items-center">
      {/* Background panoramic mountain sunrise artwork */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/mountain-banner.jpg"
          alt="Mountain sunrise"
          className="h-full w-full object-cover object-[65%_35%] scale-100"
        />
        {/* Soft atmospheric gradient blend for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 via-40% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/30 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-6 sm:p-7 max-w-md">
        <h1 className="text-2xl md:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>
            {timeGreeting}, {name}!
          </span>
          <span className="inline-block">👋</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          “Small steps every day lead to big results.”
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
          — Keep going
        </p>
      </div>
    </div>
  )
}
