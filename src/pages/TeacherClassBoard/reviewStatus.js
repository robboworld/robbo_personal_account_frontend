// Review states of a homework project (backend models.Review*), shared by teacher and student pages.
export const REVIEW_STATUS_COLOR = {
  draft: 'default',
  submitted: 'processing',
  returned: 'warning',
  accepted: 'success',
  shown_in_class: 'cyan',
  missing: 'error',
  empty: 'default',
}

export const reviewStatusLabel = (intl, status) => {
  const key = REVIEW_STATUS_COLOR[status] ? status : 'missing'
  return intl.formatMessage({ id: `review_status.${key}` })
}

/** Submitted or already reviewed: the student has handed the work in. */
export const isHandedIn = status =>
  ['submitted', 'accepted', 'returned', 'shown_in_class'].includes(status)
