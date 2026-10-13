import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, Plus } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'

interface TestPoint {
  id: string
  label: string
  score: number
  accuracy: number
  x: number // SVG coordinates 0-100%
  y: number
}

const DEMO_TESTS: TestPoint[] = [
  { id: '1', label: 'Test 1', score: 135, accuracy: 68, x: 10, y: 130 },
  { id: '2', label: 'Test 2', score: 146, accuracy: 72, x: 30, y: 108 },
  { id: '3', label: 'Test 3', score: 162, accuracy: 78, x: 50, y: 76 },
  { id: '4', label: 'Test 4', score: 154, accuracy: 75, x: 70, y: 92 },
  { id: '5', label: 'Test 5', score: 171, accuracy: 82, x: 90, y: 58 },
]

export function MockTestPerformanceCard() {
  const { user } = useAuth()
  const isDemo = user?.email === 'aman@prepmate.app' || user?.uid === 'demo-aman-101'

  const [tests, setTests] = useState<TestPoint[]>(() => {
    if (isDemo) return DEMO_TESTS
    try {
      const saved = localStorage.getItem('prepmate_mock_tests')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5).reverse().map((t: any, idx: number, arr: any[]) => {
            const step = arr.length > 1 ? 80 / (arr.length - 1) : 0
            const x = arr.length > 1 ? 10 + idx * step : 50
            const y = Math.max(20, Math.min(160, 160 - (Number(t.score) / 200) * 140))
            return {
              id: t.id || String(idx),
              label: `Mock ${idx + 1}`,
              score: Number(t.score),
              accuracy: t.accuracyPercent || 80,
              x,
              y,
            }
          })
        }
      }
    } catch {
      // fallback
    }
    return []
  })

  const [activeTest, setActiveTest] = useState<TestPoint | null>(() => {
    return isDemo ? DEMO_TESTS[2] : tests[0] || null
  })

  useEffect(() => {
    if (isDemo) {
      setTests(DEMO_TESTS)
      setActiveTest(DEMO_TESTS[2])
    } else {
      try {
        const saved = localStorage.getItem('prepmate_mock_tests')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = parsed.slice(0, 5).reverse().map((t: any, idx: number, arr: any[]) => {
              const step = arr.length > 1 ? 80 / (arr.length - 1) : 0
              const x = arr.length > 1 ? 10 + idx * step : 50
              const y = Math.max(20, Math.min(160, 160 - (Number(t.score) / 200) * 140))
              return {
                id: t.id || String(idx),
                label: `Mock ${idx + 1}`,
                score: Number(t.score),
                accuracy: t.accuracyPercent || 80,
                x,
                y,
              }
            })
            setTests(mapped)
            setActiveTest(mapped[mapped.length - 1] || null)
            return
          }
        }
      } catch {
        // fallback
      }
      setTests([])
      setActiveTest(null)
    }
  }, [isDemo])

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-card p-5 md:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Mock Test Performance
          </h2>
          <Link
            to="/mock-tests"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
          >
            <span>View Analysis</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-7 px-4 text-center my-auto min-h-[160px]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Mock Tests Taken Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] leading-relaxed">
              Take your first diagnostic mock test to generate score trajectories and accuracy curves.
            </p>
            <Link
              to="/mock-tests"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log First Mock</span>
            </Link>
          </div>
        ) : (
          /* Chart area */
          <div className="relative mt-3 h-36 w-full">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between text-[10px] font-medium text-slate-400 select-none">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* SVG Line & Area chart */}
            <div className="ml-7 h-full flex flex-col justify-between">
              <div className="relative h-28 w-full">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                  <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                  <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                  <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                  <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
                </div>

                {/* Interactive Tooltip Callout */}
                {activeTest && (
                  <div
                    className="absolute z-20 -top-2 transform -translate-x-1/2 transition-all duration-200 pointer-events-none"
                    style={{ left: `${activeTest.x}%` }}
                  >
                    <div className="bg-slate-900 dark:bg-slate-950 text-white px-2.5 py-1 rounded-xl shadow-lg border border-slate-700/80 text-[10px] whitespace-nowrap">
                      <p className="font-bold">Score: {activeTest.score}</p>
                      <p className="text-slate-300">Accuracy: {activeTest.accuracy}%</p>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                  </div>
                )}

                {/* Main SVG Curve */}
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 100 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area Fill */}
                  {tests.length > 1 && (
                    <path
                      d={`M ${tests[0].x} ${tests[0].y} ` +
                        tests.slice(1).map((t) => `L ${t.x} ${t.y}`).join(' ') +
                        ` L ${tests[tests.length - 1].x} 160 L ${tests[0].x} 160 Z`}
                      fill="url(#scoreAreaGrad)"
                    />
                  )}

                  {/* Smooth / Segmented Line */}
                  {tests.length > 1 && (
                    <path
                      d={`M ${tests[0].x} ${tests[0].y} ` +
                        tests.slice(1).map((t) => `L ${t.x} ${t.y}`).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Interactive Points */}
                  {tests.map((t) => (
                    <circle
                      key={t.id}
                      cx={t.x}
                      cy={t.y}
                      r={activeTest?.id === t.id ? '5' : '3.5'}
                      className={`cursor-pointer transition-all ${
                        activeTest?.id === t.id
                          ? 'fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2'
                          : 'fill-blue-500 hover:scale-125'
                      }`}
                      onMouseEnter={() => setActiveTest(t)}
                    />
                  ))}
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
                {tests.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTest(t)}
                    className={`transition-colors ${
                      activeTest?.id === t.id
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : 'hover:text-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
