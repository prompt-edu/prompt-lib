import { describe, expect, it } from 'vitest'
import {
  applyTime,
  formatDateInput,
  formatTimeInput,
  parseDateInput,
  parseTimeInput,
  resolveTypedRange,
} from './dateInput'

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date)

describe('parseDateInput', () => {
  it.each([
    ['24.09.2026', day(2026, 9, 24)],
    ['24.9.2026', day(2026, 9, 24)],
    ['4.9.2026', day(2026, 9, 4)],
    ['24/09/2026', day(2026, 9, 24)],
    ['2026-09-24', day(2026, 9, 24)],
    ['2026-9-4', day(2026, 9, 4)],
    ['  24.09.2026  ', day(2026, 9, 24)],
    ['29.02.2028', day(2028, 2, 29)],
  ])('parses %j', (text, expected) => {
    expect(parseDateInput(text)).toEqual(expected)
  })

  it.each([
    '',
    '24.09.26',
    '24.09.2',
    '24.09/2026',
    '24-09-2026',
    '31.02.2026',
    '29.02.2027',
    '00.09.2026',
    '24.13.2026',
    '2026-13-01',
    'tomorrow',
    '24.09.2026 12:00',
  ])('rejects %j', (text) => {
    expect(parseDateInput(text)).toBeUndefined()
  })
})

describe('formatDateInput', () => {
  it('pads day and month', () => {
    expect(formatDateInput(day(2026, 9, 4))).toBe('04.09.2026')
  })

  it('returns an empty string without a date', () => {
    expect(formatDateInput(undefined)).toBe('')
  })

  it('round-trips through parseDateInput', () => {
    const date = day(2026, 12, 31)
    expect(parseDateInput(formatDateInput(date))).toEqual(date)
  })
})

describe('parseTimeInput', () => {
  it.each([
    ['00:00', { hours: 0, minutes: 0 }],
    ['9:05', { hours: 9, minutes: 5 }],
    ['23:59', { hours: 23, minutes: 59 }],
  ])('parses %j', (time, expected) => {
    expect(parseTimeInput(time)).toEqual(expected)
  })

  it.each(['', '24:00', '12:60', '12', '12:5', 'noon'])('rejects %j', (time) => {
    expect(parseTimeInput(time)).toBeUndefined()
  })
})

describe('applyTime', () => {
  it('sets hours and minutes and clears seconds', () => {
    const date = new Date(2026, 8, 24, 8, 15, 42, 500)
    expect(applyTime(date, '14:30')).toEqual(new Date(2026, 8, 24, 14, 30, 0, 0))
  })

  it('does not mutate the given date', () => {
    const date = day(2026, 9, 24)
    applyTime(date, '23:59')
    expect(date).toEqual(day(2026, 9, 24))
  })

  it('rejects an invalid time', () => {
    expect(applyTime(day(2026, 9, 24), '24:00')).toBeUndefined()
  })
})

describe('formatTimeInput', () => {
  it('formats as zero-padded 24h time', () => {
    expect(formatTimeInput(new Date(2026, 8, 24, 7, 5))).toBe('07:05')
  })
})

describe('resolveTypedRange', () => {
  const oct1 = day(2026, 10, 1)
  const oct31 = day(2026, 10, 31)
  const dec1 = day(2026, 12, 1)

  it('keeps an ordered range', () => {
    expect(resolveTypedRange('to', oct1, oct31)).toEqual({
      range: { from: oct1, to: oct31 },
      pendingEnd: undefined,
    })
  })

  it('keeps a start without an end', () => {
    expect(resolveTypedRange('from', oct1, undefined)).toEqual({
      range: { from: oct1, to: undefined },
      pendingEnd: undefined,
    })
  })

  it('selects no range for an end without a start and keeps the end pending', () => {
    expect(resolveTypedRange('to', undefined, oct31)).toEqual({
      range: undefined,
      pendingEnd: oct31,
    })
  })

  it('keeps the end pending when the start is cleared', () => {
    expect(resolveTypedRange('from', undefined, oct31)).toEqual({
      range: undefined,
      pendingEnd: oct31,
    })
  })

  it('selects no range when both are cleared', () => {
    expect(resolveTypedRange('to', undefined, undefined)).toEqual({
      range: undefined,
      pendingEnd: undefined,
    })
  })

  it('clears the end when a start is typed after it', () => {
    expect(resolveTypedRange('from', dec1, oct31)).toEqual({
      range: { from: dec1, to: undefined },
      pendingEnd: undefined,
    })
  })

  it('swaps an end typed before the start', () => {
    expect(resolveTypedRange('to', oct31, oct1)).toEqual({
      range: { from: oct1, to: oct31 },
      pendingEnd: undefined,
    })
  })

  it('completes a pending end once a start before it is typed', () => {
    expect(resolveTypedRange('from', oct1, oct31)).toEqual({
      range: { from: oct1, to: oct31 },
      pendingEnd: undefined,
    })
  })

  it('keeps a range on a single day', () => {
    expect(resolveTypedRange('from', oct1, oct1)).toEqual({
      range: { from: oct1, to: oct1 },
      pendingEnd: undefined,
    })
  })
})
