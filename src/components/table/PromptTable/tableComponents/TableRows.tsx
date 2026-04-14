import { flexRender, Table as ReactTable } from '@tanstack/react-table'
import { ReactElement } from 'react'
import { TableBody, TableCell, TableRow } from '../../../ui'

interface TableRowsProps<TData> {
  table: ReactTable<TData>
  onRowClick?: (rowData: TData) => void
}

export function TableRows<TData>({ table, onRowClick }: TableRowsProps<TData>): ReactElement {
  const rows = table.getRowModel().rows

  if (!rows.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? 'selected' : undefined}
          onClick={() => {
            if (onRowClick) {
              onRowClick(row.original)
            }
          }}
          className='cursor-pointer'
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className='whitespace-nowrap cursor-pointer'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
