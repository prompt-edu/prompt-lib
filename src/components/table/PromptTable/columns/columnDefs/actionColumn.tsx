import { ColumnDef } from '@tanstack/react-table'
import { RowAction } from '../../PromptTableTypes'
import { ActionsMenu } from '../../actions/ActionsMenu'
import { MoreHorizontal } from 'lucide-react'

export const actionColumn = <T extends { id: string }>(actions: RowAction<T>[]): ColumnDef<T> => ({
  id: 'rowActions',
  header: '',
  enableSorting: false,
  enableHiding: false,
  cell: ({ row }) => (
    <div onClick={(e) => e.stopPropagation()} className='flex justify-end'>
      <ActionsMenu
        actions={actions}
        selectedRows={[row.original]}
        triggerComponent={
          <div
            className='h-4 w-4 transform scale-150 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className='h-3 w-3' />
          </div>
        }
      />
    </div>
  ),
})
