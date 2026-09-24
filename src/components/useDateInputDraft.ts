import { isSameDay } from 'date-fns'
import * as React from 'react'
import { formatDateInput, parseDateInput } from '@/lib/dateInput'

/**
 * Drives a date text field: shows the committed date, keeps the typed text while editing, and
 * commits it on Enter or blur. onCommit only fires when the day changes or the field is cleared;
 * unparseable text is dropped, which reverts the field.
 */
export const useDateInputDraft = (
  date: Date | undefined,
  onCommit: (date: Date | undefined) => void,
) => {
  // The typed text while the field is being edited; null shows the committed date.
  const [draft, setDraft] = React.useState<string | null>(null)

  const isInvalid = draft !== null && draft.trim() !== '' && !parseDateInput(draft)

  const commit = () => {
    if (draft === null) return
    setDraft(null)
    if (draft.trim() === '') {
      if (date) onCommit(undefined)
      return
    }
    const parsed = parseDateInput(draft)
    if (parsed && !(date && isSameDay(parsed, date))) onCommit(parsed)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (draft === null) return
    if (event.key === 'Enter') {
      // Commit instead of submitting the surrounding form with the stale value.
      event.preventDefault()
      commit()
    } else if (event.key === 'Escape') {
      setDraft(null)
    }
  }

  return {
    reset: () => setDraft(null),
    inputProps: {
      value: draft ?? formatDateInput(date),
      'aria-invalid': isInvalid,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
      onBlur: commit,
      onKeyDown,
    },
  }
}
