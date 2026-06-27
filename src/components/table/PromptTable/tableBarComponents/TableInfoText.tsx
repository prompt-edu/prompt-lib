import { Table as ReactTable } from '@tanstack/react-table'
import { Columns } from 'lucide-react'
import { ReactElement } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui'
import { TableFilter } from '../PromptTableTypes'
import { FilterBadge } from '../filters/FilterBadge'
import { tableFilterTypeDisplayFunction } from '../filters/filterbadgeFns'

interface TableInfoTextProps<TData> {
  table: ReactTable<TData>
  filters?: TableFilter[]
}

export function TableInfoText<TData>({
  table,
  filters = [],
}: TableInfoTextProps<TData>): ReactElement {
  const { globalFilter, columnFilters } = table.getState()
  const selectedCount = table.getSelectedRowModel().rows.length
  const filteredRows = table.getFilteredRowModel().rows
  const canSelectAllFiltered = selectedCount > 0 && selectedCount < filteredRows.length
  const hideableColumns = table.getAllColumns().filter((col) => col.getCanHide())
  const visibleCount = hideableColumns.filter((col) => col.getIsVisible()).length

  const selectAllFiltered = () => {
    const next: Record<string, boolean> = {}
    for (const row of filteredRows) next[row.id] = true
    table.setRowSelection(next)
  }

  const filterMetaById = Object.fromEntries(filters.map((f) => [f.id, f]))

  const hasActiveTags =
    (typeof globalFilter === 'string' && globalFilter.length > 0) || columnFilters.length > 0

  return (
    // min-h matches FilterBadge height so the bar never jumps when tags appear
    <div className='flex items-center justify-between gap-2 text-sm text-muted-foreground min-h-[26px]'>
      {/* Left: active filter/search tags, or placeholder */}
      <div className='flex flex-wrap items-center gap-2'>
        {hasActiveTags ? (
          <>
            {typeof globalFilter === 'string' && globalFilter.length > 0 && (
              <FilterBadge
                label={`Search: "${globalFilter}"`}
                onRemove={() => table.setGlobalFilter('')}
              />
            )}

            {columnFilters.flatMap((filter) => {
              const meta = filterMetaById[filter.id]
              const column = table.getColumn(filter.id)
              if (!meta || !column) return []
              const value = filter.value
              if (value == null) return []

              const render = (badgeValue: unknown, key: string, onRemove: () => void) => (
                <FilterBadge
                  key={key}
                  label={`${meta.badge ? meta.badge.label : meta.label}: ${tableFilterTypeDisplayFunction(meta)(badgeValue)}`}
                  onRemove={onRemove}
                />
              )

              if (Array.isArray(value)) {
                return value.map((v) =>
                  render(v, `${filter.id}-${String(v)}`, () => {
                    const next = value.filter((x) => x !== v)
                    column.setFilterValue(next.length ? next : undefined)
                  }),
                )
              }

              return [render(value, filter.id, () => column.setFilterValue(undefined))]
            })}
          </>
        ) : (
          <span>No filters selected</span>
        )}
      </div>

      {/* Right: [X selected ·] [Select all N ·] [N rows ·] columns dropdown */}
      <div className='flex items-center gap-1.5 shrink-0'>
        {selectedCount > 0 && <span>{selectedCount} selected ·</span>}
        {canSelectAllFiltered && (
          <>
            <button
              type='button'
              onClick={selectAllFiltered}
              className='font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors outline-none'
            >
              Select all {filteredRows.length}
            </button>
            <span>·</span>
          </>
        )}
        {selectedCount === 0 && (
          <>
            <span>
              {filteredRows.length} row{filteredRows.length === 1 ? '' : 's'}
            </span>
            <span>·</span>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-1 hover:text-foreground transition-colors outline-none'>
            <Columns className='h-3.5 w-3.5' />
            <span>
              {visibleCount} / {hideableColumns.length} columns
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onClick={(e) => {
                  e.preventDefault()
                  column.toggleVisibility(!column.getIsVisible())
                }}
              >
                {column.id.replace(/_/g, ' ')}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
