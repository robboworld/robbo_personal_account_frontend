import {
  DEFAULT_TARIFFS,
  devicesSessionsLine,
  formatStorageMb,
  tariffsFromCatalog,
} from '../tariffs'

jest.mock('@/api/payments', () => ({ listCatalog: jest.fn() }))

describe('tariffsFromCatalog', () => {
  it('keeps the defaults without a catalog', () => {
    expect(tariffsFromCatalog(null)).toEqual(DEFAULT_TARIFFS)
  })

  it('takes Free limits and products by SKU from the API', () => {
    const tariffs = tariffsFromCatalog({
      free: { maxProjectSizeMb: 12, sessionLimit: 3, seatLimit: 1 },
      products: [
        {
          sku: 'rs3-class-1y',
          cloudQuotaMb: 50,
          storageQuotaMb: 5120,
          sessionLimit: 30,
          seatLimit: 30,
          amount: 4990,
          durationDays: 365,
        },
        { sku: 'unknown', cloudQuotaMb: 1 },
      ],
    })
    expect(tariffs.free).toMatchObject({ maxProjectSizeMb: 12, sessionLimit: 3 })
    expect(tariffs.free.storageQuotaMb).toBe(DEFAULT_TARIFFS.free.storageQuotaMb)
    expect(tariffs.class).toMatchObject({
      seatLimit: 30,
      sessionLimit: 30,
      storageQuotaMb: 5120,
    })
    expect(tariffs.individual).toEqual(DEFAULT_TARIFFS.individual)
  })
})

describe('formatStorageMb', () => {
  const intl = {
    formatNumber: (n, opts) =>
      String(Math.round(n * 10 ** opts.maximumFractionDigits) / 10 ** opts.maximumFractionDigits),
    formatMessage: ({ id }, { value }) => `${value} ${id === 'units.gb' ? 'GB' : 'MB'}`,
  }

  it('switches to GB from 1024 MB', () => {
    expect(formatStorageMb(intl, 100)).toBe('100 MB')
    expect(formatStorageMb(intl, 1024)).toBe('1 GB')
    expect(formatStorageMb(intl, 5120)).toBe('5 GB')
    expect(formatStorageMb(intl, 1536)).toBe('1.5 GB')
    expect(formatStorageMb(intl, 0.25)).toBe('0.3 MB')
  })
})

describe('devicesSessionsLine', () => {
  const intl = { formatMessage: ({ id }, values) => `${id}:${JSON.stringify(values)}` }

  it('shows only sign-ins for Free, which has no device seats', () => {
    expect(devicesSessionsLine(intl, DEFAULT_TARIFFS.free)).toBe(
      'tariff.sessions_only:{"sessions":5}',
    )
    expect(devicesSessionsLine(intl, DEFAULT_TARIFFS.class)).toBe(
      'tariff.devices_sessions:{"devices":30,"sessions":30}',
    )
  })
})
