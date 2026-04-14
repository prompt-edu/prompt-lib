import { flexRender, HeaderGroup, Table as ReactTable } from '@tanstack/react-table'
import { TableHead, TableHeader, TableRow } from '../../../ui'
import { ReactElement } from 'react'
import { SortableHeader } from './SortableHeader'

interface TableHeadersProps<TData> {
  table: ReactTable<TData>
}

export function TableHeaders<TData>({ table }: TableHeadersProps<TData>): ReactElement {
  return (
    <TableHeader className='bg-muted/100'>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id} className='whitespace-nowrap'>
              {renderHeaderCell(header)}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}

function renderHeaderCell<TData>(header: HeaderGroup<TData>['headers'][number]) {
  if (header.isPlaceholder) return null

  const def = header.column.columnDef.header

  if (header.column.getCanSort() && typeof def === 'string') {
    return <SortableHeader column={header.column} title={def} />
  }

  return flexRender(def, header.getContext())
}
