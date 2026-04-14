import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Input,
} from '@/components/ui'
import { Column } from '@tanstack/react-table'

interface NumericRangeFilterSectionProps {
  label: string
  column: Column<any, unknown>
  noValueLabel?: string
}

export function NumericRangeFilterSection({
  label,
  column,
  noValueLabel,
}: NumericRangeFilterSectionProps) {
  const value =
    (column.getFilterValue() as {
      min?: string
      max?: string
      noScore?: boolean
    }) ?? {}

  const setValue = (
    updates: Partial<{
      min?: string
      max?: string
      noScore?: boolean
    }>,
  ) => {
    const next = {
      ...value,
      ...updates,
    }

    if (updates.noScore === true) {
      next.min = ''
      next.max = ''
    }

    if ('min' in updates || 'max' in updates) {
      next.noScore = false
    }

    const isEmpty = !next.min && !next.max && !next.noScore
    column.setFilterValue(isEmpty ? undefined : next)
  }

  return (
    <>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className='p-2 space-y-2'>
        <div className='flex items-center gap-2'>
          <Input
            type='number'
            placeholder='Min'
            value={value.min ?? ''}
            onChange={(e) => setValue({ min: e.target.value })}
            className='w-full'
          />
          <Input
            type='number'
            placeholder='Max'
            value={value.max ?? ''}
            onChange={(e) => setValue({ max: e.target.value })}
            className='w-full'
          />
        </div>

        <DropdownMenuCheckboxItem
          checked={value.noScore ?? false}
          onClick={(e) => {
            e.preventDefault()
            setValue({ noScore: !value.noScore })
          }}
        >
          {noValueLabel ?? 'No value'}
        </DropdownMenuCheckboxItem>
      </div>
    </>
  )
}
