import {
  Column,
  Table,
  ColumnDef,
  ColumnFiltersState,
  InitialTableState,
  SortingState,
} from '@tanstack/react-table'

export interface TableProps<T extends WithId> {
  data: T[]
  actions?: RowAction<T>[]
  columns?: ColumnDef<T>[]
  filters?: TableFilter[]
  onRowClick?: (rowData: T) => void
  initialState?: InitialTableState
  onSortingChange?: (sorting: SortingState) => void
  onSearchChange?: (search: string) => void
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void
  pageSize?: number
}

export interface WithId {
  id: string
}

export interface RowAction<Type extends WithId> {
  label: string
  icon?: React.ReactNode
  onAction: (rows: Type[]) => void | Promise<void>
  confirm?: {
    title?: string
    description: string | ((count: number) => string)
    confirmLabel?: string
    variant?: 'default' | 'destructive'
  }
  disabled?: (rows: Type[]) => boolean
  hide?: (rows: Type[]) => boolean
}

type TableFilterBase = {
  id: string
  label: string
  badge?: {
    label: string
    displayValue: (filtervalue: unknown) => string
  }
}

export type TableFilter =
  | (TableFilterBase & {
      type: 'select'
      options: string[]
      optionLabel?: (value: string) => React.ReactNode
    })
  | (TableFilterBase & {
      type: 'numericRange'
      noValueLabel?: string
    })
  | (TableFilterBase & {
      type: 'custom'
      render: (args: { column: Column<any, unknown>; table: Table<any> }) => React.ReactNode
    })
