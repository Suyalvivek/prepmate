import { useState } from 'react'
import { BookOpen, CheckCircle, Search, Layers, AlertCircle, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Topic {
  id: string
  name: string
  subject: string
  weightage: 'High' | 'Medium' | 'Low'
  questionsAvg: number
  status: 'not_started' | 'in_progress' | 'mastered'
  notes?: string
}

const SAMPLE_TOPICS: Topic[] = [
  // Quantitative Aptitude
  { id: '1', name: 'Percentage & Calculations', subject: 'Quantitative Aptitude', weightage: 'High', questionsAvg: 3, status: 'mastered' },
  { id: '2', name: 'Ratio & Proportion', subject: 'Quantitative Aptitude', weightage: 'High', questionsAvg: 2, status: 'in_progress' },
  { id: '3', name: 'Profit, Loss & Discount', subject: 'Quantitative Aptitude', weightage: 'High', questionsAvg: 3, status: 'in_progress' },
  { id: '4', name: 'Time, Speed & Distance', subject: 'Quantitative Aptitude', weightage: 'Medium', questionsAvg: 2, status: 'not_started' },
  { id: '5', name: 'Trigonometry & Heights/Distances', subject: 'Quantitative Aptitude', weightage: 'High', questionsAvg: 4, status: 'not_started' },
  { id: '6', name: 'Geometry & Mensuration', subject: 'Quantitative Aptitude', weightage: 'High', questionsAvg: 4, status: 'not_started' },

  // Reasoning
  { id: '7', name: 'Syllogism & Venn Diagrams', subject: 'Reasoning', weightage: 'High', questionsAvg: 3, status: 'mastered' },
  { id: '8', name: 'Analogy & Classification', subject: 'Reasoning', weightage: 'Medium', questionsAvg: 4, status: 'in_progress' },
  { id: '9', name: 'Coding - Decoding', subject: 'Reasoning', weightage: 'High', questionsAvg: 3, status: 'mastered' },
  { id: '10', name: 'Blood Relations', subject: 'Reasoning', weightage: 'Medium', questionsAvg: 2, status: 'not_started' },
  { id: '11', name: 'Direction Sense Test', subject: 'Reasoning', weightage: 'Low', questionsAvg: 1, status: 'in_progress' },

  // English
  { id: '12', name: 'Reading Comprehension', subject: 'English', weightage: 'High', questionsAvg: 5, status: 'in_progress' },
  { id: '13', name: 'Spotting the Error (Grammar Rules)', subject: 'English', weightage: 'High', questionsAvg: 3, status: 'in_progress' },
  { id: '14', name: 'Idioms & Phrases', subject: 'English', weightage: 'Medium', questionsAvg: 3, status: 'not_started' },
  { id: '15', name: 'One Word Substitution', subject: 'English', weightage: 'Medium', questionsAvg: 3, status: 'mastered' },
  { id: '16', name: 'Cloze Test & Para Jumbles', subject: 'English', weightage: 'High', questionsAvg: 5, status: 'not_started' },

  // General Awareness
  { id: '17', name: 'Indian Polity & Constitution', subject: 'General Awareness', weightage: 'High', questionsAvg: 4, status: 'in_progress' },
  { id: '18', name: 'Modern Indian History', subject: 'General Awareness', weightage: 'High', questionsAvg: 3, status: 'not_started' },
  { id: '19', name: 'Physical & Indian Geography', subject: 'General Awareness', weightage: 'Medium', questionsAvg: 3, status: 'not_started' },
  { id: '20', name: 'General Science (Physics/Chem/Bio)', subject: 'General Awareness', weightage: 'High', questionsAvg: 5, status: 'not_started' },
]

export function SyllabusPage() {
  const [topics, setTopics] = useState<Topic[]>(SAMPLE_TOPICS)
  const [selectedExam, setSelectedExam] = useState<'SSC_CGL' | 'SSC_CPO' | 'SSC_CHSL'>('SSC_CGL')
  const [selectedSubject, setSelectedSubject] = useState<string>('All')
  const [search, setSearch] = useState('')

  const subjects = ['All', 'Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness']

  const updateStatus = (id: string, newStatus: Topic['status']) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  const filteredTopics = topics.filter((t) => {
    const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchesSubject && matchesSearch
  })

  const totalCount = topics.length
  const masteredCount = topics.filter((t) => t.status === 'mastered').length
  const inProgressCount = topics.filter((t) => t.status === 'in_progress').length
  const completionPercent = Math.round((masteredCount / totalCount) * 100)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-primary" />
            Syllabus Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Topic-by-topic mastery tracking across Tier 1 and Tier 2 exams.
          </p>
        </div>

        {/* Exam Tabs */}
        <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
          {(['SSC_CGL', 'SSC_CPO', 'SSC_CHSL'] as const).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedExam(code)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all',
                selectedExam === code
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {code.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pm-card p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Overall Mastery Progress</span>
              <span className="font-bold text-primary">{completionPercent}% Mastered</span>
            </div>
            <div className="mt-3 w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Mastered: {masteredCount} topics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              In Progress: {inProgressCount} topics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
              Not Started: {totalCount - masteredCount - inProgressCount} topics
            </span>
          </div>
        </div>

        <div className="pm-card p-5 bg-warning/5 border-warning/20 flex flex-col justify-between">
          <div className="flex items-start gap-2.5 text-warning">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">Verification Source</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Topic mappings and weightages are sample estimates. Always cross-verify with official notices on ssc.gov.in.
              </p>
            </div>
          </div>
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-primary hover:underline flex items-center gap-1 mt-3"
          >
            Visit ssc.gov.in <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedSubject === sub
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="pm-card p-4 flex items-center justify-between gap-3 hover:border-primary/40 transition-all"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground truncate">{topic.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  ~{topic.questionsAvg} Qs
                </span>
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                    topic.weightage === 'High'
                      ? 'bg-rose-500/10 text-rose-500'
                      : topic.weightage === 'Medium'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-slate-500/10 text-slate-500'
                  )}
                >
                  {topic.weightage} Weight
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{topic.subject}</p>
            </div>

            {/* Status Selector */}
            <select
              value={topic.status}
              onChange={(e) => updateStatus(topic.id, e.target.value as Topic['status'])}
              className={cn(
                'text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer shrink-0 transition-colors',
                topic.status === 'mastered' &&
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
                topic.status === 'in_progress' &&
                  'bg-amber-500/10 text-amber-500 border-amber-500/30',
                topic.status === 'not_started' &&
                  'bg-muted text-muted-foreground border-border'
              )}
            >
              <option value="not_started">⚪ Not Started</option>
              <option value="in_progress">🟡 In Progress</option>
              <option value="mastered">🟢 Mastered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
