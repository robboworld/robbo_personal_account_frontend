// Paid-edition interest survey (tariffs not approved yet). The values must match
// backend/package/licensing/interest.go.
export const INTEREST_ROLES = [
  'club_teacher',
  'club_owner',
  'school_teacher',
  'parent',
  'student',
  'other',
]

export const INTEREST_FEATURES = [
  'parent_progress',
  'club_showcase',
  'club_scenarios',
  'work_review',
  'competitions',
  'lesson_mode',
  'other',
]

export const INTEREST_OTHER_MAX = 300

const SOURCES = ['landing', 'licenses', 'rs-desktop', 'rs-web']

/** Where the survey was opened, from ?from= (landing, rs-desktop, …); "licenses" by default. */
export function interestSource(search) {
  const from = new URLSearchParams(search || '').get('from') || ''
  return SOURCES.includes(from) ? from : 'licenses'
}
