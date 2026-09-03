import type { ColumnFiltersState, RowData, SortingState } from '@tanstack/react-table'
import type {
  PromptTableColumn,
  PromptTableColumnDef,
  PromptTableCore,
  PromptTableInitialState,
} from './tableFeatures'

export interface TableProps<T extends WithId> {
  data: T[]
  actions?: RowAction<T>[]
  columns?: PromptTableColumnDef<T, any>[]
  filters?: TableFilter<T>[]
  onRowClick?: (rowData: T) => void
  initialState?: PromptTableInitialState
  onSortingChange?: (sorting: SortingState) => void
  onSearchChange?: (search: string) => void
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void
  /** Rows per client-side page. Ignored when pagination is server-driven. */
  pageSize?: number
  /**
   * Concerns the consumer handles server-side. `true` is shorthand for all of them; by default
   * the table owns every one of them. Pass this when `data` is a single server page, so the
   * table stops applying its own version of a concern to that page and drops the control that
   * would read as if it applied to the whole data set.
   */
  serverDriven?: boolean | ServerDrivenFeatures
}

export interface ServerDrivenFeatures {
  /** Drops the built-in search box and stops the global filter from narrowing `data`. */
  search?: boolean
  /** Renders plain column headers and stops the table from reordering `data`. */
  sorting?: boolean
  /** Drops the pagination bar and renders every row in `data` as one page. */
  pagination?: boolean
}

export interface WithId {
  id: string
}

export interface RowAction<Type extends WithId> {
  label: string
  icon?: React.ReactNode
  onAction: (rows: Type[], inputValue?: string) => void | Promise<void>
  confirm?: {
    title?: string
    description: string | ((count: number) => string)
    confirmLabel?: string
    variant?: 'default' | 'destructive'
    input?: {
      label: string
      placeholder?: string
      defaultValue?: string
    }
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

export type TableFilter<TData extends RowData = any> =
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
      render: (args: {
        column: PromptTableColumn<TData>
        table: PromptTableCore<TData>
      }) => React.ReactNode
    })
