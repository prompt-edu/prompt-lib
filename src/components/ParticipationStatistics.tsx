import type { PassStatus } from '@tumaet/prompt-shared-state'
import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DemographicDistributionCard,
  PassStatusSummary,
  ScoreDistributionCard,
} from '@/components'
import {
  type DemographicStudyProgram,
  groupByGender,
  groupByNationality,
  groupBySemester,
  groupByStudyDegree,
  groupByStudyProgram,
  type StatisticsParticipation,
} from '@/lib/demographics'

interface ParticipationStatisticsProps {
  participations: StatisticsParticipation[]
  studyPrograms: DemographicStudyProgram[]
  passStatusLabels?: Partial<Record<PassStatus, string>>
  scores?: number[]
  scoreTitle?: string
  children?: ReactNode
}

const byStudent = ({ student }: StatisticsParticipation) => student

export const ParticipationStatistics = ({
  participations,
  studyPrograms,
  passStatusLabels,
  scores,
  scoreTitle,
  children,
}: ParticipationStatisticsProps) => (
  <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
    {children}
    <Card className='flex flex-col w-full h-full'>
      <CardHeader className='items-center'>
        <CardTitle>Status</CardTitle>
        <CardDescription>Participants by assessment status</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 flex items-center justify-center'>
        <PassStatusSummary
          participations={participations}
          passStatusLabels={passStatusLabels}
          size={160}
          className='flex-col'
        />
      </CardContent>
    </Card>
    {scores && <ScoreDistributionCard scores={scores} title={scoreTitle} />}
    <DemographicDistributionCard
      title='Study Degree'
      groups={groupByStudyDegree(participations, byStudent)}
      stackBy='passStatus'
      passStatusLabels={passStatusLabels}
    />
    <DemographicDistributionCard
      title='Study Program'
      groups={groupByStudyProgram(participations, byStudent, studyPrograms)}
      stackBy='passStatus'
      passStatusLabels={passStatusLabels}
    />
    <DemographicDistributionCard
      title='Semester'
      description='Stacked by study degree'
      groups={groupBySemester(participations, byStudent)}
      stackBy='studyDegree'
    />
    <DemographicDistributionCard
      title='Gender'
      groups={groupByGender(participations, byStudent)}
      stackBy='passStatus'
      passStatusLabels={passStatusLabels}
    />
    <DemographicDistributionCard
      title='Nationality'
      groups={groupByNationality(participations, byStudent)}
      stackBy='passStatus'
      passStatusLabels={passStatusLabels}
    />
  </div>
)
