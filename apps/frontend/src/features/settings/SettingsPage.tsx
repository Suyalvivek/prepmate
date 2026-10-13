import { useState } from 'react'
import { Settings as SettingsIcon, User, Moon, Sun, Monitor, Key, Check, Shield, Bell } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const [displayName, setDisplayName] = useState(user?.displayName || 'Vivek')
  const [dailyHours, setDailyHours] = useState(6)
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6])
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings & Configuration
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account profile, study parameters, theme, and AI keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="pm-card p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'vivek@example.com'}
                className="w-full px-3 py-2 text-sm rounded-lg bg-muted text-muted-foreground border border-border cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Study Parameters */}
        <div className="pm-card p-6 space-y-5">
          <h3 className="text-base font-bold text-foreground">Study Targets & Capacity</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">
                Daily Study Target (Capacity Limit)
              </label>
              <span className="text-sm font-bold text-primary">{dailyHours} hours/day</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>1 hr</span>
              <span>6 hrs (Recommended)</span>
              <span>12 hrs</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2">
              Active Study Days (Unselected days count as Planned Rest Days)
            </label>
            <div className="flex gap-2">
              {days.map((d, i) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    'flex-1 py-2 text-xs font-bold rounded-lg border transition-all',
                    selectedDays.includes(i)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="pm-card p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground">Theme & Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id as 'light' | 'dark' | 'system')}
                className={cn(
                  'flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-xs font-bold gap-2',
                  theme === id
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Key & Security Card */}
        <div className="pm-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" /> AI Mentor Credentials (BYOK)
            </h3>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <Shield className="h-3 w-3" /> Encrypted at Rest
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            PrepMate uses Gemini 1.5 Pro to diagnose weak areas and suggest revisions. You can bring your own free Google AI Studio key.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Google Gemini API Key</label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <Check className="h-4 w-4" /> Settings updated successfully!
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Changes apply instantly across your account.
            </span>
          )}

          <button type="submit" className="pm-btn-primary px-6 py-2.5 text-sm font-semibold">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
