import { useAuthStore } from '@tumaet/prompt-shared-state'
import { ImageUp, UserRound } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Alert, AlertDescription, Avatar, AvatarFallback, Button, CardTitle } from '@/components'
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
   * Shows the section as someone else would see it, e.g. a lecturer previewing the form: nothing
   * can be changed, and a neutral placeholder replaces the viewer's own picture and initials, since
   * they would appear as if they were the applicant's.
   */
  preview?: boolean
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
  preview = false,
}: ProfilePictureInputProps) {
  const { user } = useAuthStore()
  const { data: ownPicture } = useOwnProfilePicture(!preview)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const picture = preview ? null : ownPicture

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
        {preview ? (
          <Avatar className='h-24 w-24'>
            <AvatarFallback className='w-full h-full flex items-center justify-center text-muted-foreground'>
              <UserRound className='h-1/2 w-1/2' aria-hidden />
            </AvatarFallback>
          </Avatar>
        ) : (
          <ProfilePicture
            src={picture?.url}
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            size='lg'
          />
        )}
        <div className='space-y-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsDialogOpen(true)}
            disabled={preview}
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

      {!preview && (
        <ProfilePictureDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          required={required}
        />
      )}
    </div>
  )
}
