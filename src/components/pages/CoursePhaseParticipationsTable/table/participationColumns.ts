import type { ColumnDef } from '@tanstack/react-table'
import type { PassStatus } from '@tumaet/prompt-shared-state'
import { getStatusBadge } from '@/lib/getStatusBadge'
import type { ExtraParticipantColumn, ParticipantRow } from './participationRow'

export function getParticipantColumns(
  extraColumns: ExtraParticipantColumn<any>[],
): ColumnDef<ParticipantRow, any>[] {
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
      accessorKey: 'matriculationNumber',
      header: 'Matriculation #',
    },
    {
      accessorKey: 'universityLogin',
      header: 'Login',
    },
    {
      accessorKey: 'passStatus',
      header: 'Status',
      cell: (info) => getStatusBadge(info.getValue() as PassStatus),
    },

    ...extraColumns.map(
      (col): ColumnDef<ParticipantRow, any> => ({
        id: col.id,
        header: col.header,
        accessorFn: col.accessorFn!,
        cell: col.cell,
        enableSorting: col.enableSorting,
        sortingFn: col.sortingFn,
        enableColumnFilter: col.enableColumnFilter,
        filterFn: col.filterFn,
      }),
    ),
  ]
}
