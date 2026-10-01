import { withoutLegacyAdminItems } from '@/helpers/legacyAdminSection'
import { CLIENTS_ROUTE, MY_LICENSES_ROUTE, ROBBO_UNITS_ROUTE } from '@/constants'

const items = [
  { key: 'licenses', pathname: MY_LICENSES_ROUTE },
  { key: 'clients', pathname: CLIENTS_ROUTE },
  { key: 'group', children: [{ key: 'units', pathname: ROBBO_UNITS_ROUTE }, { key: 'lic2', pathname: MY_LICENSES_ROUTE }] },
]

describe('withoutLegacyAdminItems', () => {
  it('hides legacy database pages, also inside groups', () => {
    const out = withoutLegacyAdminItems(items, false)
    expect(out.map(i => i.key)).toEqual(['licenses', 'group'])
    expect(out[1].children.map(i => i.key)).toEqual(['lic2'])
  })

  it('keeps everything when the legacy database is on', () => {
    expect(withoutLegacyAdminItems(items, true)).toBe(items)
  })
})
