// PrepMate — Database Seed
// All exam/syllabus data is labelled SAMPLE / UNVERIFIED
// Do not treat this as official SSC content

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding PrepMate database...')

  // ── Achievements ──────────────────────────────────────────────────────────
  const achievements = [
    {
      code: 'first_session',
      name: 'First Focus',
      description: 'Completed your first study session.',
      criteria: { event: 'session_completed', count: 1 },
    },
    {
      code: 'first_mock',
      name: 'Test Taker',
      description: 'Logged your first mock test.',
      criteria: { event: 'mock_logged', count: 1 },
    },
    {
      code: 'week_consistent',
      name: '7-Day Streak',
      description: 'Studied 7 days in a row (planned rest days count).',
      criteria: { event: 'streak', days: 7 },
    },
    {
      code: 'revision_milestone_10',
      name: 'Revision Habit',
      description: 'Completed 10 revision reviews.',
      criteria: { event: 'revision_completed', count: 10 },
    },
    {
      code: 'recovery_after_miss',
      name: 'Bounce Back',
      description: 'Returned to study after a missed day.',
      criteria: { event: 'recovery', count: 1 },
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      create: achievement,
      update: {},
    })
  }
  console.log(`  ✓ ${achievements.length} achievements`)

  // ── Sample Exams (UNVERIFIED — illustrative only) ─────────────────────────
  const exams = [
    {
      code: 'SSC_CGL',
      name: 'SSC CGL',
      organisation: 'Staff Selection Commission',
      description:
        '[SAMPLE] Combined Graduate Level Examination. Verify all details at ssc.gov.in.',
    },
    {
      code: 'SSC_CPO',
      name: 'SSC CPO',
      organisation: 'Staff Selection Commission',
      description:
        '[SAMPLE] Central Police Organisations Examination. Verify all details at ssc.gov.in.',
    },
    {
      code: 'SSC_CHSL',
      name: 'SSC CHSL',
      organisation: 'Staff Selection Commission',
      description:
        '[SAMPLE] Combined Higher Secondary Level Examination. Verify all details at ssc.gov.in.',
    },
  ]

  const examRecords: Record<string, { id: string }> = {}
  for (const exam of exams) {
    const record = await prisma.exam.upsert({
      where: { code: exam.code },
      create: exam,
      update: {},
    })
    examRecords[exam.code] = record
  }
  console.log(`  ✓ ${exams.length} exams (sample/unverified)`)

  // ── Sample Exam Stages ────────────────────────────────────────────────────
  const stages = [
    { examCode: 'SSC_CGL', code: 'TIER_1', name: 'Tier I — Preliminary', sortOrder: 1 },
    { examCode: 'SSC_CGL', code: 'TIER_2', name: 'Tier II — Mains', sortOrder: 2 },
    { examCode: 'SSC_CPO', code: 'PAPER_1', name: 'Paper I', sortOrder: 1 },
    { examCode: 'SSC_CPO', code: 'PAPER_2', name: 'Paper II', sortOrder: 2 },
    { examCode: 'SSC_CHSL', code: 'TIER_1', name: 'Tier I', sortOrder: 1 },
    { examCode: 'SSC_CHSL', code: 'TIER_2', name: 'Tier II', sortOrder: 2 },
  ]

  const stageRecords: Record<string, { id: string }> = {}
  for (const stage of stages) {
    const examId = examRecords[stage.examCode]?.id
    if (!examId) continue
    const record = await prisma.examStage.upsert({
      where: { examId_code: { examId, code: stage.code } },
      create: { examId, code: stage.code, name: stage.name, sortOrder: stage.sortOrder },
      update: {},
    })
    stageRecords[`${stage.examCode}_${stage.code}`] = record
  }
  console.log(`  ✓ ${stages.length} exam stages (sample/unverified)`)

  // ── Sample Subjects ───────────────────────────────────────────────────────
  const subjects = [
    { name: 'General Intelligence & Reasoning', description: '[SAMPLE] Verbal and non-verbal reasoning.' },
    { name: 'General Awareness', description: '[SAMPLE] Current affairs, static GK, science.' },
    { name: 'Quantitative Aptitude', description: '[SAMPLE] Mathematics and numerical ability.' },
    { name: 'English Language & Comprehension', description: '[SAMPLE] Grammar, vocabulary, reading.' },
    { name: 'Statistics', description: '[SAMPLE] Data interpretation and statistics (CGL Tier II).' },
    { name: 'General Studies', description: '[SAMPLE] Combined GS for CPO Paper II.' },
  ]

  const subjectRecords: Record<string, { id: string }> = {}
  for (const subject of subjects) {
    const record = await prisma.subject.upsert({
      where: { name: subject.name },
      create: subject,
      update: {},
    })
    subjectRecords[subject.name] = record
  }
  console.log(`  ✓ ${subjects.length} subjects (sample/unverified)`)

  // ── Sample Topics — Quantitative Aptitude ─────────────────────────────────
  const qaSubjectId = subjectRecords['Quantitative Aptitude']?.id
  const topics = qaSubjectId
    ? [
        { slug: 'number-system', name: 'Number System', sortOrder: 1 },
        { slug: 'simplification', name: 'Simplification & Approximation', sortOrder: 2 },
        { slug: 'percentage', name: 'Percentage', sortOrder: 3 },
        { slug: 'profit-loss', name: 'Profit & Loss', sortOrder: 4 },
        { slug: 'ratio-proportion', name: 'Ratio & Proportion', sortOrder: 5 },
        { slug: 'time-work', name: 'Time & Work', sortOrder: 6 },
        { slug: 'time-distance', name: 'Time, Speed & Distance', sortOrder: 7 },
        { slug: 'si-ci', name: 'Simple & Compound Interest', sortOrder: 8 },
        { slug: 'algebra', name: 'Algebra', sortOrder: 9 },
        { slug: 'geometry', name: 'Geometry & Mensuration', sortOrder: 10 },
        { slug: 'trigonometry', name: 'Trigonometry', sortOrder: 11 },
        { slug: 'data-interpretation', name: 'Data Interpretation', sortOrder: 12 },
      ]
    : []

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: { ...topic, subjectId: qaSubjectId! },
      update: {},
    })
  }
  console.log(`  ✓ ${topics.length} sample topics (Quantitative Aptitude, sample/unverified)`)

  console.log('\n✅ Seed complete!')
  console.log('⚠️  All exam/syllabus data is SAMPLE and UNVERIFIED.')
  console.log('   Verify against official ssc.gov.in notices before use.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
