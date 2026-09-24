import { isSameDay } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DATE_INPUT_PLACEHOLDER, formatDateInput, parseDateInput } from '@/lib/dateInput'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  /** Set on the date text field, so a `<Label htmlFor>` can point at it. */
  id?: string
  className?: string
  placeholder?: string
}

export const DatePicker = ({
  date,
  onSelect,
  id,
  className,
  placeholder = DATE_INPUT_PLACEHOLDER,
}: DatePickerProps): React.JSX.Element => {
  const [open, setOpen] = React.useState(false)
  // The typed text while the field is being edited; null shows the committed date.
  const [draft, setDraft] = React.useState<string | null>(null)

  const isInvalid = draft !== null && draft.trim() !== '' && !parseDateInput(draft)

  const commitDraft = () => {
    if (draft === null) return
    setDraft(null)
    if (draft.trim() === '') {
      if (date) onSelect(undefined)
      return
    }
    // Unparseable text is dropped, which reverts the field to the committed date.
    const parsed = parseDateInput(draft)
    if (parsed && !(date && isSameDay(parsed, date))) onSelect(parsed)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (draft === null) return
    if (event.key === 'Enter') {
      // Commit instead of submitting the surrounding form with the stale value.
      event.preventDefault()
      commitDraft()
    } else if (event.key === 'Escape') {
      setDraft(null)
    }
  }

  const handleSelect = (newDate: Date | undefined) => {
    setDraft(null)
    onSelect(newDate)
    setOpen(false)
  }

  return (
    <div className={cn('flex w-[280px] items-center gap-2', className)}>
      <div className='relative min-w-0 flex-1'>
        <Input
          id={id}
          value={draft ?? formatDateInput(date)}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={handleKeyDown}
          className='pr-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive'
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label='Open calendar'
              className='absolute right-0 top-0 text-muted-foreground'
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={handleSelect}
              defaultMonth={date}
              autoFocus
              fixedWeeks
              locale={enGB} // changes week start to monday
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
