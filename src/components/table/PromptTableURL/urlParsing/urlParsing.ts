import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { TableFilter } from '../../PromptTable/PromptTableTypes'

export function parseSortingFromUrl(search: string, paramName: string): SortingState {
  const serializedSorting = new URLSearchParams(search).get(paramName)
  if (!serializedSorting) return []

  return serializedSorting
    .split(',')
    .map((segment) => {
      const [encodedId, order = 'asc'] = segment.split(':')
      if (!encodedId) return null
      if (order !== 'asc' && order !== 'desc') return null

      let id: string
      try {
        id = decodeURIComponent(encodedId)
      } catch {
        return null
      }

      if (!id) return null

      return {
        id,
        desc: order === 'desc',
      }
    })
    .filter((entry): entry is SortingState[number] => entry !== null)
}

export function serializeSortingForUrl(sorting: SortingState): string | null {
  if (sorting.length === 0) return null

  return sorting
    .map(({ id, desc }) => `${encodeURIComponent(id)}:${desc ? 'desc' : 'asc'}`)
    .join(',')
}

export function parseColumnFiltersFromUrl(
  search: string,
  paramName: string,
  tableFilters?: TableFilter[],
): ColumnFiltersState {
  const serializedFilters = new URLSearchParams(search).get(paramName)
  if (!serializedFilters) return []

  try {
    const parsed = JSON.parse(serializedFilters)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((filter) => {
        if (!filter || typeof filter !== 'object') return null
        if (!('id' in filter) || typeof filter.id !== 'string') return null
        if (!('value' in filter)) return null
        if (!isValidFilterValue(filter.id, filter.value, tableFilters)) return null

        return {
          id: filter.id,
          value: filter.value,
        }
      })
      .filter((entry): entry is ColumnFiltersState[number] => entry !== null)
  } catch {
    return []
  }
}

export function serializeColumnFiltersForUrl(columnFilters: ColumnFiltersState): string | null {
  if (columnFilters.length === 0) return null
  return JSON.stringify(columnFilters)
}

export function parseSearchFromUrl(search: string, paramName: string): string | null {
  return new URLSearchParams(search).get(paramName)
}

function isValidFilterValue(
  id: string,
  value: unknown,
  tableFilters?: TableFilter[],
): value is ColumnFiltersState[number]['value'] {
  if (value === null || value === undefined) return false

  const tableFilter = tableFilters?.find((filter) => filter.id === id)
  if (!tableFilter) return isJsonCompatibleFilterValue(value)

  if (tableFilter.type === 'select') {
    return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  }

  if (tableFilter.type === 'numericRange') {
    if (!isPlainObject(value)) return false

    const allowedKeys = new Set(['min', 'max', 'noScore'])
    for (const key of Object.keys(value)) {
      if (!allowedKeys.has(key)) return false
    }

    const min = value.min
    const max = value.max
    const noScore = value.noScore

    if (min !== undefined && typeof min !== 'string') return false
    if (max !== undefined && typeof max !== 'string') return false
    if (noScore !== undefined && typeof noScore !== 'boolean') return false

    return true
  }

  return isJsonCompatibleFilterValue(value)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isJsonCompatibleFilterValue(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true
  }
  if (Array.isArray(value)) {
    return value.every((entry) => isJsonCompatibleFilterValue(entry))
  }
  if (isPlainObject(value)) {
    return Object.values(value).every((entry) => isJsonCompatibleFilterValue(entry))
  }
  return false
}
