import { dayLabel, groupByDay, iconKind, isExternalUrl, kindLabelId } from '../feed'

const intl = {
  formatMessage: ({ id }) =>
    ({ 'notifications.today': 'Сегодня', 'notifications.yesterday': 'Вчера' })[id],
  formatDate: (date, options) =>
    `${date.getDate()}.${date.getMonth() + 1}${options.year ? '.' + date.getFullYear() : ''}`,
}

describe('notification feed helpers', () => {
  it('groups rows by day in their order', () => {
    const groups = groupByDay([
      { id: 'a', createdAt: '2026-10-27T15:00:00' },
      { id: 'b', createdAt: '2026-10-27T09:00:00' },
      { id: 'c', createdAt: '2026-10-26T20:00:00' },
    ])
    expect(groups.map(group => group.items.map(row => row.id).join(''))).toEqual(['ab', 'c'])
  })

  it('names days: today, yesterday, a date, a date of another year', () => {
    const now = new Date(2026, 9, 27, 12)
    expect(dayLabel(new Date(2026, 9, 27), intl, now)).toBe('Сегодня')
    expect(dayLabel(new Date(2026, 9, 26), intl, now)).toBe('Вчера')
    expect(dayLabel(new Date(2026, 9, 20), intl, now)).toBe('20.10')
    expect(dayLabel(new Date(2025, 9, 20), intl, now)).toBe('20.10.2025')
  })

  it('picks icons and labels by LMS type or sender', () => {
    expect(iconKind({ feedKind: 'lms', kind: 'ora_grade_assigned' })).toBe('graded')
    expect(iconKind({ feedKind: 'lms', kind: 'learner_test_completed' })).toBe('learner')
    expect(iconKind({ feedKind: 'lms', kind: 'new_response' })).toBe('discussion')
    expect(iconKind({ feedKind: 'personal', source: 'teacher' })).toBe('teacher')
    expect(iconKind({ feedKind: 'announcement' })).toBe('announcement')
    expect(kindLabelId({ feedKind: 'personal', source: 'admin' })).toBe('notifications.kind_admin')
  })

  it('treats only absolute http(s) links as external', () => {
    expect(isExternalUrl('http://local.openedx.io/x')).toBe(true)
    expect(isExternalUrl('/projects/1')).toBe(false)
    expect(isExternalUrl(null)).toBe(false)
  })
})
