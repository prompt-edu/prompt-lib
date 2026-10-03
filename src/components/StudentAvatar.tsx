import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ProfilePicture } from './StudentProfilePicture'

interface MinimalStudent {
  /** The student id; used for the picture and the link to the student page. */
  id?: string
  /** Looks the picture up by course participation when the student id is not known. */
  courseParticipationId?: string
  firstName: string
  lastName: string
  email?: string
}

interface StudentAvatarProps {
  student: MinimalStudent
}

export const StudentAvatar = ({ student }: StudentAvatarProps) => {
  const avatar = (
    <>
      <ProfilePicture
        studentId={student.id}
        courseParticipationId={student.courseParticipationId}
        firstName={student.firstName}
        lastName={student.lastName}
        size='sm'
      />

      <span className='text-xs transition-colors'>
        {student.firstName} {student.lastName}
      </span>
    </>
  )

  return student.id ? (
    <Link
      to={`/management/students/${student.id}`}
      className='flex items-center gap-2 hover:text-blue-500'
    >
      {avatar}
    </Link>
  ) : (
    avatar
  )
}
export const RenderStudents = ({
  students,
  fallback,
  className = '',
}: {
  students: MinimalStudent[]
  fallback: ReactNode
  className?: string
}) => {
  return (
    <div className={className}>
      {students.length === 0 ? (
        fallback
      ) : (
        <ul className='flex flex-wrap gap-x-2'>
          {students.map((student) => (
            <li
              key={
                student.id ??
                student.courseParticipationId ??
                student.email ??
                `${student.firstName} ${student.lastName}`
              }
            >
              <StudentAvatar student={student} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
