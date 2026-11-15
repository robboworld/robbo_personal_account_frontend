import { KID_HIDDEN_NAV_KEYS, KID_LOCKED_NAV_KEYS, isKidAccountEmail } from '@/helpers/kidAccount'
import {
  SidebarDataStudent,
  buildSidebarItems,
  lockForKidAccount,
} from '@/components/SideBar/SideBarData'
import { FULL_ACCOUNT_ROUTE } from '@/constants'

describe('isKidAccountEmail', () => {
  it('knows the address the ЛК gives a teacher-made account', () => {
    expect(isKidAccountEmail('k-abcdefghij@kids.robbo.invalid')).toBe(true)
    expect(isKidAccountEmail(' K-ABC@KIDS.ROBBO.INVALID ')).toBe(true)
  })

  it('leaves a real address alone', () => {
    expect(isKidAccountEmail('parent@example.com')).toBe(false)
    expect(isKidAccountEmail('kid@kids.robbo.invalid.example.com')).toBe(false)
    expect(isKidAccountEmail('')).toBe(false)
    expect(isKidAccountEmail(undefined)).toBe(false)
  })
})

describe('lockForKidAccount', () => {
  const lock = items =>
    lockForKidAccount(items, {
      lockedKeys: KID_LOCKED_NAV_KEYS,
      hiddenKeys: KID_HIDDEN_NAV_KEYS,
      fullAccountPath: FULL_ACCOUNT_ROUTE,
    })

  it('keeps courses and plans in the student menu, locked, on the way to a full account', () => {
    const items = lock(buildSidebarItems(SidebarDataStudent))
    const lms = items.find(item => item.key === 'lms')
    const licenses = items.find(item => item.key === 'my_licenses')

    expect(lms).toMatchObject({ locked: true, pathname: FULL_ACCOUNT_ROUTE })
    expect(lms.external).toBeUndefined()
    expect(licenses).toMatchObject({ locked: true, pathname: FULL_ACCOUNT_ROUTE })
    expect(items.find(item => item.key === 'my_sessions')).toBeUndefined()
    expect(items.find(item => item.key === '2').locked).toBeUndefined()
  })

  it('drops a divider that has nothing after it', () => {
    const items = lock([
      { key: 'home' },
      { type: 'divider', key: 'd1' },
      { key: 'my_sessions' },
      { type: 'divider', key: 'd2' },
      { key: 'my_classes' },
      { type: 'divider', key: 'd3' },
    ])
    expect(items.map(item => item.key)).toEqual(['home', 'd2', 'my_classes'])
  })
})
