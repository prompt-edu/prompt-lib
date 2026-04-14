import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ReactElement, useState } from 'react'
import { Table } from '../../ui'
import { checkboxColumn } from './columns/columnDefs/selectColumn'
import { actionColumn } from './columns/columnDefs/actionColumn'
import { TableSearch } from './tableBarComponents/TableSearch'
import { TableActionsButton } from './tableBarComponents/TableActionsButton'
import { TableInfoText } from './tableBarComponents/TableInfoText'
import { TablePagination } from './tableBarComponents/TablePagination'
import { TableHeaders } from './tableComponents/TableHeaders'
import { TableRows } from './tableComponents/TableRows'
import { WithId } from './PromptTableTypes'
import { generateColumns } from './columns/generateColumns'
import { addFiltersToColumns } from './filters/applyFiltersToColumns'
import { TableProps } from './PromptTableTypes'
import { createChangeHandler } from './util/createChangeHandler'

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
  pageSize: initialPageSize = 20,
}: TableProps<T>): ReactElement {
  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting ?? [])
  const [search, setSearch] = useState<string>(
    typeof initialState?.globalFilter === 'string' ? initialState.globalFilter : '',
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  )
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  const baseColumns = columns ?? generateColumns(data)
  const columnsWithFilterFns = addFiltersToColumns(baseColumns, filters)
  const cols: ColumnDef<T>[] = [
    checkboxColumn<T>(),
    ...columnsWithFilterFns,
    ...(actions ? [actionColumn<T>(actions)] : []),
  ]
  const handleSortingChange = createChangeHandler(setSorting, onSortingChange)
  const handleSearchChange = createChangeHandler(setSearch, onSearchChange)
  const handleColumnFiltersChange = createChangeHandler(setColumnFilters, onColumnFiltersChange)

  const table = useReactTable({
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
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: handleSearchChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: true,
    enableRowSelection: true,
    getRowId: (row) => row.id!,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='flex flex-col gap-3 w-full'>
      <div className='flex items-center gap-2 justify-between'>
        <TableSearch value={search} onChange={handleSearchChange} table={table} filters={filters} />
        {actions && <TableActionsButton table={table} actions={actions} />}
      </div>

      <TableInfoText table={table} filters={filters} />

      <div className='rounded-md border overflow-x-auto w-full'>
        <Table className='table-auto w-full relative'>
          <TableHeaders table={table} />
          <TableRows table={table} onRowClick={onRowClick} />
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  )
}
