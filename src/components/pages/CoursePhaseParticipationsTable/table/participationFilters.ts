import { PassStatus } from '@tumaet/prompt-shared-state'
import type { TableFilter } from '@/components'
import { getStatusBadge } from '@/lib/getStatusBadge'
import { getStatusString } from '@/lib/getStatusString'
import type { ParticipantRow } from './participationRow'

export function getParticipantFilters(
  extraFilters: TableFilter<ParticipantRow>[] = [],
): TableFilter<ParticipantRow>[] {
  return [
    {
      type: 'select',
      id: 'passStatus',
      label: 'Status',
      options: Object.values(PassStatus),
      optionLabel: (v) => getStatusBadge(v as PassStatus),
      badge: {
        label: 'Status',
        displayValue: (filtervalue: unknown): string => {
          const p = filtervalue as PassStatus
          return getStatusString(p)
        },
      },
    },
    ...extraFilters,
  ]
}
