import { Gender, PassStatus, type Student, StudyDegree } from '@tumaet/prompt-shared-state'
import { describe, expect, it } from 'vitest'
import {
  type DemographicGroup,
  getDemographicChartData,
  groupByGender,
  groupByNationality,
  groupBySemester,
  groupByStudyProgram,
  type StatisticsParticipation,
} from './demographics'

const participation = (
  student: Partial<Student> = {},
  passStatus = PassStatus.NOT_ASSESSED,
): StatisticsParticipation => ({
  student: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: '',
    hasUniversityAccount: true,
    ...student,
  },
  passStatus,
})

const byStudent = (p: StatisticsParticipation) => p.student

const summary = <T>(groups: DemographicGroup<T>[]) =>
  groups.map(({ shortLabel, label, items }) => [shortLabel, label, items.length])

describe('groupByGender', () => {
  it('keeps every gender and counts a missing one as Unknown', () => {
    const items = [
      participation({ gender: Gender.FEMALE }),
      participation({ gender: Gender.FEMALE }),
      participation({ gender: Gender.PREFER_NOT_TO_SAY }),
      participation(),
    ]

    expect(summary(groupByGender(items, byStudent))).toEqual([
      ['Male', 'Male', 0],
      ['Female', 'Female', 2],
      ['Diverse', 'Diverse', 0],
      ['Unstated', 'Prefer not to say', 1],
      ['Unknown', 'Unknown', 1],
    ])
  })

  it('omits Unknown when every gender is set', () => {
    const groups = groupByGender([participation({ gender: Gender.MALE })], byStudent)

    expect(groups.map((g) => g.label)).not.toContain('Unknown')
  })

  it('reads the student through the accessor', () => {
    const items = [{ participation: participation({ gender: Gender.DIVERSE }) }]

    const groups = groupByGender(items, (item) => item.participation.student)

    expect(groups[2].items).toEqual(items)
  })
})

describe('groupByStudyProgram', () => {
  it('folds free-text programs into Other and missing ones into Unknown', () => {
    const items = [
      participation({ studyProgram: 'Computer Science' }),
      participation({ studyProgram: ' Computer Science ' }),
      participation({ studyProgram: 'Physics' }),
      participation({ studyProgram: 'Other' }),
      participation({ studyProgram: '' }),
      participation(),
    ]

    expect(summary(groupByStudyProgram(items, byStudent))).toEqual([
      ['CS', 'Computer Science', 2],
      ['IS', 'Information Systems', 0],
      ['GE', 'Games Engineering', 0],
      ['M&T', 'Management and Technology', 0],
      ['Other', 'Other', 2],
      ['Unknown', 'Unknown', 2],
    ])
  })
})

describe('groupByNationality', () => {
  const withNationalities = (...codes: (string | undefined)[]) =>
    codes.map((nationality) => participation({ nationality }))

  it('sorts by count, then by country name', () => {
    const items = withNationalities('FR', 'DE', 'DE', 'AT')

    expect(summary(groupByNationality(items, byStudent))).toEqual([
      ['DE', 'Germany', 2],
      ['AT', 'Austria', 1],
      ['FR', 'France', 1],
    ])
  })

  it('folds the countries beyond the limit into Other', () => {
    const items = withNationalities('DE', 'DE', 'FR', 'IT', 'ES', undefined)

    expect(summary(groupByNationality(items, byStudent, 2))).toEqual([
      ['DE', 'Germany', 2],
      ['FR', 'France', 1],
      ['Other', 'Other', 2],
      ['Unknown', 'Unknown', 1],
    ])
  })

  it('shows one country past the limit instead of an Other bar', () => {
    const items = withNationalities('DE', 'FR', 'IT')

    expect(groupByNationality(items, byStudent, 2).map((g) => g.shortLabel)).toEqual([
      'FR',
      'DE',
      'IT',
    ])
  })

  it('falls back to the code for an unknown country', () => {
    expect(summary(groupByNationality(withNationalities('XX'), byStudent))).toEqual([
      ['XX', 'XX', 1],
    ])
  })
})

describe('groupBySemester', () => {
  it('sorts semesters numerically, caps them at 13+, and treats invalid ones as Unknown', () => {
    const items = [10, 2, 2, 13, 20, 0, undefined].map((currentSemester) =>
      participation({ currentSemester }),
    )

    expect(summary(groupBySemester(items, byStudent))).toEqual([
      ['2', '2', 2],
      ['10', '10', 1],
      ['13+', '13+', 2],
      ['Unknown', 'Unknown', 2],
    ])
  })
})

describe('getDemographicChartData', () => {
  const groups: DemographicGroup<StatisticsParticipation>[] = [
    {
      shortLabel: 'A',
      label: 'Group A',
      items: [
        participation({ studyDegree: StudyDegree.MASTER }, PassStatus.PASSED),
        participation({ studyDegree: StudyDegree.BACHELOR }, PassStatus.FAILED),
        participation({}, PassStatus.PASSED),
      ],
    },
    { shortLabel: 'B', label: 'Group B', items: [participation({}, PassStatus.PASSED)] },
    { shortLabel: 'C', label: 'Group C', items: [] },
  ]

  it('counts one segment per pass status and the share of all items', () => {
    const { segments, rows } = getDemographicChartData(groups, 'passStatus')

    expect(segments.map((s) => [s.key, s.label])).toEqual([
      ['passed', 'Passed'],
      ['failed', 'Failed'],
    ])
    expect(rows).toEqual([
      {
        shortLabel: 'A',
        label: 'Group A',
        total: 3,
        share: 75,
        topSegment: 'failed',
        passed: 2,
        failed: 1,
      },
      {
        shortLabel: 'B',
        label: 'Group B',
        total: 1,
        share: 25,
        topSegment: 'passed',
        passed: 1,
        failed: 0,
      },
      {
        shortLabel: 'C',
        label: 'Group C',
        total: 0,
        share: 0,
        topSegment: undefined,
        passed: 0,
        failed: 0,
      },
    ])
  })

  it('uses the pass status label overrides', () => {
    const { segments } = getDemographicChartData(groups, 'passStatus', {
      [PassStatus.PASSED]: 'Accepted',
    })

    expect(segments.map((s) => s.label)).toEqual(['Accepted', 'Failed'])
  })

  it('stacks by study degree with a segment for a missing degree', () => {
    const { segments, rows } = getDemographicChartData(groups, 'studyDegree')

    expect(segments.map((s) => [s.key, s.label])).toEqual([
      ['bachelor', 'Bachelor'],
      ['master', 'Master'],
      ['unknown', 'Unknown'],
    ])
    expect(rows[0]).toMatchObject({ bachelor: 1, master: 1, unknown: 1, topSegment: 'unknown' })
  })

  it('counts every item in a single segment without a stack', () => {
    const { segments, rows } = getDemographicChartData(groups)

    expect(segments.map((s) => s.key)).toEqual(['students'])
    expect(rows.map((row) => row.students)).toEqual([3, 1, 0])
  })

  it('returns zero shares when there are no items', () => {
    const { segments, rows } = getDemographicChartData([{ shortLabel: 'A', label: 'A', items: [] }])

    expect(segments).toEqual([])
    expect(rows).toEqual([
      { shortLabel: 'A', label: 'A', total: 0, share: 0, topSegment: undefined },
    ])
  })
})
