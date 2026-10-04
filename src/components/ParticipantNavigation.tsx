import { PassStatus } from '@tumaet/prompt-shared-state'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  className?: string
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
  className,
}: ParticipantNavigationProps<T>) => {
  const { previous, next, position } = getNavigationNeighbors(participants, currentId)

  if (position === undefined || participants.length <= 1) {
    return null
  }

  const renderButton = (direction: 'previous' | 'next', participant: T | undefined) => {
    const name = participant ? getStudentName(participant.student) : undefined
    const label = direction === 'previous' ? 'Previous' : 'Next'
    const Icon = direction === 'previous' ? ChevronLeft : ChevronRight

    return (
      <Button
        variant='outline'
        disabled={!participant}
        onClick={() => participant && onNavigate(participant)}
        title={name}
        aria-label={name ? `${label} participant: ${name}` : `${label} participant`}
        className={cn(
          'min-w-0 max-w-full',
          direction === 'previous' ? 'justify-self-start' : 'justify-self-end flex-row-reverse',
          colorByStatus &&
            participant?.passStatus &&
            statusButtonClassNames[participant.passStatus],
        )}
      >
        <Icon />
        <span className='hidden min-w-0 truncate md:inline'>{name ?? label}</span>
      </Button>
    )
  }

  return (
    <nav
      aria-label='Participant navigation'
      className={cn('grid grid-cols-[1fr_auto_1fr] items-center gap-2', className)}
    >
      {renderButton('previous', previous)}
      <span className='text-sm tabular-nums text-muted-foreground'>
        {position} / {participants.length}
      </span>
      {renderButton('next', next)}
    </nav>
  )
}
