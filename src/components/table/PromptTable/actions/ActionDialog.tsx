import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components/ui'
import { ReactElement, useState } from 'react'
import { RowAction, WithId } from '../PromptTableTypes'

interface ActionDialogProps<T extends WithId> {
  action: RowAction<T>
  selectedRows: T[]
  onConfirm: (inputValue?: string) => Promise<void> | void
  onClose: () => void
}

export function ActionDialog<T extends WithId>({
  action,
  selectedRows,
  onClose,
  onConfirm,
}: ActionDialogProps<T>): ReactElement {
  const input = action.confirm?.input
  const [inputValue, setInputValue] = useState(input?.defaultValue ?? '')

  const description =
    typeof action?.confirm?.description === 'function'
      ? action.confirm.description(selectedRows.length)
      : (action?.confirm?.description ?? '')
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action.confirm?.title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {input && (
          <div className='grid gap-2'>
            <Label htmlFor='action-dialog-input'>{input.label}</Label>
            <Input
              id='action-dialog-input'
              value={inputValue}
              placeholder={input.placeholder}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action.confirm?.variant ?? 'default'}
            onClick={async () => {
              await onConfirm(input ? inputValue : undefined)
            }}
          >
            {action.confirm?.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
