import { freeStorageBytes, maxFileSizeMb, precheckUpload } from '../fileChecks'

import { formatFileSize } from '@/helpers/tariffs'

const MB = 1024 * 1024
const free = { maxFileSizeMb: 10, maxProjectSizeMb: 10, storageQuotaMb: 100, usedBytes: 95 * MB }
const file = (name, size) => ({ name, size })

describe('MyFiles prechecks', () => {
  it('uses maxFileSizeMb, falling back to the project limit', () => {
    expect(maxFileSizeMb({ maxFileSizeMb: 50, maxProjectSizeMb: 10 })).toBe(50)
    expect(maxFileSizeMb({ maxProjectSizeMb: 10 })).toBe(10)
    expect(maxFileSizeMb(null)).toBe(0)
  })

  it('computes free space, or null without a quota', () => {
    expect(freeStorageBytes(free)).toBe(5 * MB)
    expect(freeStorageBytes({ storageQuotaMb: 1, usedBytes: 2 * MB })).toBe(0)
    expect(freeStorageBytes({})).toBeNull()
  })

  it('stops a wrong type, an oversized file and a file that does not fit', () => {
    expect(precheckUpload(file('x.html', 1), free)).toEqual({ reason: 'type' })
    expect(precheckUpload(file('x.pdf', 11 * MB), free)).toEqual({ reason: 'size', limitMb: 10 })
    expect(precheckUpload(file('x.pdf', 6 * MB), free)).toEqual({
      reason: 'quota',
      freeBytes: 5 * MB,
    })
    expect(precheckUpload(file('x.pdf', 4 * MB), free)).toBeNull()
  })

  it('lets the backend decide when entitlements are unknown', () => {
    expect(precheckUpload(file('x.pdf', 500 * MB), null)).toBeNull()
  })
})

describe('formatFileSize', () => {
  const intl = {
    formatNumber: (v, opts) => Number(v.toFixed(opts?.maximumFractionDigits ?? 0)).toString(),
    formatMessage: ({ id }, { value }) => `${value} ${id}`,
  }

  it('shows KB below a megabyte and MB/GB above', () => {
    expect(formatFileSize(intl, 0)).toBe('0 units.kb')
    expect(formatFileSize(intl, 20)).toBe('0.1 units.kb')
    expect(formatFileSize(intl, 300 * 1024)).toBe('300 units.kb')
    expect(formatFileSize(intl, 3 * MB)).toBe('3 units.mb')
    expect(formatFileSize(intl, 2048 * MB)).toBe('2 units.gb')
  })
})
