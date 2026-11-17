import { describe, expect, it } from 'vitest'
import { getScoreSummary } from './scoreStatistics'

describe('getScoreSummary', () => {
  it('returns nothing for an empty list', () => {
    expect(getScoreSummary([])).toBeUndefined()
  })

  it('ignores values that are not finite numbers', () => {
    expect(getScoreSummary([Number.NaN, Number.POSITIVE_INFINITY])).toBeUndefined()
    expect(getScoreSummary([2, Number.NaN])?.count).toBe(1)
  })

  it('computes count, average, and median', () => {
    expect(getScoreSummary([4, 1, 3])).toMatchObject({ count: 3, average: 8 / 3, median: 3 })
    expect(getScoreSummary([4, 1, 3, 2])).toMatchObject({ count: 4, average: 2.5, median: 2.5 })
  })

  it('shows one bar per value when there are few distinct values', () => {
    expect(getScoreSummary([1.3, 1, 1.3, 2.7])?.bins).toEqual([
      { shortLabel: '1', label: '1', count: 1 },
      { shortLabel: '1.3', label: '1.3', count: 2 },
      { shortLabel: '2.7', label: '2.7', count: 1 },
    ])
  })

  it('bins a few values that spread over a wide range', () => {
    expect(getScoreSummary([47, 61, 70, 78, 85, 92])?.bins).toEqual([
      { shortLabel: '45', label: '45 to 50', count: 1 },
      { shortLabel: '50', label: '50 to 55', count: 0 },
      { shortLabel: '55', label: '55 to 60', count: 0 },
      { shortLabel: '60', label: '60 to 65', count: 1 },
      { shortLabel: '65', label: '65 to 70', count: 0 },
      { shortLabel: '70', label: '70 to 75', count: 1 },
      { shortLabel: '75', label: '75 to 80', count: 1 },
      { shortLabel: '80', label: '80 to 85', count: 0 },
      { shortLabel: '85', label: '85 to 90', count: 1 },
      { shortLabel: '90', label: '90 to 95', count: 1 },
    ])
  })

  it('bins many distinct values into even ranges and keeps the maximum in the last bin', () => {
    const scores = [23, 31, 38, 44, 45, 52, 58, 61, 67, 73, 79, 88, 100]

    expect(getScoreSummary(scores)?.bins).toEqual([
      { shortLabel: '20', label: '20 to 30', count: 1 },
      { shortLabel: '30', label: '30 to 40', count: 2 },
      { shortLabel: '40', label: '40 to 50', count: 2 },
      { shortLabel: '50', label: '50 to 60', count: 2 },
      { shortLabel: '60', label: '60 to 70', count: 2 },
      { shortLabel: '70', label: '70 to 80', count: 2 },
      { shortLabel: '80', label: '80 to 90', count: 1 },
      { shortLabel: '90', label: '90 to 100', count: 1 },
    ])
  })

  it('uses fractional bin widths for small ranges', () => {
    const scores = Array.from({ length: 13 }, (_, i) => 1 + i * 0.1)

    const bins = getScoreSummary(scores)?.bins ?? []

    expect(bins[0].label).toBe('1 to 1.2')
    expect(bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(13)
  })
})
