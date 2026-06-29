import { Checkbox } from '@/components/ui'
import { ColumnDef } from '@tanstack/react-table'

export const checkboxColumn = <T extends { id: string }>(): ColumnDef<T> => ({
  id: 'select',

  header: ({ table }) => (
    <div className='flex items-center justify-center'>
      <Checkbox
        checked={table.getSelectedRowModel().rows.length > 0}
        onCheckedChange={(checked) => {
          if (checked) {
            table.toggleAllPageRowsSelected(true)
          } else {
            table.resetRowSelection()
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  ),

  cell: ({ row }) => (
    <div className='flex items-center justify-center'>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          row.toggleSelected(!!checked)
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  ),

  enableSorting: false,
  enableHiding: false,
})
