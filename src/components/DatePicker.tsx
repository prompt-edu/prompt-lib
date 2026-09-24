import { enGB } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { applyTime, DATE_INPUT_PLACEHOLDER, formatTimeInput, parseTimeInput } from '@/lib/dateInput'
import { cn } from '@/lib/utils'
import { useDateInputDraft } from './useDateInputDraft'

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  /** Adds an HH:mm time field next to the date; without it selected dates are at local midnight. */
  withTime?: boolean
  /** The HH:mm time a date gets when there is no selected date to take the time from. */
  defaultTime?: string
  /** Set on the date text field, so a `<Label htmlFor>` can point at it. */
  id?: string
  className?: string
  placeholder?: string
}

export const DatePicker = ({
  date,
  onSelect,
  withTime = false,
  defaultTime = '00:00',
  id,
  className,
  placeholder = DATE_INPUT_PLACEHOLDER,
}: DatePickerProps): React.JSX.Element => {
  const [open, setOpen] = React.useState(false)
  // The time typed before any date is selected, applied once one is.
  const [pendingTime, setPendingTime] = React.useState(defaultTime)
  // The time field's value while it is incomplete, which the native input reports as ''.
  const [timeDraft, setTimeDraft] = React.useState<string | null>(null)

  const time = date ? formatTimeInput(date) : pendingTime

  const withSelectedTime = (day: Date) => (withTime ? (applyTime(day, time) ?? day) : day)

  const dateField = useDateInputDraft(date, (newDate) =>
    onSelect(newDate && withSelectedTime(newDate)),
  )

  const handleSelect = (newDate: Date | undefined) => {
    dateField.reset()
    onSelect(newDate && withSelectedTime(newDate))
    setOpen(false)
  }

  const handleTimeChange = (value: string) => {
    setTimeDraft(value)
    if (!parseTimeInput(value)) return
    if (date) {
      onSelect(applyTime(date, value))
    } else {
      setPendingTime(value)
    }
  }

  return (
    <div className={cn('flex w-[280px] items-center gap-2', className)}>
      <div className='relative min-w-0 flex-1'>
        <Input
          id={id}
          placeholder={placeholder}
          {...dateField.inputProps}
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
      {withTime && (
        <Input
          id={id && `${id}-time`}
          type='time'
          aria-label='Time'
          value={timeDraft ?? time}
          onChange={(event) => handleTimeChange(event.target.value)}
          onBlur={() => setTimeDraft(null)}
          className='w-28 shrink-0'
        />
      )}
    </div>
  )
}
