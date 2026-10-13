import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Bot } from 'lucide-react'

const SUGGESTIONS = [
  'Create a study plan for next 30 days',
  'What are my weak topics?',
  'Analyze my last mock test',
  'Suggest resources for Polity',
  "Adjust my plan (I missed today's targets)",
]

export function AIMentorCard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleAsk = (text?: string) => {
    const prompt = text || query
    if (!prompt.trim()) return
    navigate('/mentor', { state: { initialPrompt: prompt } })
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              AI Mentor
            </h2>
          </div>

          <button
            onClick={() => navigate('/mentor')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-0.5 group"
          >
            <span>Ask Anything</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Input box */}
        <div className="mt-3.5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk()
            }}
            className="relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Send query"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 space-y-1.5">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAsk(suggestion)}
              className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-850/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-100 dark:border-slate-800/70 transition-colors flex items-center gap-2 group"
            >
              <span className="text-slate-400 group-hover:text-blue-500">•</span>
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
