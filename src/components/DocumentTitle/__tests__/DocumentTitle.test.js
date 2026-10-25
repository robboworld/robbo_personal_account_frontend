import { pageTitleId } from '../DocumentTitle'

describe('pageTitleId', () => {
  it('names LK pages, specific routes first', () => {
    expect(pageTitleId('/home')).toBe('sidebar_data.home')
    expect(pageTitleId('/teacher/classes/7696b415')).toBe('sidebar_data.teacher_classes')
    expect(pageTitleId('/licenses/issue')).toBe('sidebar_data.issue_license')
    expect(pageTitleId('/licenses')).toBe('sidebar_data.my_licenses')
  })

  it('leaves unknown pages to the brand title', () => {
    expect(pageTitleId('/nowhere')).toBeNull()
  })
})
