import type { Table } from '@tanstack/react-table'
import { Filter } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui'
import type { TableFilter } from '../PromptTableTypes'
import { NumericRangeFilterSection } from './NumericRangeFilterSection'
import { SelectFilterSection } from './SelectFilterSection'

interface TableFiltersMenuProps {
  table: Table<any>
  filters: TableFilter[]
  trigger?: ReactNode
}

export function TableFiltersMenu({ table, filters, trigger }: TableFiltersMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant='outline' className='justify-start'>
            <Filter className='h-4 w-4' />
            <span className='hidden sm:inline'>Filter</span>
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-64 max-h-[60vh] overflow-y-auto'>
        {filters.map((filter) => {
          const column = table.getColumn(filter.id)
          if (!column) return null

          if (filter.type === 'select') {
            return (
              <SelectFilterSection
                key={filter.id}
                label={filter.label}
                column={column}
                options={filter.options}
                getDisplay={filter.optionLabel}
              />
            )
          }

          if (filter.type === 'numericRange') {
            return (
              <NumericRangeFilterSection
                key={filter.id}
                label={filter.label}
                column={column}
                noValueLabel={filter.noValueLabel}
              />
            )
          }

          return <div key={filter.id}>{filter.render({ column, table })}</div>
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
