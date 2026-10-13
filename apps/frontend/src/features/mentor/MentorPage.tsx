import { useState } from 'react'
import { Bot, Send, Sparkles, PlusCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  actions?: { label: string; action: string }[]
  time: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hello Vivek! 👋 I am your PrepMate AI Study Mentor.

I analyze your daily progress, mock test mistake categories, and syllabus coverage to give you actionable, capacity-respecting advice.

Here is my diagnostic based on your recent activity:
1. **Strong Momentum**: You have maintained a 7-day streak with high consistency in Quantitative Aptitude.
2. **High-Yield Gap**: Your recent mock errors show a recurring concept gap in **Trigonometry (Max/Min values)** and a calculation slowdown in **Geometry**.
3. **Recommendation**: Dedicate 45 minutes tomorrow to Trigonometry concept review before taking Mock Test #6.`,
    actions: [
      { label: 'Schedule 45m Trigonometry Task', action: 'schedule_trig' },
      { label: 'Review Error Notebook', action: 'view_errors' },
    ],
    time: '10:15 AM',
  },
]

export function MentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [appliedAction, setAppliedAction] = useState<string | null>(null)

  const quickPrompts = [
    'Analyze my weak areas from Mock #5',
    'How should I divide my study time this week?',
    'Give me a 30-day revision strategy for Tier 1',
    'Suggest high-yield English grammar rules',
  ]

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      time: 'Just now',
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let replyContent = ''
      let actions: { label: string; action: string }[] | undefined = undefined

      if (query.toLowerCase().includes('weak') || query.toLowerCase().includes('mock')) {
        replyContent = `Based on your Error Notebook logs:
- **Concept Gaps**: 2 items in Quantitative Aptitude (tan(θ/2) identities and cylinder volume with hemisphere cavities).
- **Time Bottleneck**: 1 GA question where time was lost overthinking chronology.
- **Accuracy Rate**: 82% in Mock #5 (+5% vs Mock #4).

**Strategic Recommendation**:
Instead of re-reading entire chapters, do a targeted 30-minute formula flashcard session and solve 15 focused PYQs on Mensuration.`
        actions = [{ label: 'Add 30m Mensuration Review to Planner', action: 'add_mensuration' }]
      } else if (query.toLowerCase().includes('divide') || query.toLowerCase().includes('schedule')) {
        replyContent = `Your daily study capacity is set to **6.0 hours/day** (Mon–Sat). Here is an optimal distribution:
- **Quantitative Aptitude (2.0h)**: 1h concept + 1h timed problem set.
- **Reasoning (1.5h)**: High-speed section practice (Syllogisms, Puzzles).
- **English Comprehension (1.5h)**: Grammar rule application + 2 reading passages.
- **General Awareness (1.0h)**: Modern History & Current Affairs revision.
- **Sunday**: Planned rest day or 2h light mock test.`
      } else {
        replyContent = `For **SSC CGL Tier 1**, here are the top 4 highest-ROI actions for your current stage:
1. **Speed Math**: 15 minutes daily on squares, cubes, and fraction-to-percentage conversions.
2. **Syllabus Coverage**: Ensure you finish 100% of the High-Weight topics in Quant before touching Low-Weight areas.
3. **Mock Rhythm**: 2 full mocks per week with mandatory error notebook review.
4. **Rest Days**: Take your allocated monthly rest days cleanly — consistency beats burnout.`
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        actions,
        time: 'Just now',
      }
      setMessages((prev) => [...prev, aiReply])
      setIsTyping(false)
    }, 1000)
  }

  const handleActionClick = (actionName: string) => {
    setAppliedAction(actionName)
    setTimeout(() => setAppliedAction(null), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="h-6 w-6 text-primary" />
            AI Study Mentor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured study guidance that respects your daily capacity and domain constraints.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 w-fit">
          <ShieldCheck className="h-4 w-4" />
          <span>Gemini 1.5 Pro · Capacity-Constrained</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex gap-3 max-w-2xl',
              m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold',
                m.role === 'assistant'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-foreground'
              )}
            >
              {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : 'You'}
            </div>

            <div
              className={cn(
                'p-4 rounded-xl text-sm leading-relaxed space-y-3',
                m.role === 'assistant'
                  ? 'bg-card border border-border text-foreground shadow-sm'
                  : 'bg-primary text-primary-foreground font-medium'
              )}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.actions && (
                <div className="pt-2 flex flex-wrap gap-2 border-t border-border/60">
                  {m.actions.map((act) => (
                    <button
                      key={act.action}
                      onClick={() => handleActionClick(act.action)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
                        appliedAction === act.action
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
                      )}
                    >
                      {appliedAction === act.action ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Added to Planner!
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-3.5 w-3.5" /> {act.label}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] opacity-60 block text-right mt-1">{m.time}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Thinking & consulting your study records...
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 pt-2">
        <span className="text-xs text-muted-foreground shrink-0 font-medium">Suggestions:</span>
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="px-3 py-1 text-xs rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="shrink-0 flex items-center gap-2 p-1.5 rounded-xl bg-card border border-border focus-within:ring-2 focus-within:ring-primary shadow-sm"
      >
        <input
          type="text"
          placeholder="Ask your mentor anything about syllabus, weak areas, or scheduling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="pm-btn-primary p-2.5 rounded-lg disabled:opacity-40 shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
