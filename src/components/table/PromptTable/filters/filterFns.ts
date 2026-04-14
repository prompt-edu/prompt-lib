import { FilterFn } from '@tanstack/react-table'

export const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true
  }

  const rowValue = row.getValue<string>(columnId)
  return filterValue.includes(rowValue)
}

export const numericRangeFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue: {
    min?: string
    max?: string
    noScore?: boolean
  },
) => {
  const rowValue = row.getValue<number | null | undefined>(columnId)

  if (filterValue?.noScore) {
    return rowValue == null
  }

  if (rowValue == null) return false

  const min = filterValue?.min ? Number(filterValue.min) : undefined
  const max = filterValue?.max ? Number(filterValue.max) : undefined

  if (min !== undefined && isNaN(min)) return false
  if (max !== undefined && isNaN(max)) return false

  if (min !== undefined && rowValue < min) return false
  if (max !== undefined && rowValue > max) return false

  return true
}
