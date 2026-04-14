import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { ReactElement } from 'react'
import { RowAction, WithId } from '../PromptTableTypes'

interface ActionDialogProps<T extends WithId> {
  action: RowAction<T>
  selectedRows: T[]
  onConfirm: () => Promise<void> | void
  onClose: () => void
}

export function ActionDialog<T extends WithId>({
  action,
  selectedRows,
  onClose,
  onConfirm,
}: ActionDialogProps<T>): ReactElement {
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

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action.confirm?.variant ?? 'default'}
            onClick={async () => {
              await onConfirm()
            }}
          >
            {action.confirm?.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
