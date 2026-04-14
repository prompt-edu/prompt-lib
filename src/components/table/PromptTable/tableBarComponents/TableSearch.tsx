import { Input } from '@/components/ui'
import { Filter, SearchIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { Table as ReactTable } from '@tanstack/react-table'
import { TableFilter } from '../PromptTableTypes'
import { TableFiltersMenu } from '../filters/TableFiltersMenu'

interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  table?: ReactTable<any>
  filters?: TableFilter[]
}

export function TableSearch({ value, onChange, table, filters }: TableSearchProps): ReactElement {
  const [inputValue, setInputValue] = useState(value)
  const skipNextSync = useRef(false)

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    setInputValue(value)
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      onChange(inputValue)
      skipNextSync.current = true
      setInputValue('')
    }
  }

  const showFilter = filters && filters.length > 0 && table

  return (
    <div className='relative flex-1 min-w-0 h-full'>
      <div className='flex rounded-md border border-input focus-within:ring-1 focus-within:ring-ring overflow-hidden h-10'>
        <div className='relative flex-1 min-w-0'>
          <Input
            placeholder='Search ... (press Enter)'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='h-full pl-3 sm:pl-9 w-full border-0 shadow-none focus-visible:ring-0 rounded-none'
          />
          <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hidden sm:block' />
        </div>

        {showFilter && (
          <TableFiltersMenu
            table={table}
            filters={filters}
            trigger={
              <button
                type='button'
                aria-label='Filter'
                className={
                  'flex items-center gap-1.5 shrink-0 border-l ' +
                  'border-input px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none'
                }
              >
                <Filter className='h-4 w-4' />
                <span className='hidden sm:inline'>Filter</span>
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
