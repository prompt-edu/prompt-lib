import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export const DatePicker = ({ date, onSelect }: DatePickerProps): React.JSX.Element => {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (newDate: Date | undefined) => {
    onSelect(newDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
          initialFocus
          fixedWeeks
          locale={enGB} // changes week start to monday
        />
      </PopoverContent>
    </Popover>
  )
}
