import {
  type CoursePhaseParticipationWithStudent,
  type Gender,
  getGenderString,
  getStudyDegreeString,
  type StudyDegree,
} from '@tumaet/prompt-shared-state'
import { saveAs } from 'file-saver'
import { getCountryName } from '@/lib/getCountries'
import type { ExtraParticipantColumn } from '../table/participationRow'

export const DEFAULT_EXPORT_FILENAME = 'participation-export'

// Keeps the export in sync with the labels the table shows instead of writing the stored codes.
const headerValueDisplayMap: Record<string, (value: unknown) => string> = {
  gender: (value) => getGenderString(value as Gender),
  nationality: (value) => getCountryName(value as string) ?? String(value),
  studyDegree: (value) => getStudyDegreeString(value as StudyDegree),
}

export const downloadParticipations = (
  data: CoursePhaseParticipationWithStudent[],
  prevDataKeys: string[],
  restrictedDataKeys: string[],
  studentReadableDataKeys: string[],
  extraColumns: ExtraParticipantColumn<any>[] = [],
  filename = `${DEFAULT_EXPORT_FILENAME}.csv`,
) => {
  if (!data || data.length === 0) {
    console.error('No data available to download.')
    return
  }

  const headerDisplayMap: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    matriculationNumber: 'Matriculation Number',
    universityLogin: 'University Login',
    hasUniversityAccount: 'Has University Account',
    courseParticipationID: 'Course Participation ID',
    gender: 'Gender',
    nationality: 'Nationality',
    studyDegree: 'Study Degree',
    studyProgram: 'Study Program',
    currentSemester: 'Current Semester',
    passStatus: 'Pass Status',
  }

  const baseHeaders = [
    'firstName',
    'lastName',
    'email',
    'matriculationNumber',
    'universityLogin',
    'hasUniversityAccount',
    'courseParticipationID',
    'gender',
    'nationality',
    'studyDegree',
    'studyProgram',
    'currentSemester',
    'passStatus',
    ...prevDataKeys,
    ...restrictedDataKeys,
    ...studentReadableDataKeys,
  ]

  const extraHeaders = extraColumns.map((col) => col.header)
  const csvHeaders = [...new Set([...baseHeaders, ...extraHeaders])]

  const csvRows = data.map((row) => {
    const student = (row.student || {}) as unknown as Record<string, unknown>

    return csvHeaders
      .map((header) => {
        if (header in student) {
          const value = student[header]
          const toDisplayValue = headerValueDisplayMap[header]
          return JSON.stringify(value && toDisplayValue ? toDisplayValue(value) : (value ?? ''))
        } else if (header === 'passStatus') {
          return JSON.stringify(row.passStatus ?? '')
        } else if (prevDataKeys.includes(header)) {
          return JSON.stringify(row.prevData[header] ?? '')
        } else if (restrictedDataKeys.includes(header)) {
          return JSON.stringify(row.restrictedData[header] ?? '')
        } else if (studentReadableDataKeys.includes(header)) {
          return JSON.stringify(row.studentReadableData[header] ?? '')
        } else if (header === 'courseParticipationID') {
          return JSON.stringify(row.courseParticipationID ?? '')
        } else {
          const matchingExtraColumn = extraColumns.find((col) => col.header === header)
          if (matchingExtraColumn) {
            const extraDataItem = matchingExtraColumn.extraData.find(
              (item) => item.courseParticipationID === row.courseParticipationID,
            )
            return JSON.stringify(extraDataItem?.stringValue ?? '')
          }
          return JSON.stringify('')
        }
      })
      .join(';')
  })

  const stringifiedHeaders = csvHeaders.map((header) =>
    JSON.stringify(headerDisplayMap[header] ?? header),
  )

  const csvContent = [stringifiedHeaders.join(';'), ...csvRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}
