import { ReactElement } from 'react'
import { DropdownMenuItem } from '@/components/ui'
import { RowAction, WithId } from '../PromptTableTypes'

interface DropdownMenuItemForRowActionProps<Type extends WithId> {
  action: RowAction<Type>
  rows: Type[]
  onTrigger: (action: RowAction<Type>) => void
}

export function DropdownMenuItemForRowAction<Type extends WithId>({
  action,
  rows,
  onTrigger,
}: DropdownMenuItemForRowActionProps<Type>): ReactElement | null {
  const isHidden = action.hide?.(rows) ?? false
  const isDisabled = action.disabled?.(rows) ?? false

  if (isHidden) return null

  return (
    <DropdownMenuItem
      disabled={isDisabled}
      onSelect={(event) => {
        event.preventDefault()
        if (!isDisabled) {
          onTrigger(action)
        }
      }}
    >
      <div className='mr-2'>{action.icon}</div>
      {action.label}
    </DropdownMenuItem>
  )
}
