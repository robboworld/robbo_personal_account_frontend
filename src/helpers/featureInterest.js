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
export const INTEREST_PAIN_MAX = 1000
export const INTEREST_ORG_MAX = 120

const SOURCES = ['landing', 'licenses', 'home', 'rs-desktop', 'rs-web']

/** Where the survey was opened, from ?from= (landing, rs-desktop, …); "licenses" by default. */
export function interestSource(search) {
  const from = new URLSearchParams(search || '').get('from') || ''
  return SOURCES.includes(from) ? from : 'licenses'
}

const INVITE_DISMISSED_KEY = 'lk_interest_invite_dismissed'

/** The home-page invitation to the survey was closed with "Not now" in this browser. */
export function isInterestInviteDismissed() {
  try {
    return window.localStorage.getItem(INVITE_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function dismissInterestInvite() {
  try {
    window.localStorage.setItem(INVITE_DISMISSED_KEY, '1')
  } catch {
    // Storage blocked: the invitation just shows again next time.
  }
}
