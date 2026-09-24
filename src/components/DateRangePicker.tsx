import { isAfter } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DATE_INPUT_PLACEHOLDER } from '@/lib/dateInput'
import { cn } from '@/lib/utils'
import { useDateInputDraft } from './useDateInputDraft'

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  numberOfMonths?: number
}

const dateFieldClassName =
  'w-[5.5rem] bg-transparent outline-none placeholder:text-muted-foreground aria-[invalid=true]:text-destructive'

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  className,
  date,
  setDate,
  numberOfMonths = 1,
  ...props
}) => {
  // A typed end before the start swaps them, so the range stays ordered without dropping input.
  const commitRange = (from: Date | undefined, to: Date | undefined) => {
    if (!from && !to) {
      setDate(undefined)
    } else if (from && to && isAfter(from, to)) {
      setDate({ from: to, to: from })
    } else {
      setDate({ from, to })
    }
  }

  const fromField = useDateInputDraft(date?.from, (from) => commitRange(from, date?.to))
  const toField = useDateInputDraft(date?.to, (to) => commitRange(date?.from, to))

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <div className='flex h-10 w-[300px] items-center rounded-md border border-input bg-background pl-3 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm'>
        <input
          aria-label='Start date'
          placeholder={DATE_INPUT_PLACEHOLDER}
          className={dateFieldClassName}
          {...fromField.inputProps}
        />
        <span className='px-2 text-muted-foreground'>–</span>
        <input
          aria-label='End date'
          placeholder={DATE_INPUT_PLACEHOLDER}
          className={dateFieldClassName}
          {...toField.inputProps}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label='Open calendar'
              className='ml-auto shrink-0 text-muted-foreground'
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <Calendar
              autoFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={numberOfMonths}
              fixedWeeks
              locale={enGB}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
