import { Avatar, AvatarFallback, AvatarImage } from '@/components'
import { useIsInView } from '@/hooks/useIsInView'
import { type ProfilePictureRef, useProfilePictureUrl } from '@/hooks/useProfilePictureUrl'

type AvatarSize = 'lg' | 'md' | 'sm'

const sizeStyles: Record<AvatarSize, string> = {
  lg: 'h-24 w-24 text-xl',
  md: 'h-10 w-10 text-sm',
  sm: 'h-6 w-6 text-[0.7em]',
}

interface ProfilePictureProps {
  firstName: string
  lastName: string
  /** Shows this URL instead of looking the picture up, e.g. for an upload preview. */
  src?: string
  userId?: string
  studentId?: string
  courseParticipationId?: string
  /** @deprecated Gravatar is no longer used. Pass userId, studentId or courseParticipationId. */
  email?: string
  size?: AvatarSize
  className?: string
}

const toRef = ({
  userId,
  studentId,
  courseParticipationId,
}: ProfilePictureProps): ProfilePictureRef | undefined => {
  if (userId) return { kind: 'user', id: userId }
  if (studentId) return { kind: 'student', id: studentId }
  if (courseParticipationId) return { kind: 'courseParticipation', id: courseParticipationId }
  return undefined
}

/**
 * The person's PROMPT profile picture, or their initials if they have none. Pass whichever id you
 * have: pictures are looked up by user, student, or course participation id.
 */
export function ProfilePicture(props: ProfilePictureProps) {
  const { firstName, lastName, src, size = 'md', className = '' } = props
  // Long lists render many avatars; only those near the viewport look up and load their picture
  const [avatarRef, isInView] = useIsInView<HTMLSpanElement>()
  const lookedUpUrl = useProfilePictureUrl(src || !isInView ? undefined : toRef(props))
  const url = src ?? lookedUpUrl
  const initials = (firstName?.charAt(0) || 'N') + (lastName?.charAt(0) || 'A')

  return (
    <Avatar ref={avatarRef} className={`${sizeStyles[size]} ${className}`}>
      {url && <AvatarImage src={url} alt={`${firstName} ${lastName}`} className='object-cover' />}
      <AvatarFallback className='w-full h-full flex items-center justify-center font-bold'>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
