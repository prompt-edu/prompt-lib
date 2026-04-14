import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>
  title: string
}

export function SortableHeader<TData>({ column, title }: SortableHeaderProps<TData>) {
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
