import { useAuthStore } from '@tumaet/prompt-shared-state'
import { ImageUp } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Alert, AlertDescription, Button, CardTitle } from '@/components'
import { useOwnProfilePicture } from '@/hooks/useOwnProfilePicture'
import { ProfilePictureDialog } from './ProfilePictureDialog'
import { ProfilePicture } from './StudentProfilePicture'

export interface ProfilePictureInputProps {
  required?: boolean
  /** Explains why the picture is asked for; replaces the default explanation. */
  explanation?: string
  /** Additional information for the student, e.g. who can see the picture and when. */
  notice?: ReactNode
  /** A validation message from the surrounding form, e.g. when a required picture is missing. */
  error?: string
  /**
   * Shows the section as a preview, e.g. for a lecturer: nothing can be changed, and the viewer's
   * own picture is not shown, since it would appear as if it were the applicant's.
   */
  readOnly?: boolean
}

/**
 * A form section for the logged-in user's profile picture. Changing it here changes it everywhere
 * in PROMPT right away; the surrounding form only validates that one exists when it is required.
 */
export function ProfilePictureInput({
  required = false,
  explanation,
  notice,
  error,
  readOnly = false,
}: ProfilePictureInputProps) {
  const { user } = useAuthStore()
  const { data: ownPicture } = useOwnProfilePicture()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const picture = readOnly ? null : ownPicture

  return (
    <div className='space-y-4'>
      <div>
        <CardTitle className='text-lg'>
          Profile picture
          {required && <span className='text-red-500 ml-1'>*</span>}
        </CardTitle>
        <p className='text-sm text-muted-foreground mt-1'>
          {explanation?.trim() || 'Your picture helps the course team recognize you.'}
        </p>
      </div>

      <div className='flex items-center gap-4'>
        <ProfilePicture
          src={picture?.url}
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
          size='lg'
        />
        <div className='space-y-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsDialogOpen(true)}
            disabled={readOnly}
          >
            <ImageUp className='h-4 w-4' />
            {picture ? 'Change picture' : 'Add picture'}
          </Button>
          <p className='text-xs text-muted-foreground'>
            This is your PROMPT profile picture, so changes apply everywhere in PROMPT.
          </p>
        </div>
      </div>

      {notice && <div className='text-sm text-muted-foreground'>{notice}</div>}

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!readOnly && (
        <ProfilePictureDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          required={required}
        />
      )}
    </div>
  )
}
