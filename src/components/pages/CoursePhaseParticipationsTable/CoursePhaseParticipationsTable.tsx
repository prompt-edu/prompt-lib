import type { CoursePhaseParticipationWithStudent } from '@tumaet/prompt-shared-state'
import { useMemo } from 'react'
import { PromptTableURL, type RowAction, type TableFilter } from '@/components'
import { type ExportDeps, getParticipantActions } from './table/participationActions'
import { getParticipantColumns } from './table/participationColumns'
import { getParticipantFilters } from './table/participationFilters'
import {
  buildParticipantRows,
  type ExtraParticipantColumn,
  type ParticipantRow,
} from './table/participationRow'
import { useParticipantBatchActions } from './utils/updateBatch'

interface CoursePhaseParticipationsTablePageProps {
  phaseId: string
  participants: CoursePhaseParticipationWithStudent[]
  extraColumns?: ExtraParticipantColumn<any>[]
  extraFilters?: TableFilter[]
  extraActions?: RowAction<ParticipantRow>[]
  exportDeps?: ExportDeps
  onClickRowAction?: (row: ParticipantRow) => void
}

export const CoursePhaseParticipationsTable = ({
  phaseId,
  participants,
  extraColumns = [],
  extraFilters = [],
  extraActions = [],
  exportDeps = {},
  onClickRowAction,
}: CoursePhaseParticipationsTablePageProps) => {
  const data = useMemo(
    () => buildParticipantRows(participants, extraColumns),
    [participants, extraColumns],
  )

  const columns = useMemo(() => getParticipantColumns(extraColumns), [extraColumns])

  const filters = useMemo(() => getParticipantFilters(extraFilters), [extraFilters])

  const { setPassed, setFailed } = useParticipantBatchActions(phaseId)
  const actions = useMemo(
    () =>
      getParticipantActions({ setPassed, setFailed }, extraActions, exportDeps ?? {}, extraColumns),
    [setPassed, setFailed, extraActions, exportDeps, extraColumns],
  )

  return (
    <PromptTableURL<ParticipantRow>
      data={data}
      columns={columns}
      filters={filters}
      actions={actions}
      onRowClick={(row) => onClickRowAction?.(row)}
      initialState={{ columnVisibility: { matriculationNumber: false, universityLogin: false } }}
    />
  )
}
