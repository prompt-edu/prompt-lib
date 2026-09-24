import { describe, expect, it } from 'vitest'
import { applyTime, formatDateInput, formatTimeInput, parseDateInput } from './dateInput'

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

  it.each(['', '24:00', '12:60', '12', '12:5', 'noon'])('rejects %j', (time) => {
    expect(applyTime(day(2026, 9, 24), time)).toBeUndefined()
  })
})

describe('formatTimeInput', () => {
  it('formats as zero-padded 24h time', () => {
    expect(formatTimeInput(new Date(2026, 8, 24, 7, 5))).toBe('07:05')
  })
})
