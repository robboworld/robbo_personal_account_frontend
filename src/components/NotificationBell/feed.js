// Helpers of the bell's feed: day groups, which icon a row gets, where a click leads.

/** Open edX notifications (feedKind "lms") lead to LMS pages: a full page load, not a route. */
export const isExternalUrl = url => /^https?:\/\//i.test(url || '')

export const isUnread = row => !row.readAt

const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

/** Rows (already newest first) in day groups: [{ key, date, items }]. */
export function groupByDay(items) {
  const groups = []
  items.forEach(row => {
    const date = new Date(row.createdAt)
    const day = Number.isNaN(date.getTime()) ? null : startOfDay(date)
    const key = day ? day.toISOString() : 'unknown'
    const last = groups[groups.length - 1]
    if (last && last.key === key) {
      last.items.push(row)
    } else {
      groups.push({ key, date: day, items: [row] })
    }
  })
  return groups
}

/** «Сегодня», «Вчера» or «23 октября» (with the year when it is not this one). */
export function dayLabel(date, intl, now = new Date()) {
  if (!date) return ''
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000)
  if (diff === 0) return intl.formatMessage({ id: 'notifications.today' })
  if (diff === 1) return intl.formatMessage({ id: 'notifications.yesterday' })
  const options = { day: 'numeric', month: 'long' }
  if (date.getFullYear() !== now.getFullYear()) options.year = 'numeric'
  return intl.formatDate(date, options)
}

// Open edX notification types (row.kind of feedKind "lms") → icon; the same groups as the LMS bell.
const LMS_ICONS = {
  course_updates: 'update',
  ora_staff_notifications: 'review',
  ora_grade_assigned: 'graded',
  learner_grade_changed: 'graded',
  content_reported: 'report',
  learner_deadline_soon: 'deadline',
  learner_missed_deadline: 'missed',
  submission_review_overdue: 'waiting',
  learner_section_released: 'section',
  learner_certificate_issued: 'certificate',
  learner_added_to_course: 'course',
  learner_enrolled: 'learnerIn',
  learner_unenrolled: 'learnerOut',
  learner_low_score: 'lowScore',
  learner_inactive: 'inactive',
  course_weekly_report: 'report_week',
  course_published_by_coauthor: 'studio',
  course_import_export: 'studio',
  added_to_course_team: 'team',
}

/** Which icon a row gets: by the Open edX type for LMS rows, by the sender for LK ones. */
export function iconKind(row) {
  if (row.feedKind === 'lms') {
    if (LMS_ICONS[row.kind]) return LMS_ICONS[row.kind]
    if ((row.kind || '').startsWith('learner_')) return 'learner'
    return 'discussion'
  }
  if (row.feedKind === 'announcement') return 'announcement'
  if (row.source === 'teacher') return 'teacher'
  if (row.source === 'system') return 'system'
  return 'admin'
}

/** The small line above the text: the LMS type («Задание проверено») or who wrote. */
export function kindLabelId(row) {
  if (row.feedKind === 'announcement') return 'notifications.kind_announcement'
  if (row.source === 'system') return 'notifications.kind_system'
  if (row.source === 'lms') return 'notifications.kind_lms'
  if (row.source === 'teacher') return 'notifications.kind_teacher'
  return 'notifications.kind_admin'
}
