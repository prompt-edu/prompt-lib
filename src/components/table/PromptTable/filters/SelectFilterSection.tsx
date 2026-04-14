import { DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui'
import { Column } from '@tanstack/react-table'

interface SelectFilterSectionProps {
  label: string
  column: Column<any, unknown>
  options: string[]
  getDisplay?: (value: string) => React.ReactNode
}

export function SelectFilterSection({
  label,
  column,
  options,
  getDisplay,
}: SelectFilterSectionProps) {
  const current = (column.getFilterValue() as string[]) ?? []

  return (
    <div>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {options.map((value) => {
        const selected = current.includes(value)

        return (
          <DropdownMenuCheckboxItem
            key={value}
            checked={selected}
            onSelect={(e) => {
              e.preventDefault()
              column.setFilterValue(
                selected ? current.filter((v) => v !== value) : [...current, value],
              )
            }}
          >
            {getDisplay?.(value) ?? value}
          </DropdownMenuCheckboxItem>
        )
      })}
    </div>
  )
}
