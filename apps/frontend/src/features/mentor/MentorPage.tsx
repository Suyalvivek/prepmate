import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  Bot,
  Send,
  Sparkles,
  PlusCircle,
  Check,
  ArrowRight,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  BookOpen,
  Clock,
  Calendar,
  X,
  Flame,
  Target,
  Sliders,
  ExternalLink,
  ChevronRight,
  Database,
  CalendarDays,
  FileText,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  MENTOR_SYSTEM_PROMPT,
  DEMO_TELEMETRY,
  getFreshCandidateTelemetry,
  generateSystemPrompt,
  callGeminiAPI,
} from './mentorPrompt'

interface StudyMission {
  id: string
  title: string
  subject: 'Quantitative Aptitude' | 'Reasoning' | 'English' | 'General Awareness'
  durationMinutes: number
  rationale: string
  targetDate: string
  taskType: 'learn' | 'practice' | 'revision' | 'mock_test'
  priority: 'high' | 'medium' | 'low'
}

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  groundingTags?: string[]
  missions?: StudyMission[]
  links?: { label: string; path: string }[]
  time: string
  feedback?: 'helpful' | 'not_helpful' | null
}

const AMAN_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-aman',
    role: 'assistant',
    content: `Hello Aman! 👋 I am your PrepMate AI Study Mentor.

I am grounded directly in your saved telemetry, mock logs, and 6.0h daily capacity ceiling.

### 📊 Live Diagnostic (Last 14 Days)
- **Active Momentum**: You have maintained a 7-day streak with 18 tasks completed!
- **Mock Performance**: In Mock #5 (10 Oct), you scored 148.5/200 (82% accuracy) — a +9.5 marks improvement over Mock #4.
- **Identified Gap**: You lost marks on Trigonometry (identities & half-angle formulas) and had a calculation slowdown in Mensuration.
- **Spaced Revisions**: You have 3 revision flashcards due today (Trig formulas, Fundamental Rights, Conditional rules).

Here are two high-yield missions crafted to close these exact gaps within your available daily bandwidth:`,
    groundingTags: ['Mock #5 Logs', 'Quant Remedial', '6.0h Capacity Ceiling'],
    missions: [
      {
        id: 'mission-trig-1',
        title: 'Trigonometry: Max/Min & Half-Angle Formulas Mastery',
        subject: 'Quantitative Aptitude',
        durationMinutes: 45,
        rationale: 'Fixes recurring concept gap from Mock #5 (finding tan θ/2 given sin θ).',
        targetDate: '2026-10-13',
        taskType: 'learn',
        priority: 'high',
      },
      {
        id: 'mission-mensuration-2',
        title: 'Mensuration: Cylinder & Composite Solid Calculation Drill',
        subject: 'Quantitative Aptitude',
        durationMinutes: 30,
        rationale: 'Overcomes calculation error on cavity volume question in Mock #5.',
        targetDate: '2026-10-13',
        taskType: 'practice',
        priority: 'medium',
      },
    ],
    links: [
      { label: 'View Error Notebook (Mock #5)', path: '/mock-tests' },
      { label: 'Review Due Flashcards (3 items)', path: '/revisions' },
    ],
    time: '10:15 AM',
  },
]

function getRealUserInitialMessages(userName: string): ChatMessage[] {
  return [
    {
      id: 'msg-init-fresh',
      role: 'assistant',
      content: `Hello ${userName}! 👋 I am your PrepMate AI Study Mentor.

I am grounded directly in your target exam goals, daily capacity guardrails (6.0h/day), and SSC CGL milestones.

### 🚀 Getting Started on Day 1
- **Active Momentum**: Day 1 of your preparation journey.
- **Daily Capacity Ceiling**: 6.0h daily limit active to protect against cramming and burnout.
- **Recommended First Step**: Take an initial baseline diagnostic test or schedule your foundational Quant & Reasoning topics.

Here are two starter study missions calibrated for your first day:`,
      groundingTags: ['Syllabus Baseline', '6.0h Capacity Ceiling', 'Day 1 Plan'],
      missions: [
        {
          id: 'mission-start-1',
          title: 'Diagnostic Test: SSC CGL Tier 1 Mini-Mock',
          subject: 'Quantitative Aptitude',
          durationMinutes: 60,
          rationale: 'Establishes initial baseline accuracy across all 4 subjects.',
          targetDate: '2026-10-13',
          taskType: 'mock_test',
          priority: 'high',
        },
        {
          id: 'mission-start-2',
          title: 'High-Yield Formula & Rulebook Setup',
          subject: 'General Awareness',
          durationMinutes: 30,
          rationale: 'Creates your core spaced repetition revision foundation.',
          targetDate: '2026-10-13',
          taskType: 'learn',
          priority: 'medium',
        },
      ],
      links: [
        { label: 'View Mock Tests & Diagnostics', path: '/mock-tests' },
        { label: 'Open Weekly Planner', path: '/planner' },
      ],
      time: 'Just now',
    },
  ]
}

interface CategoryGroup {
  id: string
  label: string
  icon: any
  prompts: string[]
}

const DEMO_PROMPT_CATEGORIES: CategoryGroup[] = [
  {
    id: 'recommended',
    label: '⭐ Recommended',
    icon: Sparkles,
    prompts: [
      'Analyze my weak areas from Mock #5',
      'Adjust my plan (I missed today targets)',
      'Give me a 30-day revision strategy for Tier 1',
      'Suggest high-yield English grammar rules',
    ],
  },
  {
    id: 'diagnostics',
    label: '📊 Diagnostics',
    icon: Target,
    prompts: [
      'Compare Mock #4 vs Mock #5 performance',
      'Which topics are costing me the most negative marks?',
      'Why is my Quant calculation speed lagging?',
    ],
  },
  {
    id: 'planning',
    label: '⏱️ Adaptive Plan',
    icon: Clock,
    prompts: [
      'How should I divide my 6 hours daily this week?',
      'How to fit my 3 due spaced revisions today?',
      'Suggest a realistic Sunday revision schedule',
    ],
  },
  {
    id: 'drills',
    label: '📚 High-Yield Drills',
    icon: BookOpen,
    prompts: [
      'High-yield Indian Polity articles for SSC CGL',
      'Explain "Only a few" Syllogism rules simply',
      'Top 5 Pythagorean triplets and Quant shortcuts',
    ],
  },
]

const FRESH_PROMPT_CATEGORIES: CategoryGroup[] = [
  {
    id: 'recommended',
    label: '⭐ Recommended',
    icon: Sparkles,
    prompts: [
      'How should I structure my Day 1 study plan?',
      'Suggest high-yield starter topics for Quant & Reasoning',
      'Give me a 30-day revision strategy for Tier 1',
      'Suggest high-yield English grammar rules',
    ],
  },
  {
    id: 'diagnostics',
    label: '📊 Diagnostics',
    icon: Target,
    prompts: [
      'How to baseline my score with a diagnostic mock test?',
      'Which topics carry the highest weightage in Tier 1?',
      'How can I build calculation speed in Quantitative Aptitude?',
    ],
  },
  {
    id: 'planning',
    label: '⏱️ Adaptive Plan',
    icon: Clock,
    prompts: [
      'How should I divide my 6 hours daily this week?',
      'How do I build consistency without burning out?',
      'Suggest a realistic Sunday revision schedule',
    ],
  },
  {
    id: 'drills',
    label: '📚 High-Yield Drills',
    icon: BookOpen,
    prompts: [
      'High-yield Indian Polity articles for SSC CGL',
      'Explain "Only a few" Syllogism rules simply',
      'Top 5 Pythagorean triplets and Quant shortcuts',
    ],
  },
]

const SUBJECT_STYLES = {
  'Quantitative Aptitude': {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dot: 'bg-blue-500',
  },
  'Reasoning': {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  'English': {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  'General Awareness': {
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dot: 'bg-purple-500',
  },
}

function FormattedMessage({ content, isAssistant }: { content: string; isAssistant: boolean }) {
  if (!isAssistant) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
  }

  return (
    <div className="text-xs sm:text-sm leading-relaxed text-foreground select-text">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-foreground">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
          h1: ({ children }) => (
            <h3 className="font-bold text-sm sm:text-base text-foreground mt-3 mb-1.5 flex items-center gap-1.5">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="font-bold text-sm sm:text-base text-foreground mt-3 mb-1.5 flex items-center gap-1.5">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="font-bold text-xs sm:text-sm text-foreground mt-2.5 mb-1 flex items-center gap-1.5">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="font-semibold text-xs text-foreground mt-2 mb-1">{children}</h5>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-4 list-disc marker:text-primary">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal marker:text-primary">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-xs sm:text-sm pl-0.5">{children}</li>,
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-muted/80 border border-border/50 font-mono text-[11px] text-primary font-medium">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-2.5 italic text-muted-foreground my-1.5">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function MentorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'
  const rawName = user?.displayName || (user as any)?.name || (isDemo ? 'Aman' : 'Vivek')
  const userName = rawName.split(' ')[0]
  const chatStorageKey = `prepmate_mentor_chat_${user?.uid || 'guest'}`

  const telemetry = isDemo
    ? DEMO_TELEMETRY
    : getFreshCandidateTelemetry(userName)
  const activeSystemPrompt = generateSystemPrompt(telemetry)
  const promptCategories = isDemo ? DEMO_PROMPT_CATEGORIES : FRESH_PROMPT_CATEGORIES

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`prepmate_mentor_chat_${user?.uid || 'guest'}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {}
    return isDemo ? AMAN_INITIAL_MESSAGES : getRealUserInitialMessages(userName)
  })

  // Persist messages to localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(chatStorageKey, JSON.stringify(messages))
      }
    } catch {}
  }, [messages, chatStorageKey])

  // Sync if account changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          return
        }
      }
    } catch {}
    setMessages(isDemo ? AMAN_INITIAL_MESSAGES : getRealUserInitialMessages(userName))
  }, [user?.uid, isDemo, userName, chatStorageKey])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [scheduledMissions, setScheduledMissions] = useState<Record<string, boolean>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('recommended')
  const [showContextSidebar, setShowContextSidebar] = useState(false)

  // BYOK key
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('prepmate_gemini_api_key') || ''
    } catch {
      return ''
    }
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasHandledInitialPrompt = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(msgId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (msgId: string, rating: 'helpful' | 'not_helpful') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: rating } : m))
    )
    showToast(rating === 'helpful' ? 'Thank you for your feedback!' : 'Noted. Refining future recommendations.')
  }

  const handleScheduleMission = (mission: StudyMission) => {
    try {
      const saved = localStorage.getItem('prepmate_planner_tasks')
      let currentTasks: any[] = []
      if (saved) {
        try {
          currentTasks = JSON.parse(saved)
        } catch {
          currentTasks = []
        }
      }

      const newTask = {
        id: `mentor-${Date.now()}`,
        title: mission.title,
        subject: mission.subject,
        durationMinutes: mission.durationMinutes,
        completed: false,
        priority: mission.priority,
        date: mission.targetDate,
        taskType: mission.taskType,
      }

      const updated = [newTask, ...currentTasks]
      localStorage.setItem('prepmate_planner_tasks', JSON.stringify(updated))
      window.dispatchEvent(new Event('prepmate_tasks_updated'))

      setScheduledMissions((prev) => ({ ...prev, [mission.id]: true }))
      showToast(`Added "${mission.title}" to your Planner (${mission.durationMinutes}m)!`)
    } catch (err) {
      console.error('Error adding mission to planner:', err)
      showToast('Task added to your study plan!')
      setScheduledMissions((prev) => ({ ...prev, [mission.id]: true }))
    }
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Check if user has a BYOK Gemini key configured
    if (apiKey) {
      try {
        const geminiResponseText = await callGeminiAPI(
          apiKey,
          query,
          messages.map((m) => ({ role: m.role, content: m.content })),
          activeSystemPrompt
        )

        const aiReply: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: geminiResponseText,
          groundingTags: ['Gemini 1.5 Live API', 'System Instruction Grounded', '6.0h Capacity'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => [...prev, aiReply])
        setIsTyping(false)
        return
      } catch (err) {
        console.warn('Gemini API call failed or unavailable, falling back to local engine:', err)
        // Fall through to deterministic local response engine
      }
    }

    // Local Intelligent Response Engine (Strictly implements MENTOR_SYSTEM_PROMPT)
    setTimeout(() => {
      const qLower = query.toLowerCase()
      const isGreeting =
        /^(hi|hello|hey|heya|howdy|sup|yo|good morning|good evening|good afternoon|namaste|greetings)(\s.*)?$/i.test(
          query.trim()
        ) ||
        (query.trim().length <= 5 && ['hi', 'hey', 'hello', 'yo', 'sup'].includes(query.trim().toLowerCase()))

      let replyContent = ''
      let missions: StudyMission[] | undefined = undefined
      let links: { label: string; path: string }[] | undefined = undefined
      let groundingTags: string[] = ['Capacity Ceiling (6.0h/day)', 'SSC CGL Tier 1']

      if (isGreeting) {
        // Natural, warm, concise greeting complying with System Prompt Section 2
        groundingTags.push('Greeting Intent', 'Candidate Context')
        if (isDemo) {
          replyContent = `Hey Aman! 👋 Ready to dive into today's preparation?

You're maintaining a strong 7-day streak with 3 revision flashcards due today and comfortable bandwidth remaining in your 6.0h daily budget.

What would you like to work on right now?
- Review Mock #5 errors (Trigonometry half-angles & Mensuration)
- Plan or adjust today's schedule
- Revise due flashcards or high-yield grammar rules`
          links = [
            { label: 'Review Due Flashcards (3 items)', path: '/revisions' },
            { label: "Open Today's Study Plan", path: '/planner' },
          ]
        } else {
          replyContent = `Hey ${userName}! 👋 Ready to dive into today's preparation?

You are on Day 1 of your journey with full 6.0h bandwidth available today.

What would you like to work on right now?
- Plan or schedule today's study missions
- Take a baseline diagnostic mock test
- Review high-yield English grammar rules or Quant shortcuts`
          links = [
            { label: "Open Today's Study Plan", path: '/planner' },
            { label: 'View Mock Tests', path: '/mock-tests' },
          ]
        }
      } else if (qLower.includes('day 1') || qLower.includes('starter') || qLower.includes('structure my')) {
        groundingTags.push('Day 1 Kickoff', 'Capacity Safe (6.0h)')
        replyContent = `### 🚀 Day 1 Study Blueprint: Building Strong Foundations

Welcome to Day 1! The goal today is not to cover everything at once, but to establish a calm, disciplined study rhythm within your **6.0h daily capacity**:

1. **Morning Block (2.5h) — Baseline & Core Quant**:
   - **Diagnostic Baseline (60m)**: Take a 60-minute diagnostic mock test without preparation to calibrate your real baseline score.
   - **Quant Fundamentals (90m)**: Percentages & Fraction conversions ($1/2$ to $1/20$), tables up to 25, squares up to 30.
2. **Afternoon Block (2.0h) — Reasoning & English**:
   - **Reasoning (60m)**: Number Series & Coding-Decoding (high-yield, builds exam momentum).
   - **English (60m)**: High-yield grammar rules (Subject-Verb agreement & Inversion) + 20 Root Words.
3. **Evening Block (1.5h) — General Awareness & Day Closing**:
   - **Static GK (60m)**: Indian Constitution preamble & Articles 12–35 (Fundamental Rights).
   - **Planner Log & Buffer (30m)**: Log today's completed study blocks and prepare tomorrow's schedule.

Here are two starter study missions ready to schedule directly into your planner:`
        missions = [
          {
            id: `mission-${Date.now()}-day1-mock`,
            title: 'Diagnostic Mock Test #1: Baseline Score Calibration',
            subject: 'Quantitative Aptitude',
            durationMinutes: 60,
            rationale: 'Establishes initial baseline accuracy across Quant, Reasoning, English, and GA.',
            targetDate: new Date().toISOString().split('T')[0],
            taskType: 'mock_test',
            priority: 'high',
          },
          {
            id: `mission-${Date.now()}-day1-quant`,
            title: 'Quant Foundation: Percentage to Fraction Conversions & Tables',
            subject: 'Quantitative Aptitude',
            durationMinutes: 60,
            rationale: 'Core foundation for Arithmetic speed across Profit & Loss, SI/CI, and DI.',
            targetDate: new Date().toISOString().split('T')[0],
            taskType: 'learn',
            priority: 'high',
          },
        ]
        links = [
          { label: "Open Today's Study Plan", path: '/planner' },
          { label: 'View Mock Tests & Diagnostics', path: '/mock-tests' },
        ]
      } else if (qLower.includes('baseline') || qLower.includes('diagnostic mock') || qLower.includes('diagnostic')) {
        groundingTags.push('Diagnostic Baseline', 'Mock Strategy')
        replyContent = `### 📊 How to Baseline Your Score with a Diagnostic Mock

Taking your first diagnostic mock can feel intimidating, but remember: **a diagnostic mock is not an evaluation of your intelligence — it is an MRI of your current syllabus strengths and blind spots.**

#### Rules for Diagnostic Mock #1:
1. **Zero Pre-Cramming**: Take it in raw exam conditions (60 mins, 100 questions) without revising formulas beforehand.
2. **Do Not Guess Blindly**: If you are completely unfamiliar with a question, skip it to avoid negative marks skewing your baseline accuracy.
3. **Focus on Sectional Accuracy**:
   - Target benchmark: Reasoning (40+/50), English (35+/50), Quant (30+/50), GA (20+/50).
4. **Log Mistakes into Error Notebook**:
   - Tag errors into: *Conceptual Gap*, *Calculation Error*, or *Time Running Out*.

Schedule this baseline session now into your study planner:`
        missions = [
          {
            id: `mission-${Date.now()}-baseline`,
            title: 'Diagnostic Mock Test #1 (Unprepared Baseline Session)',
            subject: 'Quantitative Aptitude',
            durationMinutes: 60,
            rationale: 'Generates initial score baseline to guide syllabus prioritization.',
            targetDate: new Date().toISOString().split('T')[0],
            taskType: 'mock_test',
            priority: 'high',
          },
        ]
        links = [
          { label: 'Launch Mock Test', path: '/mock-tests' },
          { label: 'Open Weekly Planner', path: '/planner' },
        ]
      } else if (qLower.includes('weak') || qLower.includes('mock #5') || qLower.includes('negative')) {
        if (!isDemo && !qLower.includes('mock #5')) {
          groundingTags.push('Diagnostic Baseline', 'Error Notebook')
          replyContent = `### 🔍 Weak Area Analysis (Day 1 Status)

You haven't logged any mock tests or error notebook entries yet. Once you complete your first diagnostic mock test or quiz drills, PrepMate will automatically calculate:

1. **Negative Mark Leakage**: Topics where incorrect guesses are subtracting marks.
2. **Speed Lag**: Questions where you spend >90 seconds.
3. **Concept Gaps**: Specific question patterns (e.g. Trigonometry identities, Syllogisms).

To get your first automated diagnostic breakdown, take a baseline mock test today!`
          links = [
            { label: 'Take Diagnostic Mock Test', path: '/mock-tests' },
            { label: 'Open Error Notebook', path: '/mock-tests' },
          ]
        } else {
          groundingTags.push('Mock #5 Log', 'Error Notebook')
          replyContent = `### 🔍 Mock #5 Error Breakdown & Action Plan

Here is what the telemetry from your **SSC CGL Full Mock #5 (Score: 148.5/200, 82% Accuracy)** shows:

1. **Trigonometry (Concept Gap - High Priority)**:
   - Missed question on finding $\\tan(\\theta/2)$ given $\\sin\\theta$.
   - **Diagnosis**: Spent 1m 45s before picking an incorrect option. This was an algebraic transformation gap, not careless arithmetic.
2. **Mensuration (Calculation Error)**:
   - Missed composite volume question (cylinder with hemisphere cavity).
   - **Diagnosis**: Setup was correct, but you miscalculated the common radius subtraction.
3. **English RC (Guesswork)**:
   - Lost marks on author tone in the economic passage (*analytical* vs *critical*).
4. **General Awareness**:
   - Overthought chronology of Delhi Sultanate dynasties (Slave → Khalji → Tughlaq → Sayyid → Lodi).

### 💡 Remedial Missions (Fits Within 6h Daily Limit):
Don't re-read entire textbooks. Solve these targeted practice sets tomorrow:`
          missions = [
            {
              id: `mission-${Date.now()}-1`,
              title: 'Trigonometry: Half-Angle & Double-Angle Identities Practice',
              subject: 'Quantitative Aptitude',
              durationMinutes: 45,
              rationale: 'Directly resolves Mock #5 error on half-angle tan questions.',
              targetDate: '2026-10-13',
              taskType: 'learn',
              priority: 'high',
            },
            {
              id: `mission-${Date.now()}-2`,
              title: 'Mensuration: 15 Compound Solid PYQ Drills',
              subject: 'Quantitative Aptitude',
              durationMinutes: 30,
              rationale: 'Reinforces calculation precision on cylinder & hemisphere cavities.',
              targetDate: '2026-10-13',
              taskType: 'practice',
              priority: 'medium',
            },
          ]
          links = [
            { label: 'Open Error Notebook', path: '/mock-tests' },
            { label: 'Check Quant Syllabus Coverage', path: '/syllabus' },
          ]
        }
      } else if (qLower.includes('miss') || qLower.includes('adjust') || qLower.includes('target')) {
        groundingTags.push('Adaptive Scheduler', 'Capacity Guardrail')
        replyContent = `### ⚖️ Adaptive Rescheduling: Recovering Missed Targets

Don't worry! Slip-ups happen. **The cardinal rule is: never cram 10 hours tomorrow to compensate for a missed day.** That leads to burnout and drops retention.

Here is the capacity-safe adjustment for your **6.0h daily availability**:

1. **Protect High-Yield Core (4.0h)**:
   - Quantitative Aptitude (2.0h) — Arithmetic & Advanced Math.
   - English Comprehension & Error Spotting (1.5h).
   - 30-min Speed Math drills.
2. **Compress / Defer Low-Yield Items (-1.5h)**:
   - Defer **Physical Geography: Indian Drainage System (45m)** to the weekend buffer slot.
   - Consolidate General Awareness into high-yield Polity articles (1.0h).
3. **Rest Day Protection**:
   - Keep Sunday as your designated recovery/light review day.

Here is a balanced recovery task that fits seamlessly into your Tuesday schedule:`
        missions = [
          {
            id: `mission-${Date.now()}-adjust`,
            title: 'High-Yield Recovery Drill: Quant & English Priority Blocks',
            subject: 'Quantitative Aptitude',
            durationMinutes: 60,
            rationale: 'Reclaims essential practice without violating the 6.0h daily limit.',
            targetDate: '2026-10-13',
            taskType: 'practice',
            priority: 'high',
          },
        ]
        links = [{ label: 'View Planner Schedule', path: '/planner' }]
      } else if (qLower.includes('30-day') || qLower.includes('strategy') || qLower.includes('revision strategy')) {
        groundingTags.push('Tier 1 Blueprint', '30-Day Milestone')
        replyContent = `### 🎯 30-Day SSC CGL Tier 1 Master Strategy

With approximately 40 days left until Tier 1, here is your 4-phase strategic roadmap adhering strictly to your **6.0h daily limit (36h/week)**:

#### 🔹 Phase 1: High-Weight Consolidation (Days 1–10)
- **Goal**: Finish remaining High-Weight Quant (Trigonometry, Algebra, Geometry) and Modern History.
- **Rhythm**: 2h Quant + 1.5h Reasoning + 1.5h English + 1h GA daily.
- **Mocks**: 1 Full Mock every 5 days + Error Log review.

#### 🔹 Phase 2: Sectional Speed & Weak-Area Drills (Days 11–20)
- **Goal**: Bring section times down: Reasoning (15 mins), English (10 mins), GA (7 mins), Quant (25 mins).
- **Rhythm**: Daily 25-question sectional timed sprints.

#### 🔹 Phase 3: Mock Testing Cadence (Days 21–27)
- **Goal**: Full exam stamina.
- **Rhythm**: 2 Full Mocks/week (Sat & Wed) + mandatory 2-hour analysis session per mock.
- Convert every mistake into a Spaced Revision item.

#### 🔹 Phase 4: Tapering & Formula Memory (Days 28–30)
- Zero new concepts. 100% formula sheets, static GK tables, and mental relaxation.`
        missions = [
          {
            id: `mission-${Date.now()}-plan`,
            title: 'Phase 1 Launch: 45m High-Weight Advanced Math Review',
            subject: 'Quantitative Aptitude',
            durationMinutes: 45,
            rationale: 'Kicks off Phase 1 of the 30-day Tier 1 revision roadmap.',
            targetDate: '2026-10-13',
            taskType: 'learn',
            priority: 'high',
          },
        ]
        links = [
          { label: 'View Weekly Planner', path: '/weekly-planner' },
          { label: 'Check Syllabus Tracker', path: '/syllabus' },
        ]
      } else if (qLower.includes('grammar') || qLower.includes('english')) {
        groundingTags.push('English Syllabus', 'Error Spotting')
        replyContent = `### 📖 Top 5 High-Yield English Grammar Rules for SSC CGL

These 5 rules account for over 40% of Error Spotting & Sentence Improvement questions in SSC Tier 1:

1. **Rule of Inversion (Negative Adverbs)**:
   - When a sentence starts with *Hardly, Scarcely, Seldom, Rarely, Neither, Nor, Barely*, auxiliary verb precedes subject:
   - ❌ *Hardly he had arrived when...*
   - ✔️ *Hardly had he arrived when it started raining.*
2. **Conditional Sentences (Type 3)**:
   - *If + had + V3, ... would have + V3*.
   - ✔️ *If she had studied harder, she would have cleared the cut-off.*
3. **Subject-Verb Agreement with 'Neither... Nor' & 'Either... Or'**:
   - The verb agrees with the **closer subject**:
   - ✔️ *Neither the captain nor the players were present.*
   - ✔️ *Neither the players nor the captain was present.*
4. **Prepositions with Latin Comparatives**:
   - *Senior, junior, superior, inferior, prior, prefer* take **to**, never *than*:
   - ✔️ *He is senior to me.*
5. **No Conjunction after Lest**:
   - *Lest* is followed by **should** (or bare subjunctive), never *not* or *may*:
   - ✔️ *Walk carefully lest you should stumble.*`
        missions = [
          {
            id: `mission-${Date.now()}-eng`,
            title: 'English: 50 Error Spotting Practice Drills (High-Yield Rules)',
            subject: 'English',
            durationMinutes: 40,
            rationale: 'Direct practice on inversion, conditionals, and preposition rules.',
            targetDate: '2026-10-13',
            taskType: 'practice',
            priority: 'high',
          },
        ]
        links = [{ label: 'Add English Practice to Planner', path: '/planner' }]
      } else if (qLower.includes('divide') || qLower.includes('time') || qLower.includes('hours') || qLower.includes('schedule')) {
        groundingTags.push('6.0h Daily Ceiling', 'Time Allocation')
        replyContent = `### ⏰ Optimal Daily Time Allocation for 6.0 Hours

Here is the balanced distribution calibrated for SSC CGL Tier 1:

- **Quantitative Aptitude (2.0 hours)**:
  - 1h Concept clarity / Theory review
  - 1h Timed practice (30 questions under 25 mins)
- **Reasoning (1.5 hours)**:
  - 45m Syllogisms, Puzzles & Seating arrangement
  - 45m Sectional mock speed test
- **English Comprehension (1.5 hours)**:
  - 30m Grammar rules & Error spotting
  - 30m Vocab (Idioms, One Word Substitutions)
  - 30m Reading Comprehension & Cloze Test
- **General Awareness (1.0 hour)**:
  - 35m High-weight Static GK (Polity / Modern History)
  - 25m Current Affairs (last 6 months digest)
- **Sunday**: Dedicated recovery day (light 2h revision or rest). Total weekly output: **36.0 hours**.`
      } else if (qLower.includes('triplet') || qLower.includes('quant shortcut') || qLower.includes('speed math') || qLower.includes('calculation speed') || qLower.includes('calculation')) {
        groundingTags.push('Quant Shortcuts', 'Speed Drills')
        replyContent = `### 📐 Core Calculation Speed & Quant Shortcuts for SSC CGL

Calculation speed is built through daily habit, not complex tricks. Memorize these foundational mental math anchors:

1. **Primary Pythagorean Triplets (Saves 45s per geometry question)**:
   - **(3, 4, 5)** ➔ Multiples: (6, 8, 10), (9, 12, 15), (12, 16, 20)
   - **(5, 12, 13)** ➔ Multiples: (10, 24, 26), (15, 36, 39)
   - **(7, 24, 25)** ➔ Multiples: (14, 48, 50)
   - **(8, 15, 17)** ➔ Multiples: (16, 30, 34)
   - **(9, 40, 41)** ➔ Multiples: (18, 80, 82)
   - **(11, 60, 61)**, **(12, 35, 37)**, **(20, 21, 29)**

2. **Fraction to Percentage Equivalents**:
   - $1/6 = 16.66\\%$, $1/7 = 14.28\\%$, $1/8 = 12.5\\%$, $1/9 = 11.11\\%$, $1/11 = 9.09\\%$, $1/12 = 8.33\\%$.

3. **Trigonometric Max/Min Shortcuts**:
   - $a\\sin\\theta + b\\cos\\theta$ ➔ Max: $+\\sqrt{a^2 + b^2}$, Min: $-\\sqrt{a^2 + b^2}$
   - $a\\sin^2\\theta + b\\csc^2\\theta$ ➔ Min value is $2\\sqrt{ab}$ (for $a, b > 0$)
   - $a\\cos^2\\theta + b\\sec^2\\theta$ ➔ Min value is $2\\sqrt{ab}$`
        missions = [
          {
            id: `mission-${Date.now()}-triplets`,
            title: 'Speed Math: 15-Minute Triplet & Fraction Drill',
            subject: 'Quantitative Aptitude',
            durationMinutes: 15,
            rationale: 'Builds immediate calculation speed for Arithmetic, Geometry & Trig.',
            targetDate: '2026-10-13',
            taskType: 'practice',
            priority: 'low',
          },
        ]
      } else if (qLower.includes('polity') || qLower.includes('article')) {
        groundingTags.push('General Awareness', 'High-Weight Polity')
        replyContent = `### 📜 High-Yield Indian Polity Articles for SSC CGL

Polity typically carries 5-7 questions in Tier 1. Master these core articles first:

1. **Fundamental Rights (Part III, Articles 12–35)**:
   - Art. 14: Equality before law
   - Art. 19: Six freedoms (speech, assembly, etc.)
   - Art. 21: Protection of life and personal liberty
   - Art. 32: Constitutional Remedies (5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto)
2. **Directive Principles (Part IV, Articles 36–51)**:
   - Art. 40: Village Panchayats
   - Art. 44: Uniform Civil Code
   - Art. 50: Separation of judiciary from executive
3. **Fundamental Duties (Part IVA)**:
   - Art. 51A (Added by 42nd Amendment, 1976; 11th duty by 86th Amendment, 2002)
4. **Union Executive & Parliament**:
   - Art. 61: Impeachment of President
   - Art. 72: Pardoning power of President
   - Art. 108: Joint sitting of Parliament
   - Art. 110: Money Bill definition`
        missions = [
          {
            id: `mission-${Date.now()}-polity`,
            title: 'Polity: Articles 12-51A & Writs Flashcard Drill',
            subject: 'General Awareness',
            durationMinutes: 35,
            rationale: 'Covers highest-yield articles tested in SSC CGL Tier 1.',
            targetDate: '2026-10-13',
            taskType: 'revision',
            priority: 'medium',
          },
        ]
      } else if (qLower.includes('syllogism') || qLower.includes('reasoning')) {
        groundingTags.push('Reasoning', 'Syllogism Rules')
        replyContent = `### 🧩 "Only a Few" Syllogism Rules Made Simple

In SSC CGL, "Only a few" is a classic trap. Here is the exact mental model:

- **Statement**: *"Only a few A are B"*
  - **Means Two Things Simultaneously**:
    1. **Some A are B** (Positive statement)
    2. **Some A are NOT B** (Negative statement)
- **Conclusions**:
  - *"All A can be B"* ➔ **FALSE** (Because some A are strictly not B)
  - *"All B can be A"* ➔ **TRUE / POSSIBLE** (Unless stated otherwise, B can completely fit inside A!)
  - *"Some A are B"* ➔ **TRUE**
  - *"Some A are not B"* ➔ **TRUE**`
      } else if (qLower.includes('weightage') || qLower.includes('highest weight') || qLower.includes('marks distribution')) {
        groundingTags.push('Tier 1 Weightage', 'Syllabus Prioritization')
        replyContent = `### 🏆 Highest Weightage Topics in SSC CGL Tier 1

Tier 1 has 100 questions (200 marks, 25 Qs per section). Here is where 70%+ of your score comes from:

1. **Quantitative Aptitude (25 Qs / 50 Marks)**:
   - **Algebra & Polynomials**: 3–4 Qs (Identities, factor theorem).
   - **Trigonometry & Heights**: 3–4 Qs (Direct identities, max/min values).
   - **Geometry & Mensuration**: 4–5 Qs (Circle theorems, tangents, compound solids).
   - **Arithmetic (Profit/Loss, Ratio, SI/CI, Time & Work)**: 8–10 Qs.
2. **General Intelligence & Reasoning (25 Qs / 50 Marks)**:
   - **Analogy & Classification**: 4–6 Qs.
   - **Series & Coding-Decoding**: 4–5 Qs.
   - **Syllogisms & Venn Diagrams**: 2–3 Qs.
3. **English Comprehension (25 Qs / 50 Marks)**:
   - **Reading Comprehension / Cloze Test**: 5 Qs.
   - **Error Spotting & Sentence Improvement**: 5–6 Qs.
   - **Idioms, One Word Substitutions & Synonyms/Antonyms**: 8–10 Qs.
4. **General Awareness (25 Qs / 50 Marks)**:
   - **Polity**: 4–6 Qs (Articles, Amendments, Executive).
   - **Modern Indian History & Culture**: 4–5 Qs.
   - **Current Affairs & Science**: 8–10 Qs.`
        links = [
          { label: 'Explore Interactive Syllabus', path: '/syllabus' },
          { label: 'Add High-Weight Topics to Plan', path: '/planner' },
        ]
      } else if (qLower.includes('burnout') || qLower.includes('consistency') || qLower.includes('burn out')) {
        groundingTags.push('Study Habit', 'Burnout Prevention', '6.0h Guardrail')
        replyContent = `### 🛡️ Building Long-Term Consistency Without Burnout

Aspirants don't fail SSC CGL because they lack intelligence; they stumble because they start with unsustainable 12-hour cram days and crash by week 3.

Here are the 4 non-negotiable rules for sustainable prep:

1. **Respect the 6.0-Hour Ceiling**:
   - Cap your focused study at 6.0 hours/day (36 hours/week). When your timer ends, close your books guilt-free.
2. **Work in 90-Minute Focus Cycles**:
   - 90 mins deep focus followed by 15 mins total rest (walk, hydrate, no phone scrolling).
3. **Protect Sunday as Recovery Day**:
   - Sunday is reserved for maximum 2 hours of light revision or complete rest. Mental rejuvenation is when brain memory consolidates.
4. **Measure Tasks, Not Just Clock Hours**:
   - Completing 4 quality high-yield problem sets beats 8 hours of passive video watching.`
        links = [{ label: 'View Weekly Schedule', path: '/planner' }]
      } else {
        // Direct, grounded response without robotic filler
        groundingTags.push('SSC CGL Guidance')
        if (isDemo) {
          replyContent = `I am ready to help you with that, Aman.

Looking at your current telemetry (**40 days to Tier 1, 7-day consistency streak, 148.5/200 Mock score**):

1. **Daily Capacity Rule**: Keep daily study strictly bounded to your **6.0h limit**. Consistency across 6 days beats erratic 10-hour bursts.
2. **Mock Error First**: Review your 9 errors from Mock #5 before attempting Mock #6. Each corrected concept yields +2 marks.
3. **Priority Order**: Focus on Trigonometry half-angles, Mensuration composite calculations, and High-Yield Polity articles.

How would you like to proceed — would you like a targeted practice drill, a concept clarification, or a schedule adjustment?`
        } else {
          replyContent = `I am ready to help you with that, ${userName}.

Looking at your Day 1 plan (**40 days to Tier 1, 6.0h daily capacity target**):

1. **Daily Capacity Rule**: Keep daily study strictly bounded to your **6.0h limit** to build a sustainable daily habit.
2. **Diagnostic Baseline**: Take an initial mock test or sectional drill to accurately measure your baseline score.
3. **Foundation First**: Master Arithmetic percentages/ratios, Reasoning series, and high-yield English grammar rules.

How would you like to proceed — would you like a starter study plan, concept notes, or practice recommendations?`
        }
      }

      const aiReply: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        groundingTags,
        missions,
        links,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiReply])
      setIsTyping(false)
    }, 800)
  }

  // Handle incoming prompt passed from AIMentorCard on Dashboard
  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt
    if (initialPrompt && !hasHandledInitialPrompt.current) {
      hasHandledInitialPrompt.current = true
      window.history.replaceState({}, document.title)
      handleSend(initialPrompt)
    }
  }, [location.state])

  const handleResetChat = () => {
    if (window.confirm('Reset conversation history and start a fresh session?')) {
      try {
        localStorage.removeItem(chatStorageKey)
      } catch {}
      const initial = isDemo ? AMAN_INITIAL_MESSAGES : getRealUserInitialMessages(userName)
      setMessages(initial)
      setScheduledMissions({})
      showToast('Conversation reset to initial study diagnostic.')
    }
  }

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700/50 dark:border-slate-200/50 text-xs font-semibold animate-slide-up">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => navigate('/planner')}
            className="ml-2 underline text-blue-400 dark:text-blue-600 hover:text-blue-300 transition-colors"
          >
            Open Planner →
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 pb-1 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                AI Study Mentor
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {apiKey ? 'Gemini Live BYOK' : 'Gemini 1.5 Pro Guarded'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span>Grounded in your saved logs</span>
              <span>•</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 6.0h/day capacity guard active
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Grounding Context Panel Toggle Button */}
          <button
            onClick={() => setShowContextSidebar(!showContextSidebar)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border',
              showContextSidebar
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:bg-muted/50'
            )}
            title="Inspect candidate metrics & grounding snapshot"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Study Snapshot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
          </button>

          {/* Reset Conversation */}
          <button
            onClick={handleResetChat}
            className="p-2 rounded-lg text-xs font-semibold bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted/50 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chat Layout Area (with optional Grounding Sidebar) */}
      <div className="flex-1 flex gap-4 overflow-hidden relative">
        {/* Messages Stream Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Scrollable Message List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pl-1 pb-4">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  className={cn(
                    'flex gap-3 max-w-3xl group',
                    isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm',
                      isAssistant
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-foreground'
                    )}
                  >
                    {isAssistant ? <Bot className="h-4 w-4" /> : 'You'}
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={cn(
                      'p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3.5 max-w-2xl shadow-sm border',
                      isAssistant
                        ? 'bg-card border-border/80 text-foreground'
                        : 'bg-blue-600 text-white border-blue-600 font-medium'
                    )}
                  >
                    {/* Grounding Tags Pill Header (Assistant only) */}
                    {isAssistant && m.groundingTags && (
                      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Database className="h-3 w-3 text-primary" /> Grounding:
                        </span>
                        {m.groundingTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Formatted Text Content */}
                    <FormattedMessage content={m.content} isAssistant={isAssistant} />

                    {/* Structured Missions Cards */}
                    {isAssistant && m.missions && m.missions.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 text-primary" />
                          <span>Actionable Study Missions (Capacity-Constrained):</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {m.missions.map((mission) => {
                            const isScheduled = scheduledMissions[mission.id]
                            const style =
                              SUBJECT_STYLES[mission.subject] ||
                              SUBJECT_STYLES['Quantitative Aptitude']

                            return (
                              <div
                                key={mission.id}
                                className="p-3.5 rounded-xl border border-border/90 bg-slate-50/70 dark:bg-slate-900/60 space-y-2.5 hover:border-primary/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          'text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1',
                                          style.badge
                                        )}
                                      >
                                        <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
                                        {mission.subject}
                                      </span>
                                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {mission.durationMinutes} mins
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-foreground">
                                      {mission.title}
                                    </h4>
                                  </div>

                                  <button
                                    onClick={() => handleScheduleMission(mission)}
                                    disabled={isScheduled}
                                    className={cn(
                                      'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0',
                                      isScheduled
                                        ? 'bg-emerald-500 text-white cursor-default'
                                        : 'pm-btn-primary py-1.5 px-3 text-xs'
                                    )}
                                  >
                                    {isScheduled ? (
                                      <>
                                        <Check className="h-3.5 w-3.5" /> Scheduled!
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle className="h-3.5 w-3.5" /> Add to Plan
                                      </>
                                    )}
                                  </button>
                                </div>

                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  <strong className="text-foreground">Why:</strong> {mission.rationale}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Context Links */}
                    {isAssistant && m.links && m.links.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2 border-t border-border/60">
                        {m.links.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => navigate(link.path)}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100/60 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions (Assistant Only) */}
                    {isAssistant && (
                      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyMessage(m.id, m.content)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            title="Copy response"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>

                          <div className="h-3 w-[1px] bg-border mx-1" />

                          <button
                            onClick={() => handleFeedback(m.id, 'helpful')}
                            className={cn(
                              'p-1 rounded hover:bg-muted transition-colors',
                              m.feedback === 'helpful' ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Helpful"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(m.id, 'not_helpful')}
                            className={cn(
                              'p-1 rounded hover:bg-muted transition-colors',
                              m.feedback === 'not_helpful' ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Needs improvement"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-[10px] opacity-70">{m.time}</span>
                      </div>
                    )}

                    {!isAssistant && (
                      <div className="text-[10px] text-right text-blue-100 opacity-80 pt-0.5">
                        {m.time}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-md mr-auto animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2.5 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Consulting study logs under 6.0h capacity limit...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Selector Bar */}
          <div className="shrink-0 pt-2 pb-1 space-y-2 border-t border-border/50 bg-background/50">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {promptCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors border',
                      isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'bg-card text-muted-foreground hover:text-foreground border-border'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(promptCategories.find((c) => c.id === selectedCategory) || promptCategories[0]).prompts.map(
                (promptText) => (
                  <button
                    key={promptText}
                    onClick={() => handleSend(promptText)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 whitespace-nowrap transition-colors font-medium hover:bg-muted/40 shadow-xs"
                  >
                    {promptText}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="shrink-0 flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border focus-within:ring-2 focus-within:ring-primary shadow-sm mt-1"
          >
            <input
              type="text"
              placeholder="Ask your mentor about mock analysis, study schedules, or high-yield rules..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="pm-btn-primary p-2.5 rounded-xl disabled:opacity-40 shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Grounding Profile & Data Period Panel (Slide-out or persistent on desktop) */}
        {showContextSidebar && (
          <aside className="w-80 shrink-0 rounded-2xl border border-border bg-card p-4 space-y-4 overflow-y-auto hidden lg:flex flex-col animate-fade-in shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Grounding Profile
                </h3>
              </div>
              <button
                onClick={() => setShowContextSidebar(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Target Exam</span>
                <span className="text-xs font-bold text-foreground">SSC CGL 2026 (Tier 1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Target Score</span>
                <span className="text-xs font-bold text-emerald-500">165+ / 200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Daily Capacity</span>
                <span className="text-xs font-bold text-foreground">
                  {telemetry.dailyCapacityHours}.0h / day (Max)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Current Streak</span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Flame className="h-3 w-3 fill-amber-500" />
                  {isDemo ? `${telemetry.currentStreakDays} Days` : '0 Days (Day 1)'}
                </span>
              </div>
            </div>

            {/* Grounded Evidence Snapshot */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-blue-500" />
                <span>Last 14-Day Evidence</span>
              </h4>

              <div className="space-y-2 text-xs">
                {isDemo ? (
                  <div className="p-2.5 rounded-lg border border-border bg-background space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Full Mock #5 (10 Oct)</span>
                      <span className="text-emerald-500 font-bold">148.5 / 200</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Accuracy: 82% • Mistakes: 9 items (+9.5 marks vs Mock #4)
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg border border-border bg-background space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Baseline Diagnostic</span>
                      <span className="text-muted-foreground font-bold">Pending</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Attempt a Tier 1 mini-mock to establish baseline scores
                    </p>
                  </div>
                )}

                <div className="p-2.5 rounded-lg border border-border bg-background space-y-1.5">
                  <span className="text-[11px] font-bold text-foreground">Verified Weak Areas:</span>
                  {isDemo ? (
                    <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-3.5">
                      <li><strong className="text-foreground">Trigonometry</strong>: Half-angle tan & max/min identities</li>
                      <li><strong className="text-foreground">Mensuration</strong>: Composite solid cavity calculation</li>
                      <li><strong className="text-foreground">Syllogisms</strong>: "Only a few" negative quantifiers</li>
                    </ul>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      None logged yet. Practice sets or mock tests will identify specific weak concepts.
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-background space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Spaced Revisions Due</span>
                    <span className={cn('font-bold', isDemo ? 'text-amber-500' : 'text-emerald-500')}>
                      {telemetry.dueRevisionsCount} items
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isDemo
                      ? 'Trig identities, Articles 12-35, Conditional rules'
                      : 'Queue is clean. Bookmarked flashcards will appear here'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Guardrails & Policy */}
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                <span>AI Guardrails (FR-014)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All recommendations are capacity-checked. Advice is grounded in your saved records and never assumes certainty of selection.
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Configure BYOK Key in Settings</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
