import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-sm',
        'bg-muted text-muted-foreground',
      )}
    >
      {label}
      <button onClick={onRemove} className='rounded-sm p-0.5 hover:bg-muted-foreground/20'>
        <X className='h-3 w-3' />
      </button>
    </span>
  )
}
