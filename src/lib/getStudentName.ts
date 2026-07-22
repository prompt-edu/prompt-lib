export const getStudentName = (student: { firstName?: string; lastName?: string }): string =>
  [student.firstName, student.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')
