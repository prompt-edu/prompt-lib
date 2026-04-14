import { Table } from '@tanstack/react-table'
import { Columns } from 'lucide-react'
import { WithId } from '../PromptTableTypes'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui'

interface TableColumnVisibilityButtonProps<Type> {
  table: Table<Type>
}

export function TableColumnVisibilityButton<Type extends WithId>({
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
                {column.id.replace(/_/g, ' ')}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
