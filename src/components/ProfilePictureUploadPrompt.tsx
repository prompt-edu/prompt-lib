import { useAuthStore } from '@tumaet/prompt-shared-state'
import { ImageUp } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, CardContent } from '@/components'
import { useOwnProfilePicture } from '@/hooks/useOwnProfilePicture'
import {
  dismissProfilePicturePrompt,
  isProfilePicturePromptDismissed,
} from '@/lib/profilePicturePromptDismissal'
import { ProfilePictureDialog } from './ProfilePictureDialog'
import type { ProfilePictureRequirement } from './ProfilePictureRequirementSetting'
import { ProfilePicture } from './StudentProfilePicture'

export interface ProfilePictureUploadPromptProps {
  /** The phase's setting from `ProfilePictureRequirementSetting`; `off` renders nothing. */
  requirement: ProfilePictureRequirement
  /** Explains why the phase asks for a picture; replaces the default explanation. */
  explanation?: string
  /**
   * Remembers in this browser that an optional prompt was dismissed, e.g. the course phase id.
   * Without it, a dismissal lasts until the page is left.
   */
  dismissKey?: string
  /** Controls the dismissal instead of the browser storage, e.g. to keep it on the server. */
  isDismissed?: boolean
  onDismiss?: () => void
  className?: string
}

/**
 * Asks a student without a profile picture to add one. Place it on the student page of a phase;
 * it disappears as soon as the student has a picture. A required prompt cannot be dismissed.
 */
export function ProfilePictureUploadPrompt({
  requirement,
  explanation,
  dismissKey,
  isDismissed,
  onDismiss,
  className = '',
}: ProfilePictureUploadPromptProps) {
  const { user } = useAuthStore()
  const { data: ownPicture, isPending, isError } = useOwnProfilePicture()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // Tracked per key, so a prompt that is reused under another key does not keep the old state
  const [dismissedKeys, setDismissedKeys] = useState<ReadonlySet<string | undefined>>(new Set())
  const isDismissedLocally =
    dismissedKeys.has(dismissKey) ||
    (dismissKey ? isProfilePicturePromptDismissed(dismissKey) : false)

  const isOptional = requirement === 'optional'
  const dismissed = isOptional && (isDismissed ?? isDismissedLocally)

  const dismiss = () => {
    if (onDismiss) {
      onDismiss()
      return
    }
    if (dismissKey) dismissProfilePicturePrompt(dismissKey)
    setDismissedKeys((keys) => new Set(keys).add(dismissKey))
  }

  // Nothing to ask for, or nothing known yet: an unknown state must not flash the prompt
  if (requirement === 'off' || isPending || isError || ownPicture || dismissed) {
    return null
  }

  return (
    <Card className={className}>
      <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center'>
        <ProfilePicture
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
          size='md'
        />
        <div className='flex-1'>
          <p className='font-medium'>Add a profile picture</p>
          <p className='text-sm text-muted-foreground'>
            {explanation?.trim() ||
              (isOptional
                ? 'It helps your team and tutors recognize you. You can skip this.'
                : 'This course phase asks every student for a profile picture.')}
          </p>
        </div>
        <div className='flex gap-2'>
          {isOptional && (
            <Button variant='ghost' onClick={dismiss}>
              Not now
            </Button>
          )}
          <Button onClick={() => setIsDialogOpen(true)}>
            <ImageUp className='h-4 w-4' />
            Add picture
          </Button>
        </div>
      </CardContent>
      <ProfilePictureDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Card>
  )
}
