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
  /**
   * Icon-only buttons inside one centered pill around `children` and the position, e.g. for a
   * docked header. The full variant spreads the buttons to the edges with the neighbors' names.
   */
  compact?: boolean
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
 * current position centered between them. The buttons show the neighbors' names where their side
 * has room and truncate long ones; `compact` reduces them to chevrons inside one pill.
 */
export const ParticipantNavigation = <T extends NavigableParticipant>({
  participants,
  currentId,
  onNavigate,
  colorByStatus = false,
  compact = false,
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
    const statusClassName =
      colorByStatus && participant?.passStatus
        ? statusButtonClassNames[participant.passStatus]
        : undefined

    const button = (
      <Button
        variant={compact ? 'ghost' : 'outline'}
        size={compact ? 'icon' : 'default'}
        disabled={!participant}
        onClick={() => participant && onNavigate(participant)}
        title={name}
        aria-label={name ? `${label} participant: ${name}` : `${label} participant`}
        className={cn(
          compact
            ? 'h-8 w-8 shrink-0 rounded-full'
            : ['min-w-0 max-w-full', direction === 'next' && 'flex-row-reverse'],
          statusClassName,
        )}
      >
        <Icon />
        {!compact && (
          <span className='hidden min-w-0 truncate @[8rem]:inline'>{name ?? label}</span>
        )}
      </Button>
    )

    if (compact) {
      return button
    }

    return (
      <div
        className={cn(
          '@container flex min-w-0',
          direction === 'previous' ? 'justify-start' : 'justify-end',
        )}
      >
        {button}
      </div>
    )
  }

  const middle = (
    <>
      {children && (
        <div className='flex min-w-0 items-center gap-2 overflow-hidden'>{children}</div>
      )}
      {canNavigate && (
        <span className='shrink-0 text-sm tabular-nums text-muted-foreground'>
          {position} / {participants.length}
        </span>
      )}
    </>
  )

  if (compact) {
    return (
      <Container
        aria-label={canNavigate ? 'Participant navigation' : undefined}
        className={cn('flex justify-center', className)}
      >
        <div className='flex h-10 min-w-0 max-w-full items-center gap-1 rounded-full border border-input bg-background px-1 shadow-sm'>
          {canNavigate && renderButton('previous', previous)}
          <div className='flex min-w-0 items-center gap-2 px-2'>{middle}</div>
          {canNavigate && renderButton('next', next)}
        </div>
      </Container>
    )
  }

  return (
    <Container
      aria-label={canNavigate ? 'Participant navigation' : undefined}
      className={cn('@container', className)}
    >
      <div className='grid grid-cols-[minmax(3rem,1fr)_minmax(0,auto)_minmax(3rem,1fr)] items-center gap-2 @[40rem]:grid-cols-[minmax(3rem,1fr)_fit-content(60%)_minmax(3rem,1fr)]'>
        {canNavigate && renderButton('previous', previous)}
        <div className='col-start-2 flex min-w-0 items-center justify-center gap-2'>{middle}</div>
        {canNavigate && renderButton('next', next)}
      </div>
    </Container>
  )
}
