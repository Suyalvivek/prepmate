import { useState } from 'react'
import { FileText, Plus, AlertTriangle, CheckCircle2, TrendingUp, Award, BookmarkPlus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MockTest {
  id: string
  title: string
  examStage: string
  date: string
  score: number
  totalMarks: number
  accuracyPercent: number
  mistakesCount: number
}

interface MistakeItem {
  id: string
  testTitle: string
  questionText: string
  subject: string
  category: 'concept_gap' | 'calculation_error' | 'time_management' | 'guess' | 'careless'
  convertedToRevision: boolean
}

const INITIAL_TESTS: MockTest[] = [
  { id: '1', title: 'SSC CGL Tier 1 Full Mock #5', examStage: 'Tier 1', date: '10 Oct 2026', score: 148.5, totalMarks: 200, accuracyPercent: 82, mistakesCount: 9 },
  { id: '2', title: 'SSC CGL Tier 1 Full Mock #4', examStage: 'Tier 1', date: '04 Oct 2026', score: 139.0, totalMarks: 200, accuracyPercent: 77, mistakesCount: 14 },
  { id: '3', title: 'Sectional Mock: Quantitative Aptitude', examStage: 'Tier 1 Sectional', date: '28 Sep 2026', score: 42.5, totalMarks: 50, accuracyPercent: 88, mistakesCount: 3 },
]

const INITIAL_MISTAKES: MistakeItem[] = [
  { id: 'm1', testTitle: 'Full Mock #5', questionText: 'Trigonometry: In a right triangle, finding tan(θ/2) given sin θ', subject: 'Quant', category: 'concept_gap', convertedToRevision: false },
  { id: 'm2', testTitle: 'Full Mock #5', questionText: 'Mensuration: Cylinder volume with hemisphere cavity on top', subject: 'Quant', category: 'calculation_error', convertedToRevision: true },
  { id: 'm3', testTitle: 'Full Mock #5', questionText: 'Reading Comprehension: Tone of author in economic policy passage', subject: 'English', category: 'guess', convertedToRevision: false },
  { id: 'm4', testTitle: 'Full Mock #4', questionText: 'Syllogism: Negative conclusion with "Only a few" quantifier', subject: 'Reasoning', category: 'concept_gap', convertedToRevision: false },
  { id: 'm5', testTitle: 'Full Mock #4', questionText: 'History: Chronology of Delhi Sultanate dynasties', subject: 'GA', category: 'time_management', convertedToRevision: false },
]

const CATEGORY_LABELS: Record<MistakeItem['category'], { label: string; color: string }> = {
  concept_gap: { label: 'Concept Gap', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  calculation_error: { label: 'Calculation Error', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  time_management: { label: 'Time Management', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  guess: { label: 'Guess / Blind Pick', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  careless: { label: 'Careless Reading', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
}

export function MockTestsPage() {
  const [activeTab, setActiveTab] = useState<'tests' | 'mistakes'>('tests')
  const [tests, setTests] = useState<MockTest[]>(INITIAL_TESTS)
  const [mistakes, setMistakes] = useState<MistakeItem[]>(INITIAL_MISTAKES)
  const [showLogModal, setShowLogModal] = useState(false)

  // Log test form
  const [newTitle, setNewTitle] = useState('')
  const [newScore, setNewScore] = useState(140)
  const [newTotalMarks, setNewTotalMarks] = useState(200)

  const handleConvertToRevision = (id: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, convertedToRevision: true } : m))
    )
  }

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newTest: MockTest = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      examStage: 'Tier 1',
      date: 'Today',
      score: Number(newScore),
      totalMarks: Number(newTotalMarks),
      accuracyPercent: Math.round((Number(newScore) / Number(newTotalMarks)) * 100),
      mistakesCount: 5,
    }
    setTests([newTest, ...tests])
    setNewTitle('')
    setShowLogModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-primary" />
            Mock Tests & Error Notebook
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track test scores and turn exam mistakes directly into targeted revision tasks.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="pm-btn-primary flex items-center gap-2 text-sm px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          <span>Log Mock Test</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pm-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Tests Taken</span>
          <p className="text-2xl font-bold text-foreground mt-1">{tests.length}</p>
          <span className="text-[11px] text-emerald-500 font-medium">Target: 20 tests</span>
        </div>
        <div className="pm-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Average Score</span>
          <p className="text-2xl font-bold text-foreground mt-1">143.3</p>
          <span className="text-[11px] text-muted-foreground">out of 200</span>
        </div>
        <div className="pm-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Highest Score</span>
          <p className="text-2xl font-bold text-primary mt-1">148.5</p>
          <span className="text-[11px] text-emerald-500 font-medium">Top 5% bracket</span>
        </div>
        <div className="pm-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Unresolved Mistakes</span>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {mistakes.filter((m) => !m.convertedToRevision).length}
          </p>
          <span className="text-[11px] text-muted-foreground">Ready for revision</span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex bg-muted/60 p-1 rounded-lg border border-border w-fit">
        <button
          onClick={() => setActiveTab('tests')}
          className={cn(
            'px-4 py-1.5 text-xs font-semibold rounded-md transition-all',
            activeTab === 'tests'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Mock Test Logs ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('mistakes')}
          className={cn(
            'px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5',
            activeTab === 'mistakes'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span>Error Notebook</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-500 font-bold">
            {mistakes.filter((m) => !m.convertedToRevision).length}
          </span>
        </button>
      </div>

      {/* Tab 1: Mock Tests List */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="pm-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-all"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{test.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {test.examStage}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                  <span>Date: {test.date}</span>
                  <span>•</span>
                  <span>Accuracy: {test.accuracyPercent}%</span>
                  <span>•</span>
                  <span className="text-amber-500">{test.mistakesCount} Mistakes Logged</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xl font-bold text-foreground">{test.score}</span>
                  <span className="text-xs text-muted-foreground"> / {test.totalMarks}</span>
                </div>
                <button
                  onClick={() => setActiveTab('mistakes')}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-foreground hover:bg-muted font-medium transition-colors"
                >
                  View Errors
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Error Notebook */}
      {activeTab === 'mistakes' && (
        <div className="space-y-3">
          <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border flex items-center justify-between">
            <span>
              💡 Turn mistakes into spaced repetition items with one click. They will automatically be added to your revision queue.
            </span>
          </div>

          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className={cn(
                'pm-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all',
                mistake.convertedToRevision && 'opacity-60 bg-muted/20'
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border font-semibold',
                      CATEGORY_LABELS[mistake.category].color
                    )}
                  >
                    {CATEGORY_LABELS[mistake.category].label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {mistake.subject}
                  </span>
                  <span className="text-xs text-muted-foreground">from {mistake.testTitle}</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1.5 leading-snug">
                  {mistake.questionText}
                </p>
              </div>

              <div className="shrink-0">
                {mistake.convertedToRevision ? (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Added to Revisions
                  </span>
                ) : (
                  <button
                    onClick={() => handleConvertToRevision(mistake.id)}
                    className="pm-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5" />
                    <span>Create Revision Task</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Log Completed Mock Test</h3>
              <button onClick={() => setShowLogModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTest} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Test Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSC CGL 2024 Tier 1 Official PYQ 2023"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Your Marks
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button type="submit" className="pm-btn-primary px-4 py-2 text-sm">
                  Save Test Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
