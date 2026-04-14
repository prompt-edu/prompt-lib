import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Button } from '@/components/ui'
import { Table } from '@tanstack/react-table'
import { ReactNode } from 'react'
import { TableFilter } from '../PromptTableTypes'
import { SelectFilterSection } from './SelectFilterSection'
import { NumericRangeFilterSection } from './NumericRangeFilterSection'
import { Filter } from 'lucide-react'

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

      <DropdownMenuContent className='w-64'>
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
