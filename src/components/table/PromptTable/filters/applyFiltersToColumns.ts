import { ColumnDef } from '@tanstack/react-table'
import { TableFilter } from '../PromptTableTypes'
import { multiSelectFilter, numericRangeFilter } from './filterFns'

function isAccessorKeyColumn<T>(
  column: ColumnDef<T>,
): column is ColumnDef<T> & { accessorKey: string } {
  return 'accessorKey' in column
}

export function addFiltersToColumns<T>(
  columns: ColumnDef<T>[],
  filters?: TableFilter[],
): ColumnDef<T>[] {
  if (!filters?.length) return columns

  return columns.map((column) => {
    if (!isAccessorKeyColumn(column)) return column

    const filter = filters.find((f) => f.id === column.accessorKey)
    if (!filter) return column

    if (filter.type === 'select') {
      return { ...column, filterFn: multiSelectFilter }
    }

    if (filter.type === 'numericRange') {
      return { ...column, filterFn: numericRangeFilter }
    }

    return column
  })
}
