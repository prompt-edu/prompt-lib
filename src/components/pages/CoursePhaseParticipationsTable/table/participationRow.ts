import type { AccessorFn, FilterFn, SortFn } from '@tanstack/react-table'
import type {
  CoursePhaseParticipationWithStudent,
  Gender,
  PassStatus,
  Student,
  StudyDegree,
} from '@tumaet/prompt-shared-state'
import type {
  PromptTableColumnDef,
  PromptTableFeatures,
} from '@/components/table/PromptTable/tableFeatures'

export interface ParticipantRow {
  id: string

  coursePhaseID: string
  courseParticipationID: string
  passStatus: PassStatus

  restrictedData: Record<string, any>
  studentReadableData?: Record<string, any>
  prevData?: Record<string, any>

  student: Student

  firstName: string
  lastName: string
  email?: string
  matriculationNumber?: string
  universityLogin?: string
  gender?: Gender
  nationality?: string
  studyDegree?: StudyDegree
  studyProgram?: string
  currentSemester?: number

  [key: string]: unknown
}

export interface ExtraParticipantColumn<TValue> {
  id: string
  header: string

  accessorFn?: AccessorFn<ParticipantRow, TValue>
  cell?: PromptTableColumnDef<ParticipantRow, TValue>['cell']

  enableSorting?: boolean
  sortFn?: SortFn<PromptTableFeatures, ParticipantRow>

  enableColumnFilter?: boolean
  filterFn?: FilterFn<PromptTableFeatures, ParticipantRow>

  extraData: {
    courseParticipationID: string
    value: TValue
    stringValue?: string
  }[]
}

export function buildParticipantRows(
  participants: CoursePhaseParticipationWithStudent[],
  extraColumns: ExtraParticipantColumn<any>[],
): ParticipantRow[] {
  return participants.map((p) => {
    const extraValues: Record<string, unknown> = {}

    for (const col of extraColumns) {
      extraValues[col.id] =
        col.extraData.find((d) => d.courseParticipationID === p.courseParticipationID)?.value ??
        null
    }

    return {
      id: p.courseParticipationID,

      coursePhaseID: p.coursePhaseID,
      courseParticipationID: p.courseParticipationID,
      passStatus: p.passStatus,

      restrictedData: p.restrictedData,
      studentReadableData: p.studentReadableData,
      prevData: p.prevData,

      student: p.student,

      firstName: p.student.firstName,
      lastName: p.student.lastName,
      email: p.student.email,
      matriculationNumber: p.student.matriculationNumber,
      universityLogin: p.student.universityLogin,
      gender: p.student.gender,
      nationality: p.student.nationality,
      studyDegree: p.student.studyDegree,
      studyProgram: p.student.studyProgram,
      currentSemester: p.student.currentSemester,

      ...extraValues,
    }
  })
}
