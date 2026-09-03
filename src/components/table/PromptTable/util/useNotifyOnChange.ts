import { useEffect, useRef } from 'react'

/**
 * Reports table state to an external callback after it has actually changed.
 *
 * Table state lives in `useState`, so the next value is only known once React has applied the
 * updater. Notifying from an effect is what makes these callbacks safe to hang a server request
 * on: they never fire with a value the table has not committed.
 */
export function useNotifyOnChange<T>(value: T, onChange?: (value: T) => void): void {
  const notifiedValue = useRef(value)

  useEffect(() => {
    if (Object.is(notifiedValue.current, value)) return
    notifiedValue.current = value
    onChange?.(value)
  }, [value, onChange])
}
