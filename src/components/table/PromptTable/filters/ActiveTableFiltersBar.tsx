import { TableFilter } from '../PromptTableTypes'
import { Table } from '@tanstack/react-table'
import { FilterBadge } from './FilterBadge'
import { tableFilterTypeDisplayFunction } from './filterbadgeFns'

interface ActiveTableFiltersBarProps {
  table: Table<any>
  filters?: TableFilter[]
}

export function ActiveTableFiltersBar({ table, filters = [] }: ActiveTableFiltersBarProps) {
  const { globalFilter, columnFilters } = table.getState()

  if (!globalFilter && columnFilters.length === 0) {
    return null
  }

  const filterMetaById = Object.fromEntries(filters.map((f) => [f.id, f]))

  return (
    <div className='flex flex-wrap items-center gap-2'>
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
    </div>
  )
}
