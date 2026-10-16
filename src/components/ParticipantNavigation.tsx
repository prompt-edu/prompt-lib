import { PassStatus } from '@tumaet/prompt-shared-state'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { getNavigationNeighbors } from '@/lib/getNavigationNeighbors'
import { getStudentName } from '@/lib/getStudentName'
import { cn } from '@/lib/utils'

export interface NavigableParticipant {
  courseParticipationID: string
  passStatus?: PassStatus
  student: { firstName?: string; lastName?: string }
}

interface ParticipantNavigationProps<T extends NavigableParticipant> {
  /** The participants in the order to navigate through. */
  participants: T[]
  currentId: string | undefined
  onNavigate: (participant: T) => void
  /** Tints each button with the pass status of the participant it leads to. */
  colorByStatus?: boolean
  floating?: boolean
  className?: string
  children?: ReactNode
}

const statusButtonClassNames: Record<PassStatus, string> = {
  [PassStatus.PASSED]:
    'border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950',
  [PassStatus.FAILED]:
    'border-red-600 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950',
  [PassStatus.NOT_ASSESSED]:
    'border-gray-500 text-gray-700 hover:bg-gray-50 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-900',
}

/**
 * Previous / next buttons for stepping through participants from their detail page, with the
 * current position centered between them. Names show from `md` up and truncate so long names fit.
 */
export const ParticipantNavigation = <T extends NavigableParticipant>({
  participants,
  currentId,
  onNavigate,
  colorByStatus = false,
  floating = false,
  className,
  children,
}: ParticipantNavigationProps<T>) => {
  const { previous, next, position } = getNavigationNeighbors(participants, currentId)
  const canNavigate = position !== undefined && participants.length > 1

  if (!canNavigate && !children) {
    return null
  }

  const Container = canNavigate ? 'nav' : 'div'

  const renderButton = (direction: 'previous' | 'next', participant: T | undefined) => {
    const name = participant ? getStudentName(participant.student) : undefined
    const label = direction === 'previous' ? 'Previous' : 'Next'
    const Icon = direction === 'previous' ? ChevronLeft : ChevronRight

    return (
      <div
        className={cn(
          '@container flex min-w-0',
          direction === 'previous' ? 'justify-start' : 'justify-end',
        )}
      >
        <div
          className={cn(
            'flex min-w-0 max-w-full rounded-md',
            floating && 'bg-background shadow-sm',
          )}
        >
          <Button
            variant='outline'
            disabled={!participant}
            onClick={() => participant && onNavigate(participant)}
            title={name}
            aria-label={name ? `${label} participant: ${name}` : `${label} participant`}
            className={cn(
              'min-w-0 max-w-full',
              direction === 'next' && 'flex-row-reverse',
              colorByStatus &&
                participant?.passStatus &&
                statusButtonClassNames[participant.passStatus],
            )}
          >
            <Icon />
            <span className='hidden min-w-0 truncate @[8rem]:inline'>{name ?? label}</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Container
      aria-label={canNavigate ? 'Participant navigation' : undefined}
      className={cn('@container', className)}
    >
      <div className='grid grid-cols-[minmax(3rem,1fr)_minmax(0,auto)_minmax(3rem,1fr)] items-center gap-2 @[40rem]:grid-cols-[minmax(3rem,1fr)_fit-content(60%)_minmax(3rem,1fr)]'>
        {canNavigate && renderButton('previous', previous)}
        <div
          className={cn(
            'col-start-2 flex min-w-0 items-center justify-center gap-2',
            floating && 'h-10 rounded-md border border-input bg-background px-4 shadow-sm',
          )}
        >
          {children && (
            <div className='flex min-w-0 items-center gap-2 overflow-hidden'>{children}</div>
          )}
          {canNavigate && (
            <span className='shrink-0 text-sm tabular-nums text-muted-foreground'>
              {position} / {participants.length}
            </span>
          )}
        </div>
        {canNavigate && renderButton('next', next)}
      </div>
    </Container>
  )
}
