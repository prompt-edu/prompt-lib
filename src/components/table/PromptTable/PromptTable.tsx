import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from '@tanstack/react-table'
import { type ReactElement, useState } from 'react'
import { Table } from '../../ui'
import { actionColumn } from './columns/columnDefs/actionColumn'
import { checkboxColumn } from './columns/columnDefs/selectColumn'
import { generateColumns } from './columns/generateColumns'
import { addFiltersToColumns } from './filters/applyFiltersToColumns'
import { TableFiltersMenu } from './filters/TableFiltersMenu'
import type { TableProps, WithId } from './PromptTableTypes'
import { TableActionsButton } from './tableBarComponents/TableActionsButton'
import { TableInfoText } from './tableBarComponents/TableInfoText'
import { TablePagination } from './tableBarComponents/TablePagination'
import { TableSearch } from './tableBarComponents/TableSearch'
import { TableHeaders } from './tableComponents/TableHeaders'
import { TableRows } from './tableComponents/TableRows'
import { type PromptTableColumnDef, promptTableFeatures } from './tableFeatures'
import { resolveServerDriven } from './util/resolveServerDriven'
import { useNotifyOnChange } from './util/useNotifyOnChange'

export function PromptTable<T extends WithId>({
  data,
  actions,
  columns,
  filters,
  onRowClick,
  initialState,
  onSortingChange,
  onSearchChange,
  onColumnFiltersChange,
  pageSize: initialPageSize = 100,
  serverDriven,
}: TableProps<T>): ReactElement {
  const server = resolveServerDriven(serverDriven)

  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting ?? [])
  const [search, setSearch] = useState<string>(
    !server.search && typeof initialState?.globalFilter === 'string'
      ? initialState.globalFilter
      : '',
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  useNotifyOnChange(sorting, onSortingChange)
  useNotifyOnChange(search, onSearchChange)
  useNotifyOnChange(columnFilters, onColumnFiltersChange)

  const baseColumns = columns ?? generateColumns(data)
  const columnsWithFilterFns = addFiltersToColumns(baseColumns, filters)
  const cols: PromptTableColumnDef<T, any>[] = [
    checkboxColumn<T>(),
    ...columnsWithFilterFns,
    ...(actions ? [actionColumn<T>(actions)] : []),
  ]

  const table = useTable({
    features: promptTableFeatures,
    data: data,
    columns: cols,
    state: {
      sorting,
      globalFilter: search,
      columnFilters,
      rowSelection,
      pagination,
    },
    initialState,
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: true,
    enableRowSelection: true,
    enableSorting: !server.sorting,
    enableGlobalFilter: !server.search,
    manualSorting: server.sorting,
    manualPagination: server.pagination,
    getRowId: (row) => row.id,
  })

  const hasFilters = !!filters?.length
  // The search box hosts the filter menu, so a server-driven search has to show it on its own.
  const standaloneFilters = server.search && filters && filters.length > 0 ? filters : undefined
  const showTableBar = !server.search || !!standaloneFilters || !!actions

  return (
    <div className='flex flex-col gap-3 w-full'>
      {showTableBar && (
        <div className='flex items-center gap-2'>
          {!server.search && (
            <TableSearch value={search} onChange={setSearch} table={table} filters={filters} />
          )}
          {standaloneFilters && <TableFiltersMenu table={table} filters={standaloneFilters} />}
          {actions && (
            <div className='ml-auto'>
              <TableActionsButton table={table} actions={actions} />
            </div>
          )}
        </div>
      )}

      <TableInfoText
        table={table}
        filters={filters}
        showFilterTags={!server.search || hasFilters}
      />

      <div className='rounded-md border overflow-x-auto w-full'>
        <Table className='table-auto w-full relative'>
          <TableHeaders table={table} />
          <TableRows table={table} onRowClick={onRowClick} />
        </Table>
      </div>

      {!server.pagination && <TablePagination table={table} />}
    </div>
  )
}
