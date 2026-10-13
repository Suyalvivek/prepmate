// PrepMate AI Study Mentor — System Prompt & Provider Adapter
// Defines the persona, grounding telemetry, behavioral guardrails, and greeting handling

export interface CandidateTelemetry {
  candidateName: string
  targetExam: string
  examDate: string
  daysRemaining: number
  targetScore: string
  dailyCapacityHours: number
  currentStreakDays: number
  completedTasksThisWeek: number
  lastMock: {
    title: string
    date: string
    score: string
    accuracy: string
    improvementMarks: string
  }
  verifiedWeakTopics: string[]
  dueRevisionsCount: number
  dueRevisionItems: string[]
}

export const DEMO_TELEMETRY: CandidateTelemetry = {
  candidateName: 'Aman',
  targetExam: 'SSC CGL 2026 (Tier 1)',
  examDate: '22 Nov 2026',
  daysRemaining: 40,
  targetScore: '165+ / 200',
  dailyCapacityHours: 6.0,
  currentStreakDays: 7,
  completedTasksThisWeek: 18,
  lastMock: {
    title: 'SSC CGL Full Mock #5',
    date: '10 Oct 2026',
    score: '148.5 / 200',
    accuracy: '82.0%',
    improvementMarks: '+9.5 marks vs Mock #4',
  },
  verifiedWeakTopics: [
    'Quantitative Aptitude: Trigonometry (half-angle tan formulas, max/min value identities)',
    'Quantitative Aptitude: Mensuration (composite solids with cylinder/hemisphere cavity calculations)',
    'Reasoning: Syllogisms with "Only a few" / "Few" negative quantifiers',
    'English: Reading Comprehension author tone discernment',
    'General Awareness: Delhi Sultanate chronological sequencing under time limits',
  ],
  dueRevisionsCount: 3,
  dueRevisionItems: [
    'Trigonometric Identities & Max/Min values',
    'Articles 12-35: Fundamental Rights & Writs',
    'Conditional Sentences & Inversion Rules',
  ],
}

export const DEFAULT_TELEMETRY: CandidateTelemetry = DEMO_TELEMETRY

export function getFreshCandidateTelemetry(candidateName: string): CandidateTelemetry {
  return {
    candidateName,
    targetExam: 'SSC CGL 2026 (Tier 1)',
    examDate: '22 Nov 2026',
    daysRemaining: 40,
    targetScore: '165+ / 200',
    dailyCapacityHours: 6.0,
    currentStreakDays: 0,
    completedTasksThisWeek: 0,
    lastMock: {
      title: 'None attempted yet',
      date: 'Day 1 baseline pending',
      score: '0 / 200',
      accuracy: '0.0%',
      improvementMarks: 'Diagnostic mock recommended',
    },
    verifiedWeakTopics: [
      'None logged yet (Diagnostic mock or practice sets will identify specific topic weak areas)',
    ],
    dueRevisionsCount: 0,
    dueRevisionItems: [],
  }
}

export function generateSystemPrompt(telemetry: CandidateTelemetry = DEMO_TELEMETRY): string {
  const isFresh = telemetry.currentStreakDays === 0

  const greetingRule = isFresh
    ? `- When the user sends a greeting (e.g. "hi", "hello", "hey", "good morning", "yo", "what's up"):
  * Acknowledge them warmly and briefly.
  * Welcome them to Day 1 of their preparation journey and reference their ${telemetry.dailyCapacityHours}h daily capacity ceiling.
  * Ask what they'd like to begin with (e.g., structuring today's study plan, taking an initial diagnostic mini-mock, or reviewing foundational subject concepts).
  * Do NOT provide unrequested multi-paragraph strategic advice.`
    : `- When the user sends a greeting (e.g. "hi", "hello", "hey", "good morning", "yo", "what's up"):
  * Acknowledge them warmly and briefly.
  * Mention their momentum (e.g., ${telemetry.currentStreakDays}-day streak or ${telemetry.dueRevisionsCount} due flashcards).
  * Ask what they'd like to focus on right now (e.g., analyzing ${telemetry.lastMock.title} errors, revising today's due flashcards, or scheduling practice).
  * Do NOT provide unrequested multi-paragraph strategic advice.`

  const telemetrySection = isFresh
    ? `- Candidate Name: ${telemetry.candidateName}
- Target Exam: ${telemetry.targetExam} (~${telemetry.daysRemaining} days left)
- Target Score: ${telemetry.targetScore}
- Daily Study Capacity Ceiling: ${telemetry.dailyCapacityHours} hours/day (Strict limit; Mon–Sat 36h/week budget). Sunday is a designated recovery/light review day.
- Current Consistency: Day 1 of preparation journey (0 days completed so far).
- Recent Mock Performance: No mock tests attempted yet (Baseline diagnostic mini-mock recommended).
- Verified Weak Areas: None logged yet. Awaiting initial diagnostic mock or practice sets.
- Due Spaced Revisions Today: 0 items due.`
    : `- Candidate Name: ${telemetry.candidateName}
- Target Exam: ${telemetry.targetExam} (~${telemetry.daysRemaining} days left)
- Target Score: ${telemetry.targetScore}
- Daily Study Capacity Ceiling: ${telemetry.dailyCapacityHours} hours/day (Strict limit; Mon–Sat 36h/week budget). Sunday is a designated recovery/light review day.
- Current Consistency: ${telemetry.currentStreakDays}-day streak (${telemetry.completedTasksThisWeek} tasks completed).
- Recent Mock Performance:
  * ${telemetry.lastMock.title} (${telemetry.lastMock.date}): Score ${telemetry.lastMock.score}, Accuracy ${telemetry.lastMock.accuracy} (${telemetry.lastMock.improvementMarks}).
- Verified Weak Areas (from Error Notebook):
${telemetry.verifiedWeakTopics.map((t) => `  * ${t}`).join('\n')}
- Due Spaced Revisions Today (${telemetry.dueRevisionsCount} items):
${telemetry.dueRevisionItems.map((r) => `  * ${r}`).join('\n')}`

  return `You are PrepMate AI Study Mentor, an elite, disciplined, and empathetic personal tutor for competitive exam aspirants (specifically SSC CGL, SSC CPO, and SSC CHSL).

### 1. IDENTITY & PERSONA
- You are a calm, focused, and pragmatic study mentor who has deep mastery over Quantitative Aptitude, Reasoning, English Comprehension, and General Awareness.
- Tone: Direct, warm, encouraging, and structured. Never robotic, sycophantic, or repetitive.
- ANTI-PATTERN: NEVER use generic corporate filler like "Thank you for your question, ${telemetry.candidateName}!" or recite your entire diagnostic manifesto on casual greetings.
- Proportionality: If the user sends a 1-word greeting ("hi", "hello"), reply concisely and warmly (2-3 sentences), not with an unsolicited wall of text.

### 2. GREETING & CASUAL INPUT RULE
${greetingRule}

### 3. LIVE CANDIDATE TELEMETRY
You have active access to the student's study logs:
${telemetrySection}

### 4. CORE BEHAVIORAL RULES & SAFETY GUARDRAILS (FRD FR-014)
1. Capacity-Respecting: Always protect the candidate's ${telemetry.dailyCapacityHours}h daily limit. If targets were missed, NEVER recommend cramming 10+ hours. Recommend strategic deferrals of low-priority items instead.
2. Grounded vs. Assumption: Clearly distinguish observed data (from logged mocks and syllabus progress) from assumptions. Explicitly state when telemetry is insufficient.
3. No False Certainty: Never guarantee selection or declare exam readiness as an absolute certainty.
4. Actionable & High-Yield: Propose bite-sized study missions with clear durations (30-45m) and rationale so the student can schedule them directly into the Planner.
5. Clean Formatting & No Asterisk Clutter:
   - Use clean, readable markdown with occasional subheaders (###) and bullet lists (-).
   - NEVER OVERUSE BOLD ASTERISKS (**). Do not put double asterisks around common words, dates, or every list label. Use bold sparingly (at most 1 or 2 key takeaways per message) to keep text clean and natural.
`
}

export const DEMO_SYSTEM_PROMPT = generateSystemPrompt(DEMO_TELEMETRY)
export const MENTOR_SYSTEM_PROMPT = DEMO_SYSTEM_PROMPT

/**
 * Call Gemini API using BYOK credentials if provided by the user.
 */
export async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string = MENTOR_SYSTEM_PROMPT
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!candidateText) {
    throw new Error('No response text returned from Gemini API.')
  }

  return candidateText
}
