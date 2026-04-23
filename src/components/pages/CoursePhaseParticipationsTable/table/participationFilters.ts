import { getStatusBadge, getStatusString } from '@/lib/getStatusBadge'
import { PassStatus } from '@tumaet/prompt-shared-state'
import { TableFilter } from '@/components'

export function getParticipantFilters(extraFilters: TableFilter[] = []): TableFilter[] {
  return [
    {
      type: 'select',
      id: 'passStatus',
      label: 'Status',
      options: Object.values(PassStatus),
      optionLabel: (v) => getStatusBadge(v as PassStatus),
      badge: {
        label: 'Status',
        displayValue: function (filtervalue: unknown): string {
          const p = filtervalue as PassStatus
          return getStatusString(p)
        },
      },
    },
    ...extraFilters,
  ]
}
