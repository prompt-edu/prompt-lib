import {
  Gender,
  getGenderString,
  getStudyDegreeString,
  PassStatus,
  type Student,
  StudyDegree,
} from '@tumaet/prompt-shared-state'
import { getCountryName } from './getCountries'
import { getStatusString } from './getStatusString'

export interface DemographicGroup<T> {
  shortLabel: string
  label: string
  items: T[]
}

export interface StatisticsParticipation {
  student: Student
  passStatus: PassStatus
}

export type DemographicStack = 'passStatus' | 'studyDegree'

export interface DemographicSegment {
  key: string
  label: string
  color: string
}

export type DemographicChartRow = {
  shortLabel: string
  label: string
  total: number
  share: number
  topSegment?: string
} & Record<string, string | number | undefined>

type StudentAccessor<T> = (item: T) => Student

export interface DemographicStudyProgram {
  name: string
  shortName?: string | null
}

const UNKNOWN = 'Unknown'
const OTHER = 'Other'
const MAX_SEMESTER = 12

const group = <T>(shortLabel: string, label: string, items: T[]): DemographicGroup<T> => ({
  shortLabel,
  label,
  items,
})

const groupIfAny = <T>(label: string, items: T[]): DemographicGroup<T>[] =>
  items.length > 0 ? [group(label, label, items)] : []

const isOneOf = <V extends string>(values: V[], value: string | undefined): value is V =>
  value !== undefined && (values as string[]).includes(value)

export function groupByGender<T>(
  items: T[],
  getStudent: StudentAccessor<T>,
): DemographicGroup<T>[] {
  const genders = Object.values(Gender)
  const known = genders.map((gender) =>
    group(
      gender === Gender.PREFER_NOT_TO_SAY ? 'Unstated' : getGenderString(gender),
      getGenderString(gender),
      items.filter((item) => getStudent(item).gender === gender),
    ),
  )
  const unknown = items.filter((item) => !isOneOf(genders, getStudent(item).gender))
  return [...known, ...groupIfAny(UNKNOWN, unknown)]
}

export function groupByStudyProgram<T>(
  items: T[],
  getStudent: StudentAccessor<T>,
  studyPrograms: DemographicStudyProgram[],
): DemographicGroup<T>[] {
  const programOf = (item: T) => getStudent(item).studyProgram?.trim()
  const names = new Set(studyPrograms.map(({ name }) => name))
  const listed = studyPrograms.map(({ name, shortName }) =>
    group(
      shortName ?? name,
      name,
      items.filter((item) => programOf(item) === name),
    ),
  )
  const other = items.filter((item) => {
    const program = programOf(item)
    return !!program && !names.has(program)
  })
  const unknown = items.filter((item) => !programOf(item))
  return [...listed, group(OTHER, OTHER, other), ...groupIfAny(UNKNOWN, unknown)]
}

export function groupByNationality<T>(
  items: T[],
  getStudent: StudentAccessor<T>,
  limit = 6,
): DemographicGroup<T>[] {
  const byCode = new Map<string, T[]>()
  const unknown: T[] = []
  for (const item of items) {
    const code = getStudent(item).nationality
    if (!code) {
      unknown.push(item)
      continue
    }
    const members = byCode.get(code)
    if (members) {
      members.push(item)
    } else {
      byCode.set(code, [item])
    }
  }

  const countries = [...byCode]
    .map(([code, members]) => group(code, getCountryName(code) ?? code, members))
    .sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label))
  // Folding a single country into "Other" would hide its name without saving a bar.
  const shown = countries.length > limit + 1 ? limit : countries.length
  const other = countries.slice(shown).flatMap((country) => country.items)
  return [
    ...countries.slice(0, shown),
    ...groupIfAny(OTHER, other),
    ...groupIfAny(UNKNOWN, unknown),
  ]
}

export function groupBySemester<T>(
  items: T[],
  getStudent: StudentAccessor<T>,
): DemographicGroup<T>[] {
  const bucketOf = (item: T) => {
    const semester = getStudent(item).currentSemester
    if (semester === undefined || semester < 1) return undefined
    return Math.min(semester, MAX_SEMESTER + 1)
  }
  const buckets = [...new Set(items.map(bucketOf))]
    .filter((bucket) => bucket !== undefined)
    .sort((a, b) => a - b)
  const semesters = buckets.map((bucket) => {
    const label = bucket > MAX_SEMESTER ? `${MAX_SEMESTER + 1}+` : String(bucket)
    return group(
      label,
      label,
      items.filter((item) => bucketOf(item) === bucket),
    )
  })
  const unknown = items.filter((item) => bucketOf(item) === undefined)
  return [...semesters, ...groupIfAny(UNKNOWN, unknown)]
}

interface Segment extends DemographicSegment {
  matches: (item: StatisticsParticipation) => boolean
}

const PASS_STATUS_COLORS: Record<PassStatus, string> = {
  [PassStatus.PASSED]: 'hsl(var(--success))',
  [PassStatus.FAILED]: 'hsl(var(--destructive))',
  [PassStatus.NOT_ASSESSED]: 'hsl(var(--muted))',
}

const STUDY_DEGREE_COLORS: Record<StudyDegree, string> = {
  [StudyDegree.BACHELOR]: 'hsl(var(--primary))',
  [StudyDegree.MASTER]: 'hsl(var(--chart-blue))',
}

const getSegments = (
  stackBy: DemographicStack | undefined,
  passStatusLabels: Partial<Record<PassStatus, string>>,
): Segment[] => {
  if (stackBy === 'passStatus') {
    return Object.values(PassStatus).map((status) => ({
      key: status,
      label: passStatusLabels[status] ?? getStatusString(status),
      color: PASS_STATUS_COLORS[status],
      matches: (item) => item.passStatus === status,
    }))
  }
  if (stackBy === 'studyDegree') {
    const degrees = Object.values(StudyDegree)
    return [
      ...degrees.map((degree) => ({
        key: degree,
        label: getStudyDegreeString(degree),
        color: STUDY_DEGREE_COLORS[degree],
        matches: (item: StatisticsParticipation) => item.student.studyDegree === degree,
      })),
      {
        key: 'unknown',
        label: UNKNOWN,
        color: 'hsl(var(--muted))',
        matches: (item) => !isOneOf(degrees, item.student.studyDegree),
      },
    ]
  }
  return [{ key: 'students', label: 'Students', color: 'hsl(var(--primary))', matches: () => true }]
}

export const formatDemographicShare = ({ total, share }: DemographicChartRow) =>
  total > 0 && share < 1 ? '<1%' : `${share}%`

export function getDemographicChartData(
  groups: DemographicGroup<StatisticsParticipation>[],
  stackBy?: DemographicStack,
  passStatusLabels: Partial<Record<PassStatus, string>> = {},
): { segments: DemographicSegment[]; rows: DemographicChartRow[] } {
  const segments = getSegments(stackBy, passStatusLabels).filter((segment) =>
    groups.some(({ items }) => items.some(segment.matches)),
  )
  const itemCount = groups.reduce((sum, { items }) => sum + items.length, 0)

  const rows = groups.map(({ shortLabel, label, items }) => {
    const counts = segments.map((segment): [string, number] => [
      segment.key,
      items.filter(segment.matches).length,
    ])
    return {
      shortLabel,
      label,
      total: items.length,
      share: itemCount > 0 ? Math.round((items.length / itemCount) * 100) : 0,
      topSegment: counts.findLast(([, count]) => count > 0)?.[0],
      ...Object.fromEntries(counts),
    }
  })

  return {
    segments: segments.map(({ key, label, color }) => ({ key, label, color })),
    rows,
  }
}
