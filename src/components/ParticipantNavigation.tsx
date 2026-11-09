import { PassStatus } from '@tumaet/prompt-shared-state'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { ProfilePicture } from '@/components/StudentProfilePicture'
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
   * Chevron-only buttons in one box around the current participant's picture and name, without
   * the position, e.g. for a docked header.
   */
  compact?: boolean
  className?: string
  /** Shown after the name in the compact box from `sm` up, e.g. the participant's badges. */
  children?: ReactNode
}

// Only the text and border carry the status; hovering looks like any other outline button.
const statusButtonClassNames: Record<PassStatus, string> = {
  [PassStatus.PASSED]: 'border-green-600 text-green-700 dark:border-green-500 dark:text-green-400',
  [PassStatus.FAILED]: 'border-red-600 text-red-700 dark:border-red-500 dark:text-red-400',
  [PassStatus.NOT_ASSESSED]:
    'border-gray-500 text-gray-700 dark:border-gray-400 dark:text-gray-300',
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
  compact = false,
  className,
  children,
}: ParticipantNavigationProps<T>) => {
  const { previous, next, position } = getNavigationNeighbors(participants, currentId)
  const canNavigate = position !== undefined && participants.length > 1
  const current = position !== undefined ? participants[position - 1] : undefined

  // The compact box still shows the participant, so a docked header keeps the name.
  if (!canNavigate && !(compact && current)) {
    return null
  }

  const renderButton = (direction: 'previous' | 'next', participant: T | undefined) => {
    const name = participant ? getStudentName(participant.student) : undefined
    const label = direction === 'previous' ? 'Previous' : 'Next'
    const Icon = direction === 'previous' ? ChevronLeft : ChevronRight

    return (
      <Button
        variant={compact ? 'ghost' : 'outline'}
        size={compact ? 'icon' : 'default'}
        disabled={!participant}
        onClick={() => participant && onNavigate(participant)}
        title={name}
        aria-label={name ? `${label} participant: ${name}` : `${label} participant`}
        className={cn(
          compact
            ? 'h-8 w-8 shrink-0'
            : [
                'min-w-0 max-w-full',
                direction === 'previous'
                  ? 'justify-self-start'
                  : 'justify-self-end flex-row-reverse',
              ],
          colorByStatus &&
            participant?.passStatus &&
            statusButtonClassNames[participant.passStatus],
        )}
      >
        <Icon />
        {!compact && <span className='hidden min-w-0 truncate md:inline'>{name ?? label}</span>}
      </Button>
    )
  }

  if (!compact) {
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

  const Container = canNavigate ? 'nav' : 'div'

  return (
    <Container
      aria-label={canNavigate ? 'Participant navigation' : undefined}
      className={cn('flex justify-center', className)}
    >
      <div className='pointer-events-auto flex h-10 min-w-0 max-w-full items-center gap-1 rounded-md border border-input bg-background px-1 shadow-sm'>
        {canNavigate && renderButton('previous', previous)}
        <div className='flex min-w-0 items-center gap-2 overflow-hidden px-2'>
          {current && (
            <>
              <ProfilePicture
                courseParticipationId={current.courseParticipationID}
                firstName={current.student.firstName ?? ''}
                lastName={current.student.lastName ?? ''}
                size='sm'
                className='shrink-0'
              />
              <span className='truncate font-semibold'>{getStudentName(current.student)}</span>
            </>
          )}
          {children && <div className='hidden shrink-0 items-center gap-1 sm:flex'>{children}</div>}
        </div>
        {canNavigate && renderButton('next', next)}
      </div>
    </Container>
  )
}
