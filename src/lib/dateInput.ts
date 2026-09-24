import { format, isAfter } from 'date-fns'
import type { DateRange } from 'react-day-picker'

// Shared by the date pickers' text fields. Not exported from the package: the pickers own the format.

export const DATE_INPUT_PLACEHOLDER = 'dd.mm.yyyy'

// 24.09.2026, 24.9.2026, 24/09/2026 (one separator throughout) or ISO 2026-09-24.
const EUROPEAN_DATE = /^(\d{1,2})([./])(\d{1,2})\2(\d{4})$/
const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
const TIME = /^(\d{1,2}):(\d{2})$/

export const formatDateInput = (date: Date | undefined): string =>
  date ? format(date, 'dd.MM.yyyy') : ''

export const formatTimeInput = (date: Date): string => format(date, 'HH:mm')

/** Parses typed text to a local midnight date, or undefined when it is not a real calendar day. */
export const parseDateInput = (text: string): Date | undefined => {
  const trimmed = text.trim()
  const european = EUROPEAN_DATE.exec(trimmed)
  const iso = ISO_DATE.exec(trimmed)

  let day: number
  let month: number
  let year: number
  if (european) {
    day = Number(european[1])
    month = Number(european[3])
    year = Number(european[4])
  } else if (iso) {
    year = Number(iso[1])
    month = Number(iso[2])
    day = Number(iso[3])
  } else {
    return undefined
  }

  const date = new Date(year, month - 1, day)
  // new Date rolls 31.02 over into March, so a mismatch means the day does not exist.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }
  return date
}

/** Parses an HH:mm time, or returns undefined when it is not a valid time of day. */
export const parseTimeInput = (time: string): { hours: number; minutes: number } | undefined => {
  const match = TIME.exec(time.trim())
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return undefined
  return { hours, minutes }
}

/** Returns a copy of date set to an HH:mm time, or undefined when the time is not valid. */
export const applyTime = (date: Date, time: string): Date | undefined => {
  const parsed = parseTimeInput(time)
  if (!parsed) return undefined

  const result = new Date(date)
  result.setHours(parsed.hours, parsed.minutes, 0, 0)
  return result
}

/**
 * Resolves a range after its start or end field was typed. Like the calendar, it never selects an
 * end without a start: that end comes back as pendingEnd, for the end field to keep showing until a
 * start is typed. A start typed after the end clears the end, as it starts a new range; an end
 * typed before the start swaps the two, so the typed dates stay a range.
 */
export const resolveTypedRange = (
  typed: 'from' | 'to',
  from: Date | undefined,
  to: Date | undefined,
): { range: DateRange | undefined; pendingEnd: Date | undefined } => {
  if (!from) return { range: undefined, pendingEnd: to }
  if (to && isAfter(from, to)) {
    return {
      range: typed === 'from' ? { from, to: undefined } : { from: to, to: from },
      pendingEnd: undefined,
    }
  }
  return { range: { from, to }, pendingEnd: undefined }
}
