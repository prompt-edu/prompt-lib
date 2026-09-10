import type { RowData } from '@tanstack/react-table'
import { Columns } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui'
import type { WithId } from '../PromptTableTypes'
import type { PromptTableInstance } from '../tableFeatures'

interface TableColumnVisibilityButtonProps<Type extends RowData> {
  table: PromptTableInstance<Type>
}

export function TableColumnVisibilityButton<Type extends WithId & RowData>({
  table,
}: TableColumnVisibilityButtonProps<Type>): React.JSX.Element {
  const columns = table.getAllColumns()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <Columns className='h-4 w-4' />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {columns
          .filter((column) => column.getCanHide())
          .map((column) => {
            const header = column.columnDef.header
            const label = typeof header === 'string' && header ? header : column.id
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onClick={(e) => {
                  e.preventDefault()
                  column.toggleVisibility(!column.getIsVisible())
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
