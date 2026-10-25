import { DEFAULT_TARIFFS, tariffsFromCatalog } from '../tariffs'

jest.mock('@/api/payments', () => ({ listCatalog: jest.fn() }))

describe('tariffsFromCatalog', () => {
  it('keeps the defaults without a catalog', () => {
    expect(tariffsFromCatalog(null)).toEqual(DEFAULT_TARIFFS)
  })

  it('takes Free limits and products by SKU from the API', () => {
    const tariffs = tariffsFromCatalog({
      free: { maxProjectSizeMb: 12, maxProjects: 30, sessionLimit: 3, seatLimit: 1 },
      products: [
        { sku: 'rs3-class-1y', cloudQuotaMb: 500, sessionLimit: 20, seatLimit: 20, amount: 4990, durationDays: 365 },
        { sku: 'unknown', cloudQuotaMb: 1 },
      ],
    })
    expect(tariffs.free).toMatchObject({ maxProjectSizeMb: 12, maxProjects: 30, sessionLimit: 3 })
    expect(tariffs.class).toMatchObject({ seatLimit: 20, sessionLimit: 20, maxProjects: 0 })
    expect(tariffs.individual).toEqual(DEFAULT_TARIFFS.individual)
  })
})
