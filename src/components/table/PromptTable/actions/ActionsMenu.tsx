import { ReactElement, useState } from 'react'
import { RowAction, WithId } from '../PromptTableTypes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui'
import { ActionDialog } from './ActionDialog'
import { DropdownMenuItemForRowAction } from './DropdownMenuItemForRowAction'
import { Loader2 } from 'lucide-react'

interface ActionsMenuProps<Type extends WithId> {
  selectedRows: Type[]
  triggerComponent: React.ReactNode
  actions: RowAction<Type>[]
  onFinish?: () => void
}

export function ActionsMenu<Type extends WithId>({
  selectedRows,
  triggerComponent,
  actions,
  onFinish,
}: ActionsMenuProps<Type>): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openActionConfirmation, setOpenActionConfirmation] = useState<RowAction<Type> | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
    onFinish?.()
  }

  const executeAction = async (action: RowAction<Type>) => {
    const rowsToAffect = [...selectedRows]
    try {
      setIsExecuting(true)
      await action.onAction(rowsToAffect)
    } finally {
      setIsExecuting(false)
      closeMenu()
    }
  }

  const clickMenuItem = async (action: RowAction<Type>) => {
    if (action.confirm) {
      setOpenActionConfirmation(action)
      return
    }

    await executeAction(action)
  }

  const clickDialogConfirm = async () => {
    if (!openActionConfirmation) return

    const action = openActionConfirmation
    setOpenActionConfirmation(null)
    await executeAction(action)
  }

  return (
    <>
      <DropdownMenu
        open={menuOpen && !isExecuting}
        onOpenChange={(open) => {
          if (!isExecuting) {
            setMenuOpen(open)
          }
        }}
      >
        <DropdownMenuTrigger asChild disabled={isExecuting}>
          <div className='relative inline-flex items-center'>
            {isExecuting ? <Loader2 className='h-4 w-4 animate-spin' /> : triggerComponent}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {actions.map((action) => (
            <DropdownMenuItemForRowAction
              key={action.label}
              action={action}
              rows={selectedRows}
              onTrigger={clickMenuItem}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {openActionConfirmation != null && (
        <ActionDialog
          action={openActionConfirmation}
          selectedRows={selectedRows}
          onConfirm={clickDialogConfirm}
          onClose={() => setOpenActionConfirmation(null)}
        />
      )}
    </>
  )
}
