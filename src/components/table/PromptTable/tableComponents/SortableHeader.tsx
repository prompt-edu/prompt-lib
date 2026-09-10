import type { RowData } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PromptTableColumn } from '../tableFeatures'

interface SortableHeaderProps<TData extends RowData> {
  column: PromptTableColumn<TData>
  title: string
}

export function SortableHeader<TData extends RowData>({
  column,
  title,
}: SortableHeaderProps<TData>) {
  // Sorting can be turned off per column or table-wide (a server-driven table sorts elsewhere),
  // and a header that cannot sort must not offer the control.
  if (!column.getCanSort()) {
    return <span>{title}</span>
  }

  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className='flex items-center pl-0'
    >
      {title}
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp className='ml-2 h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown className='ml-2 h-4 w-4' />
      ) : (
        <ArrowUpDown className='ml-2 h-4 w-4 text-muted-foreground' />
      )}
    </Button>
  )
}
