import { OnChangeFn } from '@tanstack/react-table'

export function createChangeHandler<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  externalOnChange?: (value: T) => void,
): OnChangeFn<T> {
  return (updaterOrValue) => {
    let resolvedNext: T
    setState((current) => {
      resolvedNext =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (old: T) => T)(current)
          : updaterOrValue
      return resolvedNext
    })
    externalOnChange?.(resolvedNext!)
  }
}
