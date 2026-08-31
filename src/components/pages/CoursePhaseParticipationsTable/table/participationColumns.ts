import { getGenderString, getStudyDegreeString, type PassStatus } from '@tumaet/prompt-shared-state'
import type { PromptTableColumnDef } from '@/components/table/PromptTable/tableFeatures'
import { getCountryName } from '@/lib/getCountries'
import { getStatusBadge } from '@/lib/getStatusBadge'
import type { ExtraParticipantColumn, ParticipantRow } from './participationRow'

export function getParticipantColumns(
  extraColumns: ExtraParticipantColumn<any>[],
): PromptTableColumnDef<ParticipantRow, any>[] {
  return [
    {
      accessorKey: 'firstName',
      header: 'First name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'matriculationNumber',
      header: 'Matriculation #',
    },
    {
      accessorKey: 'universityLogin',
      header: 'Login',
    },
    {
      // The accessors below resolve the stored codes to the labels the table shows, so
      // sorting and search operate on the same text the lecturer sees.
      id: 'gender',
      header: 'Gender',
      accessorFn: (row) => (row.gender ? getGenderString(row.gender) : ''),
    },
    {
      id: 'nationality',
      header: 'Nationality',
      accessorFn: (row) =>
        row.nationality ? (getCountryName(row.nationality) ?? row.nationality) : '',
    },
    {
      id: 'studyDegree',
      header: 'Study Degree',
      accessorFn: (row) => (row.studyDegree ? getStudyDegreeString(row.studyDegree) : ''),
    },
    {
      accessorKey: 'studyProgram',
      header: 'Study Program',
    },
    {
      accessorKey: 'currentSemester',
      header: 'Semester',
    },
    {
      accessorKey: 'passStatus',
      header: 'Status',
      cell: (info) => getStatusBadge(info.getValue() as PassStatus),
    },

    ...extraColumns.map(
      (col): PromptTableColumnDef<ParticipantRow, any> => ({
        id: col.id,
        header: col.header,
        accessorFn: col.accessorFn!,
        cell: col.cell,
        enableSorting: col.enableSorting,
        sortFn: col.sortFn,
        enableColumnFilter: col.enableColumnFilter,
        filterFn: col.filterFn,
      }),
    ),
  ]
}
