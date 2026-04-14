import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Table as ReactTable } from '@tanstack/react-table'
import { ReactElement } from 'react'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

interface TablePaginationProps<TData> {
  table: ReactTable<TData>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>): ReactElement {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div className='flex items-center justify-between gap-2 text-sm text-muted-foreground'>
      <div className='flex items-center gap-2'>
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className='h-7 w-[70px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-1.5'>
        <span>
          Page {pageCount > 0 ? pageIndex + 1 : 0} of {pageCount}
        </span>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          aria-label='Go to first page'
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          aria-label='Go to previous page'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          aria-label='Go to next page'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          aria-label='Go to last page'
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
