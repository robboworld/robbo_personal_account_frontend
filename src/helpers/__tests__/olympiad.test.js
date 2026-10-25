import { currentOlympiadStage } from '../olympiad'

const timeline = [{ end: '2026-02-28' }, { end: '2026-06-30' }, { end: '2026-09-30' }]

describe('currentOlympiadStage', () => {
  it('picks the stage whose end is today or later', () => {
    expect(currentOlympiadStage(timeline, new Date('2026-01-10T12:00:00Z'))).toBe(0)
    expect(currentOlympiadStage(timeline, new Date('2026-06-30T12:00:00Z'))).toBe(1)
    expect(currentOlympiadStage(timeline, new Date('2026-08-15T12:00:00Z'))).toBe(2)
  })

  it('reports a finished season', () => {
    expect(currentOlympiadStage(timeline, new Date('2026-10-25T12:00:00Z'))).toBe(-1)
  })
})
